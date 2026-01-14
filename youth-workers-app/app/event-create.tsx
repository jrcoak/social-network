import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Select, LoadingSpinner } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  start_time: z.string().min(1, 'Start date/time is required'),
  end_time: z.string().optional(),
  event_type: z.enum(['in_person', 'virtual']),
  location: z.string().optional(),
  virtual_link: z.string().url().optional().or(z.literal('')),
});

type EventFormData = z.infer<typeof eventSchema>;

export default function EventCreate() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      start_time: '',
      end_time: '',
      event_type: 'in_person',
      location: '',
      virtual_link: '',
    },
  });

  const eventType = watch('event_type');

  const onSubmit = async (data: EventFormData) => {
    if (!user) return;

    try {
      setSubmitting(true);
      const { error } = await supabase.from('events').insert({
        title: data.title,
        description: data.description,
        start_time: new Date(data.start_time).toISOString(),
        end_time: data.end_time ? new Date(data.end_time).toISOString() : null,
        event_type: data.event_type,
        location: data.event_type === 'in_person' ? data.location : null,
        virtual_link: data.event_type === 'virtual' ? data.virtual_link : null,
        created_by: user.id,
        status: isAdmin ? 'approved' : 'pending',
      });

      if (error) throw error;

      alert(isAdmin ? 'Event created!' : 'Event submitted for approval');
      router.back();
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="px-4 pt-12 pb-4 bg-white border-b border-gray-200 shadow-soft">
        <Text className="text-2xl font-bold text-gray-900">📅 Create Event</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        <View className="gap-4">
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Event Title"
                value={value}
                onChangeText={onChange}
                error={errors.title?.message}
                placeholder="Youth Group Gathering"
              />
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Description"
                value={value}
                onChangeText={onChange}
                error={errors.description?.message}
                placeholder="Describe your event..."
                multiline
                numberOfLines={4}
              />
            )}
          />

          <Controller
            control={control}
            name="start_time"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Start Date & Time"
                value={value}
                onChangeText={onChange}
                error={errors.start_time?.message}
                placeholder="YYYY-MM-DD HH:MM"
                helperText="Format: 2024-12-25 14:30"
              />
            )}
          />

          <Controller
            control={control}
            name="end_time"
            render={({ field: { onChange, value } }) => (
              <Input
                label="End Date & Time (Optional)"
                value={value}
                onChangeText={onChange}
                error={errors.end_time?.message}
                placeholder="YYYY-MM-DD HH:MM"
              />
            )}
          />

          <Controller
            control={control}
            name="event_type"
            render={({ field: { onChange, value } }) => (
              <Select
                label="Event Type"
                value={value}
                onChange={onChange}
                options={[
                  { label: 'In Person', value: 'in_person' },
                  { label: 'Virtual', value: 'virtual' },
                ]}
                error={errors.event_type?.message}
              />
            )}
          />

          {eventType === 'in_person' && (
            <Controller
              control={control}
              name="location"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Location"
                  value={value}
                  onChangeText={onChange}
                  error={errors.location?.message}
                  placeholder="123 Main St, Boston, MA"
                />
              )}
            />
          )}

          {eventType === 'virtual' && (
            <Controller
              control={control}
              name="virtual_link"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Meeting Link"
                  value={value}
                  onChangeText={onChange}
                  error={errors.virtual_link?.message}
                  placeholder="https://zoom.us/j/..."
                  keyboardType="url"
                />
              )}
            />
          )}
        </View>
      </ScrollView>

      <View className="px-4 py-4 border-t border-gray-200 gap-3">
        <Button onPress={handleSubmit(onSubmit)} loading={submitting}>
          {isAdmin ? 'Create Event' : 'Submit for Approval'}
        </Button>
        <Button variant="outline" onPress={() => router.back()}>
          Cancel
        </Button>
      </View>
    </View>
  );
}
