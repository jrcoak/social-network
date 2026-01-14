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
import { MINISTRY_FOCUS_TAGS } from '@/constants/Roles';

const onboardingSchema = z.object({
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

type OnboardingFormData = z.infer<typeof onboardingSchema>;

export default function Onboarding() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
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

  const onSubmit = async (data: OnboardingFormData) => {
    if (!user) return;

    try {
      setSubmitting(true);
      console.log('📝 Submitting onboarding data...');
      
      // Update profile in Supabase
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
          status: 'pending', // Set to pending for admin approval
        })
        .eq('id', user.id);

      if (error) {
        console.error('❌ Error updating profile:', error);
        throw error;
      }

      console.log('✅ Profile updated successfully');
      
      // Refresh profile in store
      await useAuthStore.getState().fetchProfile();
      
      // Navigate to tabs
      router.replace('/(tabs)');
    } catch (error) {
      console.error('❌ Onboarding error:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 pt-12 pb-6 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          Complete Your Profile
        </Text>
        <Text className="text-sm text-gray-600">
          Step {step} of 3
        </Text>
        {/* Progress bar */}
        <View className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
          <View
            className="h-full bg-primary-600"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        {step === 1 && (
          <View className="gap-4">
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              Personal Information
            </Text>

            <Controller
              control={control}
              name="first_name"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="First Name"
                  value={value}
                  onChangeText={onChange}
                  error={errors.first_name?.message}
                  placeholder="John"
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
                  placeholder="Doe"
                />
              )}
            />

            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Phone Number"
                  value={value}
                  onChangeText={onChange}
                  error={errors.phone?.message}
                  placeholder="(555) 123-4567"
                  keyboardType="phone-pad"
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
                  placeholder="Tell us about yourself and your ministry..."
                  multiline
                  numberOfLines={4}
                  helperText="Minimum 20 characters"
                />
              )}
            />
          </View>
        )}

        {step === 2 && (
          <View className="gap-4">
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              Organization Details
            </Text>

            <Controller
              control={control}
              name="role_title"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Your Role/Title"
                  value={value}
                  onChangeText={onChange}
                  error={errors.role_title?.message}
                  placeholder="Youth Pastor"
                />
              )}
            />

            <Controller
              control={control}
              name="organization_name"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Organization Name"
                  value={value}
                  onChangeText={onChange}
                  error={errors.organization_name?.message}
                  placeholder="First Church"
                />
              )}
            />

            <Controller
              control={control}
              name="organization_address"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Street Address"
                  value={value}
                  onChangeText={onChange}
                  error={errors.organization_address?.message}
                  placeholder="123 Main St"
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
                    placeholder="Boston"
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
                  placeholder="02101"
                  keyboardType="number-pad"
                />
              )}
            />
          </View>
        )}

        {step === 3 && (
          <View className="gap-4">
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              Employment Information
            </Text>

            <Text className="text-sm text-gray-600 mb-2">
              When did you start in your current role?
            </Text>
            <View className="flex-row gap-4">
              <Controller
                control={control}
                name="hire_month"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Month"
                    value={value.toString()}
                    onChangeText={(text) => onChange(parseInt(text) || 1)}
                    error={errors.hire_month?.message}
                    placeholder="1-12"
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
                    label="Year"
                    value={value.toString()}
                    onChangeText={(text) => onChange(parseInt(text) || new Date().getFullYear())}
                    error={errors.hire_year?.message}
                    placeholder="2020"
                    keyboardType="number-pad"
                    containerClassName="flex-1"
                  />
                )}
              />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer buttons */}
      <View className="px-6 py-4 border-t border-gray-200 gap-3">
        {step < 3 ? (
          <>
            {step > 1 && (
              <Button
                variant="outline"
                onPress={() => setStep(step - 1)}
              >
                Back
              </Button>
            )}
            <Button onPress={() => setStep(step + 1)}>
              Continue
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              onPress={() => setStep(step - 1)}
            >
              Back
            </Button>
            <Button
              onPress={handleSubmit(onSubmit)}
              loading={submitting}
            >
              Complete Profile
            </Button>
          </>
        )}
      </View>
    </View>
  );
}
