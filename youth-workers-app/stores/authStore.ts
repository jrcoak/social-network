import { create } from 'zustand';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { Profile, UserRole } from '@/types';

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
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error('Sign in error:', error);
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
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      set({ profile: data });
    } catch (error) {
      console.error('Fetch profile error:', error);
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
      set({ loading: true });

      // Get initial session
      const { data: { session } } = await supabase.auth.getSession();
      set({ session, user: session?.user || null });

      // Fetch profile and roles if user exists
      if (session?.user) {
        await Promise.all([get().fetchProfile(), get().fetchRoles()]);
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        set({ session, user: session?.user || null });

        if (session?.user) {
          await Promise.all([get().fetchProfile(), get().fetchRoles()]);
        } else {
          set({ profile: null, roles: [] });
        }
      });

      set({ initialized: true });
    } catch (error) {
      console.error('Initialize auth error:', error);
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
