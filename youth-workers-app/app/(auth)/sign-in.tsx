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
    <View className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-6">
        {/* Logo */}
        <View className="w-24 h-24 bg-gradient-to-br from-primary-500 to-purple-500 rounded-3xl items-center justify-center mb-8">
          <View className="w-16 h-16 bg-white rounded-2xl" />
        </View>

        {/* Title */}
        <Text className="text-3xl font-bold text-gray-900 text-center mb-2">
          Youth Workers NE
        </Text>
        <Text className="text-base text-gray-600 text-center mb-12 max-w-sm">
          Connect with youth workers across New England
        </Text>

        {/* Sign in button */}
        <Button
          onPress={handleSignIn}
          loading={loading}
          className="w-full max-w-sm"
          size="lg"
        >
          Sign in with Google
        </Button>

        {/* Info text */}
        <Text className="text-sm text-gray-500 text-center mt-8 max-w-sm">
          This is a private community. Your account will need to be approved by an administrator before you can access all features.
        </Text>
      </View>

      {/* Footer */}
      <View className="p-6 border-t border-gray-200">
        <Text className="text-xs text-gray-500 text-center">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
  );
}
