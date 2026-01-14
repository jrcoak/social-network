import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Profile, ProfileUpdate } from '@/types';

export function useProfile(userId?: string) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (fetchError) throw fetchError;
      setProfile(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: ProfileUpdate) => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (updateError) throw updateError;
      setProfile(data);
      return data;
    } catch (err) {
      setError(err as Error);
      console.error('Error updating profile:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    updateProfile,
  };
}
