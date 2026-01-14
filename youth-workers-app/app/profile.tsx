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
    <View className="flex-1 bg-gray-50">
      <ScrollView>
        <ProfileHeader
          profile={profile}
          isOwnProfile
          onEditPress={() => router.push('/profile-edit')}
        />

        <ProfileDetails profile={profile} canViewPrivate />

        <View className="p-4 gap-3">
          <Button onPress={() => router.push('/connections')}>
            My Connections
          </Button>
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
    </View>
  );
}
