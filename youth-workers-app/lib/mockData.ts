import type { Profile } from '@/types';

export const MOCK_PROFILE: Profile = {
  id: 'mock-user-id',
  email: 'demo@example.com',
  first_name: 'John',
  last_name: 'Doe',
  phone: '(555) 123-4567',
  role_title: 'Youth Pastor',
  organization_name: 'First Community Church',
  organization_address: '123 Main Street',
  organization_city: 'Boston',
  organization_state: 'MA',
  organization_zip: '02101',
  bio: 'Passionate about helping young people discover their purpose and grow in their faith. Been in youth ministry for 5 years and love connecting with other youth workers.',
  birth_month: 6,
  birth_day: 15,
  birth_year: 1990,
  hire_month: 9,
  hire_year: 2019,
  hire_day: 1,
  profile_picture_url: null,
  public_email: 'john.doe@firstcommunity.org',
  organization_website: 'https://firstcommunity.org',
  ministry_focus_tags: ['High School', 'Small Groups', 'Worship', 'Outreach'],
  visibility_settings: {
    phone: 'private',
    birth_month_day: 'connections',
    birth_year: 'private',
    hire_date: 'members',
    profile_picture: 'members',
  },
  location: null,
  hide_from_map: false,
  status: 'approved',
  admin_notes: null,
  push_token: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  approved_at: new Date().toISOString(),
  approved_by: null,
};

export const MOCK_USER = {
  id: 'mock-user-id',
  email: 'demo@example.com',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
};

export const MOCK_SESSION = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  token_type: 'bearer',
  user: MOCK_USER,
};
