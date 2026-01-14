import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner, Avatar, Badge, Button } from '@/components/ui';
import type { Profile } from '@/types';

export default function AdminPanel() {
  const router = useRouter();
  const { isAdmin, profile } = useAuth();
  const [pendingUsers, setPendingUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      router.replace('/(tabs)');
      return;
    }
    fetchPendingUsers();
  }, [isAdmin]);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPendingUsers(data || []);
    } catch (error) {
      console.error('Error fetching pending users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (userId: string, approved: boolean) => {
    try {
      setProcessing(userId);
      const { error } = await supabase
        .from('profiles')
        .update({
          status: approved ? 'approved' : 'rejected',
        })
        .eq('id', userId);

      if (error) throw error;

      // Refresh list
      await fetchPendingUsers();
      
      alert(`User ${approved ? 'approved' : 'rejected'} successfully`);
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Failed to update user status');
    } finally {
      setProcessing(null);
    }
  };

  if (!isAdmin) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-6">
        <Text className="text-xl font-bold text-gray-900 mb-2">Access Denied</Text>
        <Text className="text-gray-600 text-center">
          You don't have permission to access the admin panel.
        </Text>
      </View>
    );
  }

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading admin panel..." />;
  }

  const renderPendingUser = ({ item }: { item: Profile }) => (
    <View className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      {/* User info */}
      <View className="flex-row items-start mb-3">
        <Avatar
          name={`${item.first_name} ${item.last_name}`}
          imageUrl={item.profile_picture_url}
          size="md"
        />
        <View className="flex-1 ml-3">
          <Text className="text-lg font-bold text-gray-900">
            {item.first_name} {item.last_name}
          </Text>
          <Text className="text-sm text-gray-600">{item.email}</Text>
          <Text className="text-sm text-gray-600">{item.phone}</Text>
        </View>
        <Badge variant="warning">Pending</Badge>
      </View>

      {/* Organization info */}
      <View className="mb-3 p-3 bg-gray-50 rounded-lg">
        <Text className="text-sm font-semibold text-gray-900 mb-1">
          {item.role_title}
        </Text>
        <Text className="text-sm text-gray-700">{item.organization_name}</Text>
        <Text className="text-sm text-gray-600">
          {item.organization_address}
        </Text>
        <Text className="text-sm text-gray-600">
          {item.organization_city}, {item.organization_state} {item.organization_zip}
        </Text>
      </View>

      {/* Bio */}
      {item.bio && (
        <View className="mb-3">
          <Text className="text-sm font-semibold text-gray-900 mb-1">Bio</Text>
          <Text className="text-sm text-gray-700">{item.bio}</Text>
        </View>
      )}

      {/* Dates */}
      <View className="mb-3">
        <Text className="text-xs text-gray-500">
          Birth: {item.birth_month}/{item.birth_day}
          {item.birth_year && `/${item.birth_year}`}
        </Text>
        <Text className="text-xs text-gray-500">
          Hire Date: {item.hire_month}/{item.hire_year}
        </Text>
        <Text className="text-xs text-gray-500">
          Applied: {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>

      {/* Action buttons */}
      <View className="flex-row gap-2">
        <TouchableOpacity
          className="flex-1 py-3 bg-green-600 rounded-lg"
          onPress={() => handleApproval(item.id, true)}
          disabled={processing === item.id}
        >
          <Text className="text-center font-semibold text-white">
            {processing === item.id ? 'Processing...' : 'Approve'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 py-3 bg-red-600 rounded-lg"
          onPress={() => handleApproval(item.id, false)}
          disabled={processing === item.id}
        >
          <Text className="text-center font-semibold text-white">
            {processing === item.id ? 'Processing...' : 'Reject'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-4 pt-12 pb-4 bg-white border-b border-gray-200">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-2xl font-bold text-gray-900">Admin Panel</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-primary-600 font-medium">Back</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-sm text-gray-600">
          {pendingUsers.length} pending approval{pendingUsers.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Pending users list */}
      <FlatList
        data={pendingUsers}
        renderItem={renderPendingUser}
        keyExtractor={(item) => item.id}
        contentContainerClassName="p-4"
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center p-8">
            <Text className="text-gray-500 text-center">
              No pending user approvals
            </Text>
          </View>
        }
      />
    </View>
  );
}
