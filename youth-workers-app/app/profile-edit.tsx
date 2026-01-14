import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Select, LoadingSpinner } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/lib/supabase';
import { NEW_ENGLAND_STATES } from '@/constants/States';

const profileSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  role_title: z.string().min(1, 'Role/title is required'),
  organization_name: z.string().min(1, 'Organization name is required'),
  organization_address: z.string().min(1, 'Address is required'),
  organization_city: z.string().min(1, 'City is required'),
  organization_state: z.enum(['MA', 'NH', 'ME', 'VT', 'RI', 'CT']),
  organization_zip: z.string().min(5, 'Valid ZIP code is required'),
  bio: z.string().min(20, 'Bio must be at least 20 characters'),
  hire_month: z.number().min(1).max(12),
  hire_year: z.number().min(1900).max(new Date().getFullYear()),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileEdit() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      phone: profile?.phone || '',
      role_title: profile?.role_title || '',
      organization_name: profile?.organization_name || '',
      organization_address: profile?.organization_address || '',
      organization_city: profile?.organization_city || '',
      organization_state: profile?.organization_state || 'MA',
      organization_zip: profile?.organization_zip || '',
      bio: profile?.bio || '',
      hire_month: profile?.hire_month || 1,
      hire_year: profile?.hire_year || new Date().getFullYear(),
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    try {
      setSubmitting(true);
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
          role_title: data.role_title,
          organization_name: data.organization_name,
          organization_address: data.organization_address,
          organization_city: data.organization_city,
          organization_state: data.organization_state,
          organization_zip: data.organization_zip,
          bio: data.bio,
          hire_month: data.hire_month,
          hire_year: data.hire_year,
        })
        .eq('id', user.id);

      if (error) throw error;

      await useAuthStore.getState().fetchProfile();
      router.back();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <View className="flex-1 bg-white">
      <View className="px-4 pt-12 pb-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">Edit Profile</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        <View className="gap-4">
          <Controller
            control={control}
            name="first_name"
            render={({ field: { onChange, value } }) => (
              <Input
                label="First Name"
                value={value}
                onChangeText={onChange}
                error={errors.first_name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="last_name"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Last Name"
                value={value}
                onChangeText={onChange}
                error={errors.last_name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Phone"
                value={value}
                onChangeText={onChange}
                error={errors.phone?.message}
                keyboardType="phone-pad"
              />
            )}
          />

          <Controller
            control={control}
            name="role_title"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Role/Title"
                value={value}
                onChangeText={onChange}
                error={errors.role_title?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="organization_name"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Organization"
                value={value}
                onChangeText={onChange}
                error={errors.organization_name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="organization_address"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Address"
                value={value}
                onChangeText={onChange}
                error={errors.organization_address?.message}
              />
            )}
          />

          <View className="flex-row gap-4">
            <Controller
              control={control}
              name="organization_city"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="City"
                  value={value}
                  onChangeText={onChange}
                  error={errors.organization_city?.message}
                  containerClassName="flex-1"
                />
              )}
            />

            <Controller
              control={control}
              name="organization_state"
              render={({ field: { onChange, value } }) => (
                <Select
                  label="State"
                  value={value}
                  onChange={onChange}
                  options={NEW_ENGLAND_STATES}
                  error={errors.organization_state?.message}
                  containerClassName="flex-1"
                />
              )}
            />
          </View>

          <Controller
            control={control}
            name="organization_zip"
            render={({ field: { onChange, value } }) => (
              <Input
                label="ZIP Code"
                value={value}
                onChangeText={onChange}
                error={errors.organization_zip?.message}
                keyboardType="number-pad"
              />
            )}
          />

          <Controller
            control={control}
            name="bio"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Bio"
                value={value}
                onChangeText={onChange}
                error={errors.bio?.message}
                multiline
                numberOfLines={4}
              />
            )}
          />

          <View className="flex-row gap-4">
            <Controller
              control={control}
              name="hire_month"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Hire Month"
                  value={value.toString()}
                  onChangeText={(text) => onChange(parseInt(text) || 1)}
                  error={errors.hire_month?.message}
                  keyboardType="number-pad"
                  containerClassName="flex-1"
                />
              )}
            />

            <Controller
              control={control}
              name="hire_year"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Hire Year"
                  value={value.toString()}
                  onChangeText={(text) => onChange(parseInt(text) || new Date().getFullYear())}
                  error={errors.hire_year?.message}
                  keyboardType="number-pad"
                  containerClassName="flex-1"
                />
              )}
            />
          </View>
        </View>
      </ScrollView>

      <View className="px-4 py-4 border-t border-gray-200 gap-3">
        <Button onPress={handleSubmit(onSubmit)} loading={submitting}>
          Save Changes
        </Button>
        <Button variant="outline" onPress={() => router.back()}>
          Cancel
        </Button>
      </View>
    </View>
  );
}
