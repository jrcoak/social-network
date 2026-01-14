import { TabBar } from '@/components/ui';
import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner, Badge, Button, TabBar } from '@/components/ui';
import type { Database } from '@/types/database.types';

type Event = Database['public']['Tables']['events']['Row'] & {
  profiles: {
    first_name: string;
    last_name: string;
  };
  event_rsvps: Array<{
    user_id: string;
    status: string;
  }>;
};

export default function Events() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const now = new Date().toISOString();
      
      let query = supabase
        .from('events')
        .select(`
          *,
          profiles:created_by (
            first_name,
            last_name
          ),
          event_rsvps (
            user_id,
            status
          )
        `)
        .eq('status', 'approved');

      if (filter === 'upcoming') {
        query = query.gte('start_time', now);
      } else {
        query = query.lt('start_time', now);
      }

      query = query.order('start_time', { ascending: filter === 'upcoming' });

      const { data, error } = await query;

      if (error) throw error;
      setEvents(data as any || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (eventId: string, status: 'going' | 'maybe' | 'not_going') => {
    if (!user) return;

    try {
      const { error } = await supabase.from('event_rsvps').upsert({
        event_id: eventId,
        user_id: user.id,
        status,
      });

      if (error) throw error;
      
      // Refresh events to update RSVP counts
      fetchEvents();
    } catch (error) {
      console.error('Error updating RSVP:', error);
      alert('Failed to update RSVP');
    }
  };

  const getUserRSVP = (event: Event) => {
    if (!user) return null;
    return event.event_rsvps.find((rsvp) => rsvp.user_id === user.id);
  };

  const getRSVPCounts = (event: Event) => {
    const going = event.event_rsvps.filter((r) => r.status === 'going').length;
    const maybe = event.event_rsvps.filter((r) => r.status === 'maybe').length;
    return { going, maybe };
  };

  const renderEvent = ({ item }: { item: Event }) => {
    const userRSVP = getUserRSVP(item);
    const { going, maybe } = getRSVPCounts(item);
    const startDate = new Date(item.start_time);

    return (
      <View className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        {/* Event header */}
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-900">{item.title}</Text>
            <Text className="text-sm text-gray-600 mt-1">
              {startDate.toLocaleDateString([], {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
              {' at '}
              {startDate.toLocaleTimeString([], {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </Text>
          </View>
          <Badge variant={item.event_type === 'in_person' ? 'primary' : 'secondary'}>
            {item.event_type === 'in_person' ? 'In Person' : 'Virtual'}
          </Badge>
        </View>

        {/* Location */}
        {item.location && (
          <Text className="text-sm text-gray-600 mb-2">📍 {item.location}</Text>
        )}

        {/* Description */}
        {item.description && (
          <Text className="text-sm text-gray-700 mb-3" numberOfLines={3}>
            {item.description}
          </Text>
        )}

        {/* Organizer */}
        <Text className="text-xs text-gray-500 mb-3">
          Organized by {item.profiles.first_name} {item.profiles.last_name}
        </Text>

        {/* RSVP counts */}
        <View className="flex-row items-center mb-3">
          <Text className="text-sm text-gray-600">
            {going} going · {maybe} maybe
          </Text>
        </View>

        {/* RSVP buttons */}
        {profile?.status === 'approved' && (
          <View className="flex-row gap-2">
            <TouchableOpacity
              className={`flex-1 py-2 rounded-lg border ${
                userRSVP?.status === 'going'
                  ? 'bg-green-600 border-green-600'
                  : 'bg-white border-gray-300'
              }`}
              onPress={() => handleRSVP(item.id, 'going')}
            >
              <Text
                className={`text-center font-medium ${
                  userRSVP?.status === 'going' ? 'text-white' : 'text-gray-700'
                }`}
              >
                Going
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-2 rounded-lg border ${
                userRSVP?.status === 'maybe'
                  ? 'bg-yellow-500 border-yellow-500'
                  : 'bg-white border-gray-300'
              }`}
              onPress={() => handleRSVP(item.id, 'maybe')}
            >
              <Text
                className={`text-center font-medium ${
                  userRSVP?.status === 'maybe' ? 'text-white' : 'text-gray-700'
                }`}
              >
                Maybe
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-2 rounded-lg border ${
                userRSVP?.status === 'not_going'
                  ? 'bg-gray-600 border-gray-600'
                  : 'bg-white border-gray-300'
              }`}
              onPress={() => handleRSVP(item.id, 'not_going')}
            >
              <Text
                className={`text-center font-medium ${
                  userRSVP?.status === 'not_going' ? 'text-white' : 'text-gray-700'
                }`}
              >
                Can't Go
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading events..." />;
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-4 pt-12 pb-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900 mb-4">Events</Text>
        
        {/* Filter tabs */}
        <View className="flex-row gap-2">
          <TouchableOpacity
            className={`flex-1 py-2 rounded-lg ${
              filter === 'upcoming' ? 'bg-primary-600' : 'bg-gray-200'
            }`}
            onPress={() => setFilter('upcoming')}
          >
            <Text
              className={`text-center font-medium ${
                filter === 'upcoming' ? 'text-white' : 'text-gray-700'
              }`}
            >
              Upcoming
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-2 rounded-lg ${
              filter === 'past' ? 'bg-primary-600' : 'bg-gray-200'
            }`}
            onPress={() => setFilter('past')}
          >
            <Text
              className={`text-center font-medium ${
                filter === 'past' ? 'text-white' : 'text-gray-700'
              }`}
            >
              Past
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Events list */}
      <FlatList
        data={events}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id}
        contentContainerClassName="p-4"
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center p-8">
            <Text className="text-gray-500 text-center">
              {filter === 'upcoming' ? 'No upcoming events' : 'No past events'}
            </Text>
          </View>
        }
      />

      {/* Create event button */}
      {profile?.status === 'approved' && (
        <View className="p-4 bg-white border-t border-gray-200">
          <Button onPress={() => router.push('/event-create')}>
            Create Event
          </Button>
        </View>
      )}
      <TabBar />
    </View>
  );
}
