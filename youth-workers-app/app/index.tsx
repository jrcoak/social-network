import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui';

export default function Index() {
  const { isAuthenticated, loading, initialized, profile } = useAuth();

  if (!initialized || loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/sign-in" />;
  }

  // Check if profile needs completion (onboarding)
  if (profile && (!profile.first_name || !profile.last_name || !profile.phone || !profile.bio)) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/chat" />;
}
