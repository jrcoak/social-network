-- Youth Workers Community App - Database Schema
-- Execute this entire file in Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================================================
-- TABLES
-- ============================================================================

-- Users table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  
  -- Required fields
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  role_title TEXT NOT NULL,
  organization_name TEXT NOT NULL,
  organization_address TEXT NOT NULL,
  organization_city TEXT NOT NULL,
  organization_state TEXT NOT NULL CHECK (organization_state IN ('MA', 'NH', 'ME', 'VT', 'RI', 'CT')),
  organization_zip TEXT NOT NULL,
  bio TEXT NOT NULL,
  birth_month INTEGER NOT NULL CHECK (birth_month BETWEEN 1 AND 12),
  birth_day INTEGER NOT NULL CHECK (birth_day BETWEEN 1 AND 31),
  birth_year INTEGER,
  hire_month INTEGER NOT NULL CHECK (hire_month BETWEEN 1 AND 12),
  hire_year INTEGER NOT NULL,
  hire_day INTEGER,
  
  -- Optional fields
  profile_picture_url TEXT,
  public_email TEXT,
  organization_website TEXT,
  ministry_focus_tags TEXT[], -- Array of tags
  
  -- Visibility settings (JSON for flexibility)
  visibility_settings JSONB DEFAULT '{"phone": "private", "birth_month_day": "connections", "birth_year": "private", "hire_date": "members", "profile_picture": "members"}'::jsonb,
  
  -- Location (fuzzed for privacy)
  location GEOGRAPHY(POINT, 4326), -- PostGIS point
  hide_from_map BOOLEAN DEFAULT false,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('guest', 'pending', 'approved', 'suspended', 'rejected')),
  admin_notes TEXT,
  
  -- Push notification token
  push_token TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES public.profiles(id)
);

-- Roles table
CREATE TABLE public.user_roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'admin', 'moderator')),
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  granted_by UUID REFERENCES public.profiles(id),
  UNIQUE(user_id, role)
);

-- Connections table (mutual relationships)
CREATE TABLE public.connections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  connected_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ,
  UNIQUE(user_id, connected_user_id),
  CHECK (user_id != connected_user_id)
);

-- Chat channels table
CREATE TABLE public.channels (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('state', 'topic')),
  slug TEXT NOT NULL UNIQUE, -- e.g., 'ma', 'events', 'resources'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages table
CREATE TABLE public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  channel_id UUID REFERENCES public.channels(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  mentions UUID[], -- Array of mentioned user IDs
  reply_to UUID REFERENCES public.messages(id),
  edited_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Direct messages table
CREATE TABLE public.direct_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  from_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  to_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events table
CREATE TABLE public.events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  location_type TEXT NOT NULL CHECK (location_type IN ('physical', 'virtual')),
  location_address TEXT,
  location_city TEXT,
  location_state TEXT,
  location_zip TEXT,
  virtual_link TEXT,
  organizer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected', 'published')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES public.profiles(id)
);

-- Event RSVPs table
CREATE TABLE public.event_rsvps (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('going', 'maybe', 'not_going')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Reports table (for moderation)
CREATE TABLE public.reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  reported_user_id UUID REFERENCES public.profiles(id),
  reported_message_id UUID REFERENCES public.messages(id),
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'resolved', 'dismissed')),
  resolved_by UUID REFERENCES public.profiles(id),
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blocks table
CREATE TABLE public.blocks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  blocker_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  blocked_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(blocker_id, blocked_id),
  CHECK (blocker_id != blocked_id)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_profiles_status ON public.profiles(status);
CREATE INDEX idx_profiles_location ON public.profiles USING GIST(location);
CREATE INDEX idx_messages_channel_created ON public.messages(channel_id, created_at DESC);
CREATE INDEX idx_messages_user ON public.messages(user_id);
CREATE INDEX idx_direct_messages_users ON public.direct_messages(from_user_id, to_user_id);
CREATE INDEX idx_events_status_start ON public.events(status, start_date);
CREATE INDEX idx_connections_status ON public.connections(user_id, status);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Helper function to check if user is approved
CREATE OR REPLACE FUNCTION is_approved_user()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND status = 'approved'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is admin/moderator
CREATE OR REPLACE FUNCTION is_admin_or_mod()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role IN ('admin', 'moderator')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check visibility permissions
CREATE OR REPLACE FUNCTION can_view_field(
  profile_id UUID,
  field_name TEXT,
  requesting_user_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  visibility TEXT;
  is_connected BOOLEAN;
BEGIN
  -- Get visibility setting for field
  SELECT (visibility_settings->>field_name) INTO visibility
  FROM public.profiles WHERE id = profile_id;
  
  -- Private: only owner and admins
  IF visibility = 'private' THEN
    RETURN profile_id = requesting_user_id OR is_admin_or_mod();
  END IF;
  
  -- Connections only
  IF visibility = 'connections' THEN
    SELECT EXISTS (
      SELECT 1 FROM public.connections
      WHERE status = 'accepted'
      AND ((user_id = profile_id AND connected_user_id = requesting_user_id)
           OR (user_id = requesting_user_id AND connected_user_id = profile_id))
    ) INTO is_connected;
    
    RETURN is_connected OR profile_id = requesting_user_id OR is_admin_or_mod();
  END IF;
  
  -- Members: all approved users
  RETURN is_approved_user() OR is_admin_or_mod();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, phone, role_title, organization_name, organization_address, organization_city, organization_state, organization_zip, bio, birth_month, birth_day, hire_month, hire_year, status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    '', -- phone - to be filled in onboarding
    '', -- role_title - to be filled in onboarding
    '', -- organization_name - to be filled in onboarding
    '', -- organization_address - to be filled in onboarding
    '', -- organization_city - to be filled in onboarding
    'MA', -- organization_state - default, to be updated in onboarding
    '', -- organization_zip - to be filled in onboarding
    '', -- bio - to be filled in onboarding
    1, -- birth_month - default, to be updated in onboarding
    1, -- birth_day - default, to be updated in onboarding
    1, -- hire_month - default, to be updated in onboarding
    EXTRACT(YEAR FROM NOW())::INTEGER, -- hire_year - default to current year
    'guest' -- status - starts as guest
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Approved users can view approved profiles" ON public.profiles
  FOR SELECT USING (status = 'approved' AND is_approved_user());

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (is_admin_or_mod());

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can update any profile" ON public.profiles
  FOR UPDATE USING (is_admin_or_mod());

CREATE POLICY "Anyone can insert their profile on signup" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- User roles policies
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT USING (is_admin_or_mod());

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL USING (is_admin_or_mod());

-- Channels policies
CREATE POLICY "Approved users can view channels" ON public.channels
  FOR SELECT USING (is_approved_user());

CREATE POLICY "Admins can manage channels" ON public.channels
  FOR ALL USING (is_admin_or_mod());

-- Messages policies
CREATE POLICY "Approved users can view messages" ON public.messages
  FOR SELECT USING (is_approved_user());

CREATE POLICY "Approved users can create messages" ON public.messages
  FOR INSERT WITH CHECK (is_approved_user() AND auth.uid() = user_id);

CREATE POLICY "Users can update their own messages" ON public.messages
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own messages" ON public.messages
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all messages" ON public.messages
  FOR ALL USING (is_admin_or_mod());

-- Direct messages policies
CREATE POLICY "Users can view their own DMs" ON public.direct_messages
  FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Approved users can send DMs" ON public.direct_messages
  FOR INSERT WITH CHECK (is_approved_user() AND auth.uid() = from_user_id);

-- Connections policies
CREATE POLICY "Users can view their own connections" ON public.connections
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = connected_user_id);

CREATE POLICY "Approved users can create connections" ON public.connections
  FOR INSERT WITH CHECK (is_approved_user() AND auth.uid() = user_id);

CREATE POLICY "Users can update their own connections" ON public.connections
  FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = connected_user_id);

CREATE POLICY "Users can delete their own connections" ON public.connections
  FOR DELETE USING (auth.uid() = user_id);

-- Events policies
CREATE POLICY "Approved users can view approved events" ON public.events
  FOR SELECT USING (is_approved_user() AND status IN ('approved', 'published'));

CREATE POLICY "Users can view their own events" ON public.events
  FOR SELECT USING (auth.uid() = organizer_id);

CREATE POLICY "Admins can view all events" ON public.events
  FOR SELECT USING (is_admin_or_mod());

CREATE POLICY "Approved users can create events" ON public.events
  FOR INSERT WITH CHECK (is_approved_user() AND auth.uid() = organizer_id);

CREATE POLICY "Users can update their own events" ON public.events
  FOR UPDATE USING (auth.uid() = organizer_id);

CREATE POLICY "Admins can update any event" ON public.events
  FOR UPDATE USING (is_admin_or_mod());

-- Event RSVPs policies
CREATE POLICY "Users can view RSVPs for approved events" ON public.event_rsvps
  FOR SELECT USING (
    is_approved_user() AND EXISTS (
      SELECT 1 FROM public.events WHERE id = event_id AND status IN ('approved', 'published')
    )
  );

CREATE POLICY "Approved users can create RSVPs" ON public.event_rsvps
  FOR INSERT WITH CHECK (is_approved_user() AND auth.uid() = user_id);

CREATE POLICY "Users can update their own RSVPs" ON public.event_rsvps
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own RSVPs" ON public.event_rsvps
  FOR DELETE USING (auth.uid() = user_id);

-- Reports policies
CREATE POLICY "Users can view their own reports" ON public.reports
  FOR SELECT USING (auth.uid() = reporter_id);

CREATE POLICY "Admins can view all reports" ON public.reports
  FOR SELECT USING (is_admin_or_mod());

CREATE POLICY "Approved users can create reports" ON public.reports
  FOR INSERT WITH CHECK (is_approved_user() AND auth.uid() = reporter_id);

CREATE POLICY "Admins can manage reports" ON public.reports
  FOR UPDATE USING (is_admin_or_mod());

-- Blocks policies
CREATE POLICY "Users can view their own blocks" ON public.blocks
  FOR SELECT USING (auth.uid() = blocker_id);

CREATE POLICY "Approved users can create blocks" ON public.blocks
  FOR INSERT WITH CHECK (is_approved_user() AND auth.uid() = blocker_id);

CREATE POLICY "Users can delete their own blocks" ON public.blocks
  FOR DELETE USING (auth.uid() = blocker_id);

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert default channels
INSERT INTO public.channels (name, description, type, slug) VALUES
  ('Massachusetts', 'Chat for youth workers in Massachusetts', 'state', 'ma'),
  ('New Hampshire', 'Chat for youth workers in New Hampshire', 'state', 'nh'),
  ('Maine', 'Chat for youth workers in Maine', 'state', 'me'),
  ('Vermont', 'Chat for youth workers in Vermont', 'state', 'vt'),
  ('Rhode Island', 'Chat for youth workers in Rhode Island', 'state', 'ri'),
  ('Connecticut', 'Chat for youth workers in Connecticut', 'state', 'ct'),
  ('Events', 'Discuss upcoming events and gatherings', 'topic', 'events'),
  ('Resources', 'Share resources and materials', 'topic', 'resources'),
  ('Prayer', 'Prayer requests and spiritual support', 'topic', 'prayer'),
  ('General', 'General discussion', 'topic', 'general');

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE 'Database schema created successfully!';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Configure Google OAuth in Authentication > Providers';
  RAISE NOTICE '2. Create storage buckets: profile-pictures, event-images';
  RAISE NOTICE '3. Enable Realtime for messages and direct_messages tables';
  RAISE NOTICE '4. Generate TypeScript types with Supabase CLI';
END $$;
