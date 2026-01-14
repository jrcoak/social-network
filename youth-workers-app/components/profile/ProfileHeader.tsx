import { View, Text, TouchableOpacity } from 'react-native';
import { Avatar, Badge } from '@/components/ui';
import type { Profile } from '@/types';

interface ProfileHeaderProps {
  profile: Profile;
  isOwnProfile?: boolean;
  onEditPress?: () => void;
}

export function ProfileHeader({ profile, isOwnProfile, onEditPress }: ProfileHeaderProps) {
  const getStatusBadge = () => {
    switch (profile.status) {
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending Approval</Badge>;
      case 'guest':
        return <Badge variant="info">Guest</Badge>;
      case 'suspended':
        return <Badge variant="error">Suspended</Badge>;
      case 'rejected':
        return <Badge variant="error">Rejected</Badge>;
      default:
        return null;
    }
  };

  return (
    <View className="bg-white p-6 border-b border-gray-200">
      <View className="flex-row items-start gap-4">
        <Avatar
          uri={profile.profile_picture_url}
          name={`${profile.first_name} ${profile.last_name}`}
          size="xl"
        />

        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-2xl font-bold text-gray-900">
              {profile.first_name} {profile.last_name}
            </Text>
            {isOwnProfile && onEditPress && (
              <TouchableOpacity
                onPress={onEditPress}
                className="px-3 py-1.5 bg-primary-50 rounded-lg"
              >
                <Text className="text-sm font-medium text-primary-700">
                  Edit
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <Text className="text-base text-gray-700 mb-2">
            {profile.role_title}
          </Text>

          <Text className="text-sm text-gray-600 mb-2">
            {profile.organization_name}
          </Text>

          {getStatusBadge()}
        </View>
      </View>

      {profile.bio && (
        <Text className="text-base text-gray-700 mt-4 leading-6">
          {profile.bio}
        </Text>
      )}

      {profile.ministry_focus_tags && profile.ministry_focus_tags.length > 0 && (
        <View className="flex-row flex-wrap gap-2 mt-4">
          {profile.ministry_focus_tags.map((tag) => (
            <Badge key={tag} variant="default" size="sm">
              {tag}
            </Badge>
          ))}
        </View>
      )}
    </View>
  );
}
