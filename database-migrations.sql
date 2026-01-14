-- Database Migrations and Seed Data
-- Run this after executing database-schema.sql

-- ============================================================================
-- SCHEMA UPDATES
-- ============================================================================

-- Migration: Remove birthday fields (2024-01-14)
DO $$
BEGIN
  -- Remove birthday columns if they exist
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name='profiles' AND column_name='birth_month') THEN
    ALTER TABLE public.profiles DROP COLUMN birth_month;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name='profiles' AND column_name='birth_day') THEN
    ALTER TABLE public.profiles DROP COLUMN birth_day;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name='profiles' AND column_name='birth_year') THEN
    ALTER TABLE public.profiles DROP COLUMN birth_year;
  END IF;
END $$;

-- Add missing columns to events table (if they don't exist)
DO $$ 
BEGIN
  -- Add start_time as alias for start_date
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='events' AND column_name='start_time') THEN
    ALTER TABLE public.events ADD COLUMN start_time TIMESTAMPTZ;
    UPDATE public.events SET start_time = start_date WHERE start_time IS NULL;
  END IF;

  -- Add event_type as alias for location_type
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='events' AND column_name='event_type') THEN
    ALTER TABLE public.events ADD COLUMN event_type TEXT;
    UPDATE public.events SET event_type = location_type WHERE event_type IS NULL;
  END IF;

  -- Add created_by as alias for organizer_id
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='events' AND column_name='created_by') THEN
    ALTER TABLE public.events ADD COLUMN created_by UUID REFERENCES public.profiles(id);
    UPDATE public.events SET created_by = organizer_id WHERE created_by IS NULL;
  END IF;

  -- Add location column to events (for simple location string)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='events' AND column_name='location') THEN
    ALTER TABLE public.events ADD COLUMN location TEXT;
  END IF;
END $$;

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert default channels (state channels)
INSERT INTO public.channels (name, description, type, slug) VALUES
  ('Massachusetts', 'Connect with youth workers in Massachusetts', 'state', 'ma'),
  ('New Hampshire', 'Connect with youth workers in New Hampshire', 'state', 'nh'),
  ('Maine', 'Connect with youth workers in Maine', 'state', 'me'),
  ('Vermont', 'Connect with youth workers in Vermont', 'state', 'vt'),
  ('Rhode Island', 'Connect with youth workers in Rhode Island', 'state', 'ri'),
  ('Connecticut', 'Connect with youth workers in Connecticut', 'state', 'ct')
ON CONFLICT (slug) DO NOTHING;

-- Insert topic channels
INSERT INTO public.channels (name, description, type, slug) VALUES
  ('Events', 'Discuss upcoming events and gatherings', 'topic', 'events'),
  ('Resources', 'Share resources, curriculum, and materials', 'topic', 'resources'),
  ('Prayer', 'Prayer requests and spiritual support', 'topic', 'prayer'),
  ('General', 'General discussion and community chat', 'topic', 'general')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to create a test admin user (for development only)
-- Usage: SELECT create_test_admin('admin@example.com', 'Admin', 'User');
CREATE OR REPLACE FUNCTION create_test_admin(
  p_email TEXT,
  p_first_name TEXT,
  p_last_name TEXT
) RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- This is a placeholder - in production, users are created via Supabase Auth
  -- This function is just for reference
  RAISE NOTICE 'To create an admin user:';
  RAISE NOTICE '1. Sign up via the app with email: %', p_email;
  RAISE NOTICE '2. Run: INSERT INTO user_roles (user_id, role) VALUES (''<user_id>'', ''admin'');';
  RAISE NOTICE '3. Run: UPDATE profiles SET status = ''approved'' WHERE id = ''<user_id>'';';
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_state ON public.profiles(organization_state);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at);

-- Messages indexes
CREATE INDEX IF NOT EXISTS idx_messages_channel_id ON public.messages(channel_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON public.messages(user_id);

-- Events indexes
CREATE INDEX IF NOT EXISTS idx_events_start_time ON public.events(start_time);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON public.events(created_by);

-- Event RSVPs indexes
CREATE INDEX IF NOT EXISTS idx_event_rsvps_event_id ON public.event_rsvps(event_id);
CREATE INDEX IF NOT EXISTS idx_event_rsvps_user_id ON public.event_rsvps(user_id);

-- Connections indexes
CREATE INDEX IF NOT EXISTS idx_connections_user_id ON public.connections(user_id);
CREATE INDEX IF NOT EXISTS idx_connections_connected_user_id ON public.connections(connected_user_id);
CREATE INDEX IF NOT EXISTS idx_connections_status ON public.connections(status);

RAISE NOTICE 'Migration completed successfully!';
RAISE NOTICE 'Channels created: Run SELECT * FROM channels; to verify';
RAISE NOTICE 'To create an admin user, sign up via the app then run:';
RAISE NOTICE 'INSERT INTO user_roles (user_id, role) VALUES (''<your-user-id>'', ''admin'');';
RAISE NOTICE 'UPDATE profiles SET status = ''approved'' WHERE id = ''<your-user-id>'';';
