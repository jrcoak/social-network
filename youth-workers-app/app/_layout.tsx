import '../global.css';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { LoadingSpinner } from '@/components/ui';

const queryClient = new QueryClient();

function RootLayoutContent() {
  const { initialize, initialized, loading } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  if (!initialized || loading) {
    return <LoadingSpinner fullScreen text="Initializing..." />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(modals)" options={{ presentation: 'modal' }} />
      <Stack.Screen name="admin" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootLayoutContent />
    </QueryClientProvider>
  );
}
