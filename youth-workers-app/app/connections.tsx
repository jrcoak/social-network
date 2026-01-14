import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner, Avatar, Badge, Button, TabBar } from '@/components/ui';

type Connection = {
  id: string;
  user_id: string;
  connected_user_id: string;
  status: string;
  requested_at: string;
  profiles: {
    id: string;
    first_name: string;
    last_name: string;
    profile_picture_url: string | null;
    role_title: string;
    organization_name: string;
  };
};

export default function Connections() {
  const router = useRouter();
  const { user } = useAuth();
  const [tab, setTab] = useState<'accepted' | 'pending'>('accepted');
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConnections();
  }, [tab]);

  const fetchConnections = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('connections')
        .select(`
          *,
          profiles:connected_user_id (
            id,
            first_name,
            last_name,
            profile_picture_url,
            role_title,
            organization_name
          )
        `)
        .eq('user_id', user.id)
        .eq('status', tab)
        .order('requested_at', { ascending: false });

      if (error) throw error;
      setConnections(data as any || []);
    } catch (error) {
      console.error('Error fetching connections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectionAction = async (connectionId: string, action: 'accept' | 'reject' | 'remove') => {
    try {
      if (action === 'remove') {
        const { error } = await supabase
          .from('connections')
          .delete()
          .eq('id', connectionId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('connections')
          .update({ status: action === 'accept' ? 'accepted' : 'rejected' })
          .eq('id', connectionId);
        if (error) throw error;
      }
      fetchConnections();
    } catch (error) {
      console.error('Error handling connection:', error);
      alert('Failed to update connection');
    }
  };

  const renderConnection = ({ item }: { item: Connection }) => (
    <View className="flex-row items-center p-4 mb-2 mx-4 bg-white rounded-xl shadow-soft border border-gray-100">
      <Avatar
        name={`${item.profiles.first_name} ${item.profiles.last_name}`}
        imageUrl={item.profiles.profile_picture_url}
        size="md"
      />
      <View className="flex-1 ml-3">
        <Text className="text-base font-semibold text-gray-900">
          {item.profiles.first_name} {item.profiles.last_name}
        </Text>
        <Text className="text-sm text-gray-600">{item.profiles.role_title}</Text>
        <Text className="text-sm text-gray-500">{item.profiles.organization_name}</Text>
      </View>
      {tab === 'pending' ? (
        <View className="flex-row gap-2">
          <TouchableOpacity
            className="px-3 py-2 bg-green-600 rounded-lg"
            onPress={() => handleConnectionAction(item.id, 'accept')}
          >
            <Text className="text-white text-xs font-medium">Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="px-3 py-2 bg-red-600 rounded-lg"
            onPress={() => handleConnectionAction(item.id, 'reject')}
          >
            <Text className="text-white text-xs font-medium">Reject</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          className="px-3 py-2 bg-gray-200 rounded-lg"
          onPress={() => handleConnectionAction(item.id, 'remove')}
        >
          <Text className="text-gray-700 text-xs font-medium">Remove</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading connections..." />;
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="px-4 pt-12 pb-4 bg-white border-b border-gray-200 shadow-soft">
        <Text className="text-2xl font-bold text-gray-900 mb-4">Connections</Text>

        <View className="flex-row gap-2">
          <TouchableOpacity
            className={`flex-1 py-2 rounded-lg ${
              tab === 'accepted' ? 'bg-primary-600' : 'bg-gray-200'
            }`}
            onPress={() => setTab('accepted')}
          >
            <Text
              className={`text-center font-medium ${
                tab === 'accepted' ? 'text-white' : 'text-gray-700'
              }`}
            >
              Connected
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-2 rounded-lg ${
              tab === 'pending' ? 'bg-primary-600' : 'bg-gray-200'
            }`}
            onPress={() => setTab('pending')}
          >
            <Text
              className={`text-center font-medium ${
                tab === 'pending' ? 'text-white' : 'text-gray-700'
              }`}
            >
              Requests
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={connections}
        renderItem={renderConnection}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center p-8">
            <Text className="text-gray-500 text-center">
              {tab === 'accepted' ? 'No connections yet' : 'No pending requests'}
            </Text>
          </View>
        }
      />
      <TabBar />
    </View>
  );
}
