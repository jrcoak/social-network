import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui';

export default function Index() {
  const { isAuthenticated, loading, initialized } = useAuth();

  if (!initialized || loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return <Redirect href="/(tabs)" />;
}
