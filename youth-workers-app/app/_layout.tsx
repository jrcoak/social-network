import '../global.css';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { LoadingSpinner } from '@/components/ui';

const queryClient = new QueryClient();

// Check if we're in preview mode by checking Supabase URL
const checkPreviewMode = () => {
  try {
    const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
    return !url || url === 'https://placeholder.supabase.co' || url.includes('placeholder');
  } catch {
    return true;
  }
};

const PREVIEW_MODE = checkPreviewMode();

function PreviewModeBanner() {
  if (!PREVIEW_MODE) return null;
  
  return (
    <View className="bg-yellow-500 px-4 py-2">
      <Text className="text-center text-sm font-semibold text-yellow-900">
        🎭 Preview Mode - Using Mock Data (Configure Supabase to enable real authentication)
      </Text>
    </View>
  );
}

function RootLayoutContent() {
  const { initialize, initialized, loading } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  if (!initialized || loading) {
    return <LoadingSpinner fullScreen text="Initializing..." />;
  }

  return (
    <>
      <PreviewModeBanner />
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
    </>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootLayoutContent />
    </QueryClientProvider>
  );
}
