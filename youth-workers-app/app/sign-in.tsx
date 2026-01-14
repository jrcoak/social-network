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
    <View className="flex-1 bg-gradient-to-br from-primary-500 via-purple-500 to-purple-600">
      <View className="flex-1 justify-center items-center px-6">
        {/* Logo */}
        <View className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-3xl items-center justify-center mb-12 border border-white/30">
          <View className="w-16 h-16 bg-white rounded-2xl" />
        </View>

        {/* Title */}
        <Text className="text-5xl font-bold text-white text-center mb-4">
          Youth Workers NE
        </Text>
        <Text className="text-xl text-white/80 text-center mb-16 max-w-md">
          Connect with youth workers across New England
        </Text>

        {/* Sign in button */}
        <View className="w-full max-w-sm">
          <Button
            onPress={handleSignIn}
            loading={loading}
            className="bg-white"
            size="lg"
          >
            <Text className="text-primary-600 font-bold text-lg">Sign in with Google</Text>
          </Button>
        </View>

        {/* Info */}
        <View className="mt-12 max-w-md bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <Text className="text-sm text-white/90 text-center leading-relaxed">
            Your account will be reviewed by an administrator before you can access all features.
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View className="pb-8 px-8">
        <Text className="text-xs text-white/60 text-center">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
  );
}
