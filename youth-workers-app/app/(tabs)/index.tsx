import { View, Text, ScrollView } from 'react-native';
import { Card } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const { profile } = useAuth();

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4 gap-4">
        {/* Welcome Card */}
        <Card>
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {profile?.first_name}! 👋
          </Text>
          <Text className="text-base text-gray-600">
            Connect with youth workers across New England
          </Text>
        </Card>

        {/* Quick Stats */}
        <View className="flex-row gap-4">
          <Card className="flex-1">
            <Text className="text-3xl font-bold text-primary-600 mb-1">6</Text>
            <Text className="text-sm text-gray-600">States</Text>
          </Card>
          <Card className="flex-1">
            <Text className="text-3xl font-bold text-primary-600 mb-1">150+</Text>
            <Text className="text-sm text-gray-600">Members</Text>
          </Card>
          <Card className="flex-1">
            <Text className="text-3xl font-bold text-primary-600 mb-1">10</Text>
            <Text className="text-sm text-gray-600">Channels</Text>
          </Card>
        </View>

        {/* Recent Activity */}
        <Card>
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Recent Activity
          </Text>
          <Text className="text-base text-gray-600">
            No recent activity yet. Start by exploring the directory or joining a chat channel!
          </Text>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Upcoming Events
          </Text>
          <Text className="text-base text-gray-600">
            No upcoming events. Check the Events tab to see what's happening!
          </Text>
        </Card>

        {/* Quick Actions */}
        <Card>
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Quick Actions
          </Text>
          <View className="gap-2">
            <Text className="text-base text-gray-700">• Browse the member directory</Text>
            <Text className="text-base text-gray-700">• Join a state or topic channel</Text>
            <Text className="text-base text-gray-700">• View the interactive map</Text>
            <Text className="text-base text-gray-700">• Check out upcoming events</Text>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}
