import { create } from 'zustand';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase, IS_SUPABASE_CONFIGURED } from '@/lib/supabase';
import type { Profile, UserRole } from '@/types';
import { MOCK_PROFILE, MOCK_USER, MOCK_SESSION } from '@/lib/mockData';

interface AuthState {
  user: SupabaseUser | null;
  session: Session | null;
  profile: Profile | null;
  roles: UserRole[];
  loading: boolean;
  initialized: boolean;
}

interface AuthActions {
  setUser: (user: SupabaseUser | null) => void;
  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
  setRoles: (roles: UserRole[]) => void;
  setLoading: (loading: boolean) => void;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  fetchRoles: () => Promise<void>;
  initialize: () => Promise<void>;
  isAdmin: () => boolean;
  isModerator: () => boolean;
  isApproved: () => boolean;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set, get) => ({
  // State
  user: null,
  session: null,
  profile: null,
  roles: [],
  loading: true,
  initialized: false,

  // Actions
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setProfile: (profile) => set({ profile }),
  setRoles: (roles) => set({ roles }),
  setLoading: (loading) => set({ loading }),

  signIn: async () => {
    try {
      set({ loading: true });
      console.log('🚀 Starting Google OAuth, redirect to:', window.location.origin);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      console.log('OAuth response:', { data, error });
      if (error) throw error;
    } catch (error) {
      console.error('❌ Sign in error:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      set({ loading: true });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, session: null, profile: null, roles: [] });
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  refreshSession: async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      set({ session: data.session, user: data.user });
    } catch (error) {
      console.error('Refresh session error:', error);
      throw error;
    }
  },

  fetchProfile: async () => {
    const { user } = get();
    if (!user) {
      console.log('⚠️ Cannot fetch profile: no user');
      return;
    }

    try {
      console.log('🔍 Fetching profile for user:', user.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('❌ Error fetching profile:', error);
        // If profile doesn't exist, it might be a new user
        if (error.code === 'PGRST116') {
          console.log('ℹ️ Profile not found - new user needs onboarding');
        }
        throw error;
      }
      
      console.log('✅ Profile fetched successfully:', data.email);
      set({ profile: data });
    } catch (error) {
      console.error('❌ Fetch profile error:', error);
    }
  },

  fetchRoles: async () => {
    const { user } = get();
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      set({ roles: data || [] });
    } catch (error) {
      console.error('Fetch roles error:', error);
    }
  },

  initialize: async () => {
    try {
      console.log('🔄 Initializing auth...');
      set({ loading: true });
      
      // Use mock data when Supabase is not configured
      if (!IS_SUPABASE_CONFIGURED) {
        console.log('🎭 Preview Mode: Using mock authentication data');
        console.log('Configure Supabase credentials to use real authentication');
        set({
          user: MOCK_USER as any,
          session: MOCK_SESSION as any,
          profile: MOCK_PROFILE,
          roles: [{ id: 'mock-role', user_id: 'mock-user-id', role: 'user', granted_at: new Date().toISOString(), granted_by: null }],
          initialized: true,
          loading: false,
        });
        return;
      }

      console.log('🔍 Checking for existing session...');
      
      // Add timeout to getSession to prevent hanging
      const sessionPromise = supabase.auth.getSession();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Session check timeout')), 5000)
      );
      
      let session = null;
      try {
        const { data, error: sessionError } = await Promise.race([sessionPromise, timeoutPromise]) as any;
        
        if (sessionError) {
          console.error('❌ Error getting session:', sessionError);
        } else {
          session = data?.session;
        }
      } catch (timeoutError) {
        console.warn('⚠️ Session check timed out, continuing without session');
      }
      
      if (session) {
        console.log('✅ Found existing session for:', session.user.email);
      } else {
        console.log('ℹ️ No existing session found');
      }
      
      set({ session, user: session?.user || null });

      // Fetch profile and roles if user exists
      if (session?.user) {
        console.log('👤 Fetching profile and roles...');
        try {
          await Promise.race([
            Promise.all([get().fetchProfile(), get().fetchRoles()]),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Profile fetch timeout')), 5000))
          ]);
          console.log('✅ Profile loaded:', get().profile?.email);
        } catch (error) {
          console.warn('⚠️ Profile fetch timed out or failed:', error);
        }
      }

      // Listen for auth changes
      console.log('👂 Setting up auth state listener...');
      supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('🔐 Auth state changed:', event, 'User:', session?.user?.email);
        set({ session, user: session?.user || null });

        if (session?.user) {
          console.log('✅ User signed in, fetching profile...');
          try {
            await Promise.all([get().fetchProfile(), get().fetchRoles()]);
            console.log('✅ Profile loaded:', get().profile?.email);
          } catch (error) {
            console.error('❌ Error fetching profile after sign in:', error);
          }
        } else {
          console.log('ℹ️ No user session');
          set({ profile: null, roles: [] });
        }
      });

      console.log('✅ Auth initialization complete');
      set({ initialized: true });
    } catch (error) {
      console.error('❌ Initialize auth error:', error);
      // Even if there's an error, mark as initialized so app doesn't hang
      set({ initialized: true });
    } finally {
      set({ loading: false });
    }
  },

  isAdmin: () => {
    const { roles } = get();
    return roles.some((role) => role.role === 'admin');
  },

  isModerator: () => {
    const { roles } = get();
    return roles.some((role) => role.role === 'moderator' || role.role === 'admin');
  },

  isApproved: () => {
    const { profile } = get();
    return profile?.status === 'approved';
  },
}));
