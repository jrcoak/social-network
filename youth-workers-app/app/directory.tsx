import { View, Text, ScrollView, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner, Avatar, Badge } from '@/components/ui';
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

  const renderMember = ({ item }: { item: Profile }) => (
    <TouchableOpacity
      className="flex-row items-center p-4 border-b border-gray-200 bg-white"
      onPress={() => {
        // TODO: Navigate to member profile
        console.log('View profile:', item.id);
      }}
    >
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
      <Badge variant="secondary">{item.organization_state}</Badge>
    </TouchableOpacity>
  );

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading members..." />;
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 pt-12 pb-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900 mb-4">Directory</Text>
        
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
          <View className="flex-1 justify-center items-center p-8">
            <Text className="text-gray-500 text-center">
              {searchQuery || selectedState
                ? 'No members found matching your filters'
                : 'No members yet'}
            </Text>
          </View>
        }
      />
    </View>
  );
}
