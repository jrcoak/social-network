import { View, Text, ScrollView } from 'react-native';
import { Card, TabBar } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const { profile } = useAuth();

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-4 pt-12 pb-4 border-b border-instagram-border">
          <Text className="text-2xl font-bold text-black">
            Youth Workers NE
          </Text>
        </View>

      <View className="p-4 gap-4">
        {/* Welcome */}
        <View className="py-4">
          <Text className="text-base font-semibold text-black mb-1">
            Welcome back, {profile?.first_name}
          </Text>
          <Text className="text-sm text-gray-500">
            Connect with youth workers across New England
          </Text>
        </View>

        {/* Quick Stats */}
        <View className="flex-row gap-3">
          <View className="flex-1 bg-white border border-instagram-border rounded-lg p-4 items-center">
            <Text className="text-2xl font-bold text-black mb-1">6</Text>
            <Text className="text-xs text-gray-500">States</Text>
          </View>
          <View className="flex-1 bg-white border border-instagram-border rounded-lg p-4 items-center">
            <Text className="text-2xl font-bold text-black mb-1">150+</Text>
            <Text className="text-xs text-gray-500">Members</Text>
          </View>
          <View className="flex-1 bg-white border border-instagram-border rounded-lg p-4 items-center">
            <Text className="text-2xl font-bold text-black mb-1">10</Text>
            <Text className="text-xs text-gray-500">Channels</Text>
          </View>
        </View>

        {/* Recent Activity */}
        <View className="border-t border-instagram-border pt-4">
          <Text className="text-base font-semibold text-black mb-3">
            Recent Activity
          </Text>
          <Text className="text-sm text-gray-500">
            No recent activity yet. Start by exploring the directory or joining a chat channel!
          </Text>
        </View>

        {/* Upcoming Events */}
        <View className="border-t border-instagram-border pt-4">
          <Text className="text-base font-semibold text-black mb-3">
            Upcoming Events
          </Text>
          <Text className="text-sm text-gray-500">
            No upcoming events. Check the Events tab to see what's happening!
          </Text>
        </View>

        {/* Quick Actions */}
        <View className="border-t border-instagram-border pt-4">
          <Text className="text-base font-semibold text-black mb-3">
            Quick Actions
          </Text>
          <View className="gap-2">
            <Text className="text-sm text-gray-700">• Browse the member directory</Text>
            <Text className="text-sm text-gray-700">• Join a state or topic channel</Text>
            <Text className="text-sm text-gray-700">• View the interactive map</Text>
            <Text className="text-sm text-gray-700">• Check out upcoming events</Text>
          </View>
        </View>
        </View>
      </ScrollView>
      <TabBar showAdminTab={profile?.role === 'admin'} />
    </View>
  );
}
