import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import Mapbox from '@rnmapbox/maps';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner, Avatar, Badge, TabBar } from '@/components/ui';
import type { Profile } from '@/types';

// Initialize Mapbox
Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN || '');

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

  // Calculate center of New England
  const newEnglandCenter = [-71.5, 43.5]; // Approximate center
  
  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 pt-12 pb-3 border-b border-instagram-border bg-white">
        <Text className="text-xl font-bold text-black mb-2">Member Map</Text>
        <Text className="text-xs text-gray-500 mb-3">
          Locations are fuzzed for privacy (±5-10 miles)
        </Text>

        {/* State filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="-mx-4 px-4"
        >
          <TouchableOpacity
            className={`px-4 py-1.5 rounded-lg mr-2 border ${
              !selectedState ? 'bg-black border-black' : 'bg-white border-instagram-border'
            }`}
            onPress={() => setSelectedState(null)}
          >
            <Text
              className={`text-xs font-semibold ${
                !selectedState ? 'text-white' : 'text-black'
              }`}
            >
              All States
            </Text>
          </TouchableOpacity>
          {states.map((state) => (
            <TouchableOpacity
              key={state}
              className={`px-4 py-1.5 rounded-lg mr-2 border ${
                selectedState === state ? 'bg-black border-black' : 'bg-white border-instagram-border'
              }`}
              onPress={() => setSelectedState(state)}
            >
              <Text
                className={`text-xs font-semibold ${
                  selectedState === state ? 'text-white' : 'text-black'
                }`}
              >
                {state} ({membersByState[state]?.length || 0})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Mapbox Map */}
      <View className="flex-1">
        <Mapbox.MapView
          style={{ flex: 1 }}
          styleURL="mapbox://styles/mapbox/light-v11"
          zoomEnabled={true}
          scrollEnabled={true}
          pitchEnabled={false}
          rotateEnabled={false}
        >
          <Mapbox.Camera
            zoomLevel={7}
            centerCoordinate={newEnglandCenter}
            animationMode="flyTo"
            animationDuration={1000}
          />

          {/* Member markers with clustering */}
          <Mapbox.ShapeSource
            id="members"
            cluster
            clusterRadius={50}
            clusterMaxZoomLevel={14}
            shape={{
              type: 'FeatureCollection',
              features: filteredMembers
                .filter((member) => member.location)
                .map((member) => {
                  const coords = member.location!
                    .replace('POINT(', '')
                    .replace(')', '')
                    .split(' ')
                    .map(Number);

                  if (coords.length !== 2 || isNaN(coords[0]) || isNaN(coords[1])) {
                    return null;
                  }

                  return {
                    type: 'Feature',
                    properties: {
                      id: member.id,
                      name: `${member.first_name} ${member.last_name}`,
                      initials: `${member.first_name[0]}${member.last_name[0]}`,
                      organization: member.organization_name,
                      city: member.organization_city,
                      state: member.organization_state,
                    },
                    geometry: {
                      type: 'Point',
                      coordinates: coords,
                    },
                  };
                })
                .filter(Boolean) as any,
            }}
          >
            {/* Cluster circles */}
            <Mapbox.CircleLayer
              id="clusters"
              filter={['has', 'point_count']}
              style={{
                circleColor: '#0095F6',
                circleRadius: 20,
                circleOpacity: 0.9,
              }}
            />

            {/* Cluster count */}
            <Mapbox.SymbolLayer
              id="cluster-count"
              filter={['has', 'point_count']}
              style={{
                textField: ['get', 'point_count_abbreviated'],
                textSize: 12,
                textColor: '#ffffff',
                textFont: ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
              }}
            />

            {/* Individual markers */}
            <Mapbox.CircleLayer
              id="member-points"
              filter={['!', ['has', 'point_count']]}
              style={{
                circleColor: '#0095F6',
                circleRadius: 8,
                circleStrokeWidth: 2,
                circleStrokeColor: '#ffffff',
              }}
            />
          </Mapbox.ShapeSource>
        </Mapbox.MapView>

        {/* Member count overlay */}
        <View className="absolute bottom-4 left-4 bg-white border border-instagram-border rounded-lg px-3 py-2">
          <Text className="text-xs font-semibold text-black">
            {filteredMembers.length} {filteredMembers.length === 1 ? 'member' : 'members'}
          </Text>
        </View>
      </View>

      <TabBar showAdminTab={profile?.role === 'admin'} />
    </View>
  );
}
