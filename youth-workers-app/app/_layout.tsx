import '../global.css';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { LoadingSpinner } from '@/components/ui';

import { IS_SUPABASE_CONFIGURED } from '@/lib/supabase';

const queryClient = new QueryClient();

function PreviewModeBanner() {
  if (IS_SUPABASE_CONFIGURED) return null;
  
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
    console.log('🚀 App starting...');
    
    // Shorter timeout for faster loading in problematic environments
    const timeout = setTimeout(() => {
      console.warn('⚠️ Initialization timeout - forcing app to load');
      useAuthStore.setState({ initialized: true, loading: false });
    }, 3000); // 3 second timeout for faster recovery
    
    initialize().catch((error) => {
      console.error('❌ Initialization failed:', error);
      // Force load even on error
      useAuthStore.setState({ initialized: true, loading: false });
    });
    
    return () => clearTimeout(timeout);
  }, []);

  if (!initialized || loading) {
    console.log('⏳ App loading...', { initialized, loading });
    return <LoadingSpinner fullScreen text="Initializing..." />;
  }
  
  console.log('✅ App initialized, rendering routes');

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
