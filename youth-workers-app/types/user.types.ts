import type { Database } from './database.types';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type UserRole = Database['public']['Tables']['user_roles']['Row'];

export type UserStatus = Profile['status'];
export type StateCode = Profile['organization_state'];

export interface VisibilitySettings {
  phone: 'private' | 'connections' | 'members';
  birth_month_day: 'private' | 'connections' | 'members';
  birth_year: 'private' | 'connections' | 'members';
  hire_date: 'private' | 'connections' | 'members';
  profile_picture: 'private' | 'connections' | 'members';
}

export interface User {
  id: string;
  email: string;
  profile: Profile | null;
  roles: UserRole[];
}
