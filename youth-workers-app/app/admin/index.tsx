import { View, Text, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner, Avatar, Badge, Button } from '@/components/ui';
import type { Profile } from '@/types';

type Event = {
  id: string;
  title: string;
  description: string;
  start_time: string;
  event_type: string;
  location: string | null;
  virtual_link: string | null;
  status: string;
  created_at: string;
  profiles: {
    first_name: string;
    last_name: string;
  };
};

export default function AdminPanel() {
  const router = useRouter();
  const { isAdmin, profile } = useAuth();
  const [tab, setTab] = useState<'users' | 'events'>('users');
  const [userFilter, setUserFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [users, setUsers] = useState<Profile[]>([]);
  const [pendingEvents, setPendingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      router.replace('/(tabs)');
      return;
    }
    fetchUsers();
    fetchPendingEvents();
  }, [isAdmin, userFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (userFilter !== 'all') {
        query = query.eq('status', userFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          profiles:created_by (
            first_name,
            last_name
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPendingEvents(data as any || []);
    } catch (error) {
      console.error('Error fetching pending events:', error);
    }
  };

  const handleUserApproval = async (userId: string, approved: boolean) => {
    try {
      setProcessing(userId);
      const { error } = await supabase
        .from('profiles')
        .update({
          status: approved ? 'approved' : 'rejected',
        })
        .eq('id', userId);

      if (error) throw error;
      await fetchUsers();
      Alert.alert('Success', `User ${approved ? 'approved' : 'rejected'} successfully`);
    } catch (error) {
      console.error('Error updating user status:', error);
      Alert.alert('Error', 'Failed to update user status');
    } finally {
      setProcessing(null);
    }
  };

  const handleToggleAdmin = async (userId: string, currentRole: string) => {
    try {
      setProcessing(userId);
      const newRole = currentRole === 'admin' ? 'member' : 'admin';
      const { error } = await supabase
        .from('profiles')
        .update({
          role: newRole,
        })
        .eq('id', userId);

      if (error) throw error;
      await fetchUsers();
      Alert.alert('Success', `User role updated to ${newRole} successfully`);
    } catch (error) {
      console.error('Error updating user role:', error);
      Alert.alert('Error', 'Failed to update user role');
    } finally {
      setProcessing(null);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${userName}? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setProcessing(userId);
              const { error } = await supabase
                .from('profiles')
                .delete()
                .eq('id', userId);

              if (error) throw error;
              await fetchUsers();
              Alert.alert('Success', `User ${userName} deleted successfully`);
            } catch (error) {
              console.error('Error deleting user:', error);
              Alert.alert('Error', 'Failed to delete user');
            } finally {
              setProcessing(null);
            }
          },
        },
      ]
    );
  };

  const handleEventApproval = async (eventId: string, approved: boolean) => {
    try {
      setProcessing(eventId);
      const { error } = await supabase
        .from('events')
        .update({
          status: approved ? 'approved' : 'rejected',
        })
        .eq('id', eventId);

      if (error) throw error;
      await fetchPendingEvents();
      Alert.alert('Success', `Event ${approved ? 'approved' : 'rejected'} successfully`);
    } catch (error) {
      console.error('Error updating event status:', error);
      Alert.alert('Error', 'Failed to update event status');
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

  const renderUser = ({ item }: { item: Profile }) => (
    <View className="bg-white border border-instagram-border rounded-lg p-4 mb-4">
      {/* User info */}
      <View className="flex-row items-start mb-3">
        <Avatar
          name={`${item.first_name} ${item.last_name}`}
          imageUrl={item.profile_picture_url}
          size="md"
        />
        <View className="flex-1 ml-3">
          <Text className="text-lg font-bold text-black">
            {item.first_name} {item.last_name}
          </Text>
          <Text className="text-sm text-gray-600">{item.email}</Text>
          <Text className="text-sm text-gray-600">{item.phone}</Text>
        </View>
        <View className="gap-1">
          <Badge variant={item.status === 'approved' ? 'success' : item.status === 'pending' ? 'warning' : 'danger'}>
            {item.status}
          </Badge>
          {item.role === 'admin' && (
            <Badge variant="primary">Admin</Badge>
          )}
        </View>
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
          Hire Date: {item.hire_month}/{item.hire_year}
        </Text>
        <Text className="text-xs text-gray-500">
          Applied: {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>

      {/* Action buttons */}
      <View className="gap-2">
        {item.status === 'pending' && (
          <View className="flex-row gap-2">
            <TouchableOpacity
              className="flex-1 py-3 bg-green-600 rounded-lg"
              onPress={() => handleUserApproval(item.id, true)}
              disabled={processing === item.id}
            >
              <Text className="text-center font-semibold text-white">
                {processing === item.id ? 'Processing...' : 'Approve'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 py-3 bg-red-600 rounded-lg"
              onPress={() => handleUserApproval(item.id, false)}
              disabled={processing === item.id}
            >
              <Text className="text-center font-semibold text-white">
                {processing === item.id ? 'Processing...' : 'Reject'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <View className="flex-row gap-2">
          <TouchableOpacity
            className="flex-1 py-3 bg-instagram-blue rounded-lg"
            onPress={() => handleToggleAdmin(item.id, item.role || 'member')}
            disabled={processing === item.id}
          >
            <Text className="text-center font-semibold text-white">
              {item.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 py-3 bg-red-500 rounded-lg border border-red-600"
            onPress={() => handleDeleteUser(item.id, `${item.first_name} ${item.last_name}`)}
            disabled={processing === item.id}
          >
            <Text className="text-center font-semibold text-white">
              Delete User
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderPendingEvent = ({ item }: { item: Event }) => (
    <View className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <View className="mb-3">
        <Text className="text-lg font-bold text-gray-900 mb-1">{item.title}</Text>
        <Text className="text-sm text-gray-600">
          {new Date(item.start_time).toLocaleDateString([], {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          })}
        </Text>
        <Badge variant="warning" className="mt-2">
          {item.event_type === 'in_person' ? 'In Person' : 'Virtual'}
        </Badge>
      </View>

      <Text className="text-sm text-gray-700 mb-3">{item.description}</Text>

      {item.location && (
        <Text className="text-sm text-gray-600 mb-2">{item.location}</Text>
      )}
      {item.virtual_link && (
        <Text className="text-sm text-gray-600 mb-2">{item.virtual_link}</Text>
      )}

      <Text className="text-xs text-gray-500 mb-3">
        Created by {item.profiles.first_name} {item.profiles.last_name}
      </Text>

      <View className="flex-row gap-2">
        <TouchableOpacity
          className="flex-1 py-3 bg-green-600 rounded-lg"
          onPress={() => handleEventApproval(item.id, true)}
          disabled={processing === item.id}
        >
          <Text className="text-center font-semibold text-white">
            {processing === item.id ? 'Processing...' : 'Approve'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 py-3 bg-red-600 rounded-lg"
          onPress={() => handleEventApproval(item.id, false)}
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
      <View className="px-4 pt-12 pb-4 bg-white border-b border-gray-200 shadow-soft">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-bold text-gray-900">Admin Panel</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-primary-600 font-medium">Back</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View className="flex-row gap-2">
          <TouchableOpacity
            className={`flex-1 py-2 rounded-lg ${
              tab === 'users' ? 'bg-neutral-200 border-primary' : 'bg-white border-neutral-300'
            }`}
            onPress={() => setTab('users')}
          >
            <Text
              className={`text-center font-medium ${
                tab === 'users' ? 'text-neutral-700' : 'text-neutral-600'
              }`}
            >
              Users ({pendingUsers.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-2 rounded-lg ${
              tab === 'events' ? 'bg-neutral-200 border-primary' : 'bg-white border-neutral-300'
            }`}
            onPress={() => setTab('events')}
          >
            <Text
              className={`text-center font-medium ${
                tab === 'events' ? 'text-neutral-700' : 'text-neutral-600'
              }`}
            >
              Events ({pendingEvents.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {tab === 'users' ? (
        <View className="flex-1">
          {/* User filter tabs */}
          <View className="flex-row gap-2 px-4 pt-4">
            <TouchableOpacity
              className={`flex-1 py-2 rounded-lg border ${
                userFilter === 'all' ? 'bg-black border-black' : 'bg-white border-instagram-border'
              }`}
              onPress={() => setUserFilter('all')}
            >
              <Text className={`text-center text-xs font-semibold ${
                userFilter === 'all' ? 'text-white' : 'text-black'
              }`}>
                All Users
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-2 rounded-lg border ${
                userFilter === 'pending' ? 'bg-black border-black' : 'bg-white border-instagram-border'
              }`}
              onPress={() => setUserFilter('pending')}
            >
              <Text className={`text-center text-xs font-semibold ${
                userFilter === 'pending' ? 'text-white' : 'text-black'
              }`}>
                Pending
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-2 rounded-lg border ${
                userFilter === 'approved' ? 'bg-black border-black' : 'bg-white border-instagram-border'
              }`}
              onPress={() => setUserFilter('approved')}
            >
              <Text className={`text-center text-xs font-semibold ${
                userFilter === 'approved' ? 'text-white' : 'text-black'
              }`}>
                Approved
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={users}
            renderItem={renderUser}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16 }}
            ListEmptyComponent={
              <View className="flex-1 justify-center items-center p-8">
                <Text className="text-gray-500 text-center">
                  No users found
                </Text>
              </View>
            }
          />
        </View>
      ) : (
        <FlatList
          data={pendingEvents}
          renderItem={renderPendingEvent}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center p-8">
              <Text className="text-gray-500 text-center">
                No pending event approvals
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
