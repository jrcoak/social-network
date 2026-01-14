import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, LoadingSpinner, TabBar } from '@/components/ui';
import { ProfileHeader, ProfileDetails } from '@/components/profile';
import { useAuth } from '@/hooks/useAuth';

export default function Profile() {
  const router = useRouter();
  const { profile, signOut, loading, isAdmin } = useAuth();

  if (loading || !profile) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <ProfileHeader
          profile={profile}
          isOwnProfile
          onEditPress={() => {
            // TODO: Navigate to edit profile
            console.log('Edit profile');
          }}
        />

        <ProfileDetails profile={profile} canViewPrivate />

        <View className="p-4 gap-2 border-t border-instagram-border">
          {isAdmin && (
            <Button onPress={() => router.push('/admin')}>
              Admin Panel
            </Button>
          )}
          <Button variant="outline" onPress={signOut}>
            Sign Out
          </Button>
        </View>
      </ScrollView>
      <TabBar showAdminTab={isAdmin} />
    </View>
  );
}
