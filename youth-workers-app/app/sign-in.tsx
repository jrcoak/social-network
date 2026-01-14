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
    <View className="flex-1 bg-neutral-50">
      <View className="flex-1 justify-center items-center px-8">
        {/* Logo */}
        <View className="w-16 h-16 bg-primary rounded-lg items-center justify-center mb-8">
          <View className="w-10 h-10 bg-white rounded" />
        </View>

        {/* Title */}
        <Text className="text-3xl font-semibold text-neutral-900 text-center mb-2">
          Youth Workers NE
        </Text>
        <Text className="text-base text-neutral-600 text-center mb-12 max-w-md">
          Connect with youth workers across New England
        </Text>

        {/* Sign in button */}
        <View className="w-full max-w-sm">
          <Button
            onPress={handleSignIn}
            loading={loading}
            size="lg"
          >
            Sign in with Google
          </Button>
        </View>

        {/* Info */}
        <View className="mt-8 max-w-md bg-neutral-100 rounded-lg p-4 border border-neutral-200">
          <Text className="text-sm text-neutral-700 text-center">
            Your account will be reviewed by an administrator before you can access all features.
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View className="pb-8 px-8">
        <Text className="text-xs text-neutral-500 text-center">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
  );
}
