import { View, ScrollView } from 'react-native';
import { Button, LoadingSpinner } from '@/components/ui';
import { ProfileHeader, ProfileDetails } from '@/components/profile';
import { useAuth } from '@/hooks/useAuth';

export default function Profile() {
  const { profile, signOut, loading } = useAuth();

  if (loading || !profile) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView>
        <ProfileHeader
          profile={profile}
          isOwnProfile
          onEditPress={() => {
            // TODO: Navigate to edit profile
            console.log('Edit profile');
          }}
        />

        <ProfileDetails profile={profile} canViewPrivate />

        <View className="p-4">
          <Button variant="outline" onPress={signOut}>
            Sign Out
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
