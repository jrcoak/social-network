import { View, Text } from 'react-native';
import { Card } from '@/components/ui';
import type { Profile } from '@/types';

interface ProfileDetailsProps {
  profile: Profile;
  canViewPrivate?: boolean;
}

export function ProfileDetails({ profile, canViewPrivate }: ProfileDetailsProps) {
  const formatDate = (month: number, day: number, year?: number | null) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const dateStr = `${monthNames[month - 1]} ${day}`;
    return year ? `${dateStr}, ${year}` : dateStr;
  };

  return (
    <View className="p-4 gap-4">
      <Card>
        <Text className="text-lg font-semibold text-gray-900 mb-3">
          Contact Information
        </Text>

        {profile.public_email && (
          <View className="mb-3">
            <Text className="text-sm text-gray-600 mb-1">Email</Text>
            <Text className="text-base text-gray-900">{profile.public_email}</Text>
          </View>
        )}

        {canViewPrivate && profile.phone && (
          <View className="mb-3">
            <Text className="text-sm text-gray-600 mb-1">Phone</Text>
            <Text className="text-base text-gray-900">{profile.phone}</Text>
          </View>
        )}

        {profile.organization_website && (
          <View>
            <Text className="text-sm text-gray-600 mb-1">Website</Text>
            <Text className="text-base text-primary-600">{profile.organization_website}</Text>
          </View>
        )}
      </Card>

      <Card>
        <Text className="text-lg font-semibold text-gray-900 mb-3">
          Organization
        </Text>

        <View className="mb-3">
          <Text className="text-sm text-gray-600 mb-1">Name</Text>
          <Text className="text-base text-gray-900">{profile.organization_name}</Text>
        </View>

        <View className="mb-3">
          <Text className="text-sm text-gray-600 mb-1">Location</Text>
          <Text className="text-base text-gray-900">
            {profile.organization_city}, {profile.organization_state}
          </Text>
        </View>

        <View>
          <Text className="text-sm text-gray-600 mb-1">Address</Text>
          <Text className="text-base text-gray-900">
            {profile.organization_address}
          </Text>
          <Text className="text-base text-gray-900">
            {profile.organization_city}, {profile.organization_state} {profile.organization_zip}
          </Text>
        </View>
      </Card>

      <Card>
        <Text className="text-lg font-semibold text-gray-900 mb-3">
          Dates
        </Text>

        <View className="mb-3">
          <Text className="text-sm text-gray-600 mb-1">Birthday</Text>
          <Text className="text-base text-gray-900">
            {formatDate(profile.birth_month, profile.birth_day, canViewPrivate ? profile.birth_year : null)}
          </Text>
        </View>

        <View>
          <Text className="text-sm text-gray-600 mb-1">Hire Date</Text>
          <Text className="text-base text-gray-900">
            {formatDate(profile.hire_month, profile.hire_day || 1, profile.hire_year)}
          </Text>
        </View>
      </Card>
    </View>
  );
}
