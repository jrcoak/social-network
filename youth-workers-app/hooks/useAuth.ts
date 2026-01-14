import { useAuthStore } from '@/stores/authStore';

export function useAuth() {
  const {
    user,
    session,
    profile,
    roles,
    loading,
    initialized,
    signIn,
    signOut,
    refreshSession,
    isAdmin,
    isModerator,
    isApproved,
  } = useAuthStore();

  return {
    user,
    session,
    profile,
    roles,
    loading,
    initialized,
    signIn,
    signOut,
    refreshSession,
    isAuthenticated: !!user,
    isAdmin: isAdmin(),
    isModerator: isModerator(),
    isApproved: isApproved(),
    isGuest: profile?.status === 'guest',
    isPending: profile?.status === 'pending',
  };
}
