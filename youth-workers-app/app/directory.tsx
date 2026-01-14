import { View, Text, ScrollView, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner, Avatar, Badge, TabBar, EmptyState } from '@/components/ui';
import type { Profile } from '@/types';

export default function Directory() {
  const router = useRouter();
  const [members, setMembers] = useState<Profile[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const states = ['MA', 'NH', 'ME', 'VT', 'RI', 'CT'];

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [searchQuery, selectedState, members]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('status', 'approved')
        .order('first_name');

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterMembers = () => {
    let filtered = members;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (member) =>
          member.first_name?.toLowerCase().includes(query) ||
          member.last_name?.toLowerCase().includes(query) ||
          member.organization_name?.toLowerCase().includes(query) ||
          member.role_title?.toLowerCase().includes(query)
      );
    }

    if (selectedState) {
      filtered = filtered.filter((member) => member.organization_state === selectedState);
    }

    setFilteredMembers(filtered);
  };

  const sendConnectionRequest = async (userId: string) => {
    try {
      const { error } = await supabase.from('connections').insert({
        user_id: userId,
        connected_user_id: userId,
        status: 'pending',
      });
      if (error) throw error;
      alert('Connection request sent!');
    } catch (error) {
      console.error('Error sending connection request:', error);
      alert('Failed to send connection request');
    }
  };

  const renderMember = ({ item }: { item: Profile }) => (
    <View className="flex-row items-center p-5 mx-4 mb-3 bg-white rounded-2xl shadow-md">
      <Avatar
        name={`${item.first_name} ${item.last_name}`}
        imageUrl={item.profile_picture_url}
        size="md"
      />
      <View className="flex-1 ml-3">
        <Text className="text-base font-semibold text-gray-900">
          {item.first_name} {item.last_name}
        </Text>
        <Text className="text-sm text-gray-600">{item.role_title}</Text>
        <Text className="text-sm text-gray-500">{item.organization_name}</Text>
      </View>
      <View className="items-end gap-1">
        <Badge variant="secondary">{item.organization_state}</Badge>
        <TouchableOpacity
          className="px-3 py-1 bg-primary-600 rounded-lg mt-1"
          onPress={() => sendConnectionRequest(item.id)}
        >
          <Text className="text-white text-xs font-medium">Connect</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading members..." />;
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-6 pt-14 pb-4 bg-white">
        <Text className="text-4xl font-bold text-gray-900 mb-4">Directory</Text>
        
        {/* Search */}
        <TextInput
          className="bg-gray-100 rounded-lg px-4 py-3 text-base"
          placeholder="Search members..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* State filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-3 -mx-4 px-4"
        >
          <TouchableOpacity
            className={`px-4 py-2 rounded-full mr-2 ${
              !selectedState ? 'bg-primary-600' : 'bg-gray-200'
            }`}
            onPress={() => setSelectedState(null)}
          >
            <Text
              className={`text-sm font-medium ${
                !selectedState ? 'text-white' : 'text-gray-700'
              }`}
            >
              All States
            </Text>
          </TouchableOpacity>
          {states.map((state) => (
            <TouchableOpacity
              key={state}
              className={`px-4 py-2 rounded-full mr-2 ${
                selectedState === state ? 'bg-primary-600' : 'bg-gray-200'
              }`}
              onPress={() => setSelectedState(state)}
            >
              <Text
                className={`text-sm font-medium ${
                  selectedState === state ? 'text-white' : 'text-gray-700'
                }`}
              >
                {state}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Members list */}
      <FlatList
        data={filteredMembers}
        renderItem={renderMember}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <EmptyState
            icon="🔍"
            title={searchQuery || selectedState ? 'No members found' : 'No members yet'}
            description={
              searchQuery || selectedState
                ? 'Try adjusting your search or filters'
                : 'Members will appear here once they are approved'
            }
          />
        }
      />
      <TabBar />
    </View>
  );
}
