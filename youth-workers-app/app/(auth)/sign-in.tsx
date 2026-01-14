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
      <View className="flex-1 justify-center items-center px-8">
        {/* Logo - Instagram style */}
        <View className="mb-12">
          <Text className="text-5xl font-bold text-black mb-2" style={{ fontFamily: 'serif' }}>
            YWNE
          </Text>
          <View className="h-0.5 bg-black" />
        </View>

        {/* Title */}
        <Text className="text-xl font-semibold text-black text-center mb-2">
          Youth Workers New England
        </Text>
        <Text className="text-sm text-gray-500 text-center mb-10 max-w-xs">
          Connect with youth workers across New England
        </Text>

        {/* Sign in button */}
        <Button
          onPress={handleSignIn}
          loading={loading}
          className="w-full max-w-xs"
          size="md"
        >
          Sign in with Google
        </Button>

        {/* Info text */}
        <Text className="text-xs text-gray-400 text-center mt-8 max-w-xs leading-5">
          This is a private community. Your account will need to be approved by an administrator.
        </Text>
      </View>

      {/* Footer */}
      <View className="p-6 border-t border-instagram-border">
        <Text className="text-xs text-gray-400 text-center">
          By signing in, you agree to our Terms and Privacy Policy
        </Text>
      </View>
    </View>
  );
}
