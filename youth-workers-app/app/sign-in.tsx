import { View, Text, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Button, LoadingSpinner } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';

export default function SignIn() {
  const router = useRouter();
  const { signIn, loading, isAuthenticated, profile } = useAuth();

  useEffect(() => {
    if (isAuthenticated && profile) {
      // Check if profile is complete
      const isProfileComplete = 
        profile.first_name &&
        profile.last_name &&
        profile.phone &&
        profile.role_title &&
        profile.organization_name &&
        profile.bio;

      if (!isProfileComplete) {
        router.replace('/(auth)/onboarding');
      } else {
        router.replace('/(tabs)');
      }
    }
  }, [isAuthenticated, profile]);

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error('Sign in failed:', error);
      // TODO: Show error toast/alert
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading..." />;
  }

  return (
    <View className="flex-1 bg-gradient-to-b from-primary-50 to-white">
      <View className="flex-1 justify-center items-center px-6">
        {/* Logo */}
        <View className="w-32 h-32 bg-primary-600 rounded-3xl items-center justify-center mb-8 shadow-medium">
          <Text className="text-6xl">🤝</Text>
        </View>

        {/* Title */}
        <Text className="text-4xl font-bold text-gray-900 text-center mb-3">
          Youth Workers NE
        </Text>
        <Text className="text-lg text-gray-600 text-center mb-12 max-w-md leading-relaxed">
          Connect, collaborate, and grow with youth workers across New England
        </Text>

        {/* Sign in button */}
        <Button
          onPress={handleSignIn}
          loading={loading}
          className="w-full max-w-sm shadow-soft"
          size="lg"
        >
          🔐 Sign in with Google
        </Button>

        {/* Info text */}
        <View className="mt-8 max-w-md bg-blue-50 rounded-xl p-4 border border-blue-100">
          <Text className="text-sm text-blue-900 text-center font-medium mb-1">
            Private Community
          </Text>
          <Text className="text-sm text-blue-700 text-center">
            Your account will be reviewed by an administrator before you can access all features.
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View className="p-6">
        <Text className="text-xs text-gray-500 text-center">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
  );
}
