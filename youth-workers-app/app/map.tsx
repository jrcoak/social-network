import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner, Avatar, Badge, TabBar } from '@/components/ui';
import type { Profile } from '@/types';

export default function Map() {
  const { profile } = useAuth();
  const [members, setMembers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const states = ['MA', 'NH', 'ME', 'VT', 'RI', 'CT'];

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('status', 'approved')
        .eq('hide_from_map', false)
        .not('location', 'is', null);

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = selectedState
    ? members.filter((m) => m.organization_state === selectedState)
    : members;

  const getMembersByState = () => {
    const byState: Record<string, Profile[]> = {};
    states.forEach((state) => {
      byState[state] = members.filter((m) => m.organization_state === state);
    });
    return byState;
  };

  const membersByState = getMembersByState();

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading map..." />;
  }

  if (!profile || profile.status !== 'approved') {
    return (
      <View className="flex-1 justify-center items-center bg-white p-6">
        <Text className="text-xl font-bold text-gray-900 mb-2">Map Unavailable</Text>
        <Text className="text-gray-600 text-center">
          Your account needs to be approved by an administrator before you can access the map.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-4 pt-12 pb-4 bg-white border-b border-gray-200 shadow-soft">
        <Text className="text-2xl font-bold text-gray-900 mb-2">Member Map</Text>
        <Text className="text-sm text-gray-600 mb-4">
          Locations are fuzzed for privacy (±5-10 miles)
        </Text>

        {/* State filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="-mx-4 px-4"
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
                {state} ({membersByState[state]?.length || 0})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Map placeholder - would integrate Mapbox here */}
      <View className="h-64 bg-gray-100 border-b border-gray-200 items-center justify-center">
        <Text className="text-gray-500 text-center px-4">
          Interactive map coming soon{'\n'}
          (Requires Mapbox integration)
        </Text>
      </View>

      {/* Members list */}
      <ScrollView className="flex-1">
        <View className="p-4">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            {selectedState ? `Members in ${selectedState}` : 'All Members'} ({filteredMembers.length})
          </Text>
          
          {filteredMembers.map((member) => (
            <View
              key={member.id}
              className="flex-row items-center p-3 bg-white border border-gray-200 rounded-lg mb-2"
            >
              <Avatar
                name={`${member.first_name} ${member.last_name}`}
                imageUrl={member.profile_picture_url}
                size="sm"
              />
              <View className="flex-1 ml-3">
                <Text className="text-base font-semibold text-gray-900">
                  {member.first_name} {member.last_name}
                </Text>
                <Text className="text-sm text-gray-600">{member.organization_name}</Text>
                <Text className="text-sm text-gray-500">
                  {member.organization_city}, {member.organization_state}
                </Text>
              </View>
              <Badge variant="secondary">{member.organization_state}</Badge>
            </View>
          ))}

          {filteredMembers.length === 0 && (
            <View className="py-8">
              <Text className="text-gray-500 text-center">
                No members found in this area
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
