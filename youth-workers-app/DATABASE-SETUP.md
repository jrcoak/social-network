# Database Setup Guide

This guide walks through setting up the Supabase database for the Youth Workers NE app.

## Prerequisites

- Supabase account
- Supabase project created
- Access to Supabase SQL Editor

## Step 1: Execute Database Schema

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the entire contents of `/database-schema.sql`
5. Paste into the SQL Editor
6. Click **Run** or press `Ctrl+Enter`

You should see a success message: "Database schema created successfully!"

## Step 2: Verify Tables Created

Navigate to **Table Editor** and verify these tables exist:

- ✅ profiles
- ✅ user_roles
- ✅ connections
- ✅ channels
- ✅ messages
- ✅ direct_messages
- ✅ events
- ✅ event_rsvps
- ✅ reports
- ✅ blocks

## Step 3: Verify Seed Data

Check that default channels were created:

1. Go to **Table Editor** → **channels**
2. You should see 10 channels:
   - State channels: MA, NH, ME, VT, RI, CT
   - Topic channels: Events, Resources, Prayer, General

## Step 4: Configure Storage Buckets

1. Navigate to **Storage**
2. Create two new buckets:

### profile-pictures Bucket
- Name: `profile-pictures`
- Public: Yes (images need to be publicly accessible)
- File size limit: 5 MB
- Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`

### event-images Bucket
- Name: `event-images`
- Public: Yes
- File size limit: 10 MB
- Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`

### Storage Policies

For each bucket, add these policies:

**profile-pictures:**
```sql
-- Allow authenticated users to upload their own profile picture
CREATE POLICY "Users can upload their own profile picture"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public read access
CREATE POLICY "Public can view profile pictures"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-pictures');

-- Allow users to update their own profile picture
CREATE POLICY "Users can update their own profile picture"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own profile picture
CREATE POLICY "Users can delete their own profile picture"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);
```

**event-images:**
```sql
-- Allow authenticated users to upload event images
CREATE POLICY "Authenticated users can upload event images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'event-images');

-- Allow public read access
CREATE POLICY "Public can view event images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'event-images');

-- Allow users to update event images they created
CREATE POLICY "Users can update their event images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'event-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete event images they created
CREATE POLICY "Users can delete their event images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'event-images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## Step 5: Enable Realtime

Enable realtime subscriptions for chat functionality:

1. Navigate to **Database** → **Replication**
2. Find the `messages` table
3. Toggle **Enable Realtime** to ON
4. Find the `direct_messages` table
5. Toggle **Enable Realtime** to ON

## Step 6: Generate TypeScript Types

Generate TypeScript types from your database schema:

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Generate types
npx supabase gen types typescript --project-id YOUR_PROJECT_REF > types/database.types.ts
```

Replace `YOUR_PROJECT_REF` with your Supabase project reference (found in project settings).

## Step 7: Verify RLS Policies

1. Navigate to **Authentication** → **Policies**
2. Verify that all tables have RLS enabled (green shield icon)
3. Check that policies exist for each table

## Step 8: Create First Admin User

After the first user signs up through the app, you need to manually grant them admin role:

1. Go to **Table Editor** → **profiles**
2. Find the user's profile
3. Note their `id` (UUID)
4. Go to **SQL Editor**
5. Run this query:

```sql
-- Grant admin role to first user
INSERT INTO public.user_roles (user_id, role, granted_by)
VALUES ('USER_ID_HERE', 'admin', 'USER_ID_HERE');

-- Update their profile status to approved
UPDATE public.profiles
SET status = 'approved', approved_at = NOW(), approved_by = 'USER_ID_HERE'
WHERE id = 'USER_ID_HERE';
```

Replace `USER_ID_HERE` with the actual user ID.

## Database Schema Overview

### Core Tables

**profiles**
- Extends `auth.users` with application-specific user data
- Includes all required fields from onboarding
- Visibility settings stored as JSONB
- Location stored as PostGIS GEOGRAPHY point (fuzzed for privacy)
- Status workflow: guest → pending → approved/rejected/suspended

**user_roles**
- Manages user roles: user, admin, moderator
- Users can have multiple roles
- Tracks who granted the role and when

**connections**
- Manages connection requests between users
- Status: pending → accepted/rejected
- Bidirectional relationships (both users can see the connection)

**channels**
- Chat channels (state and topic)
- Type: state (MA, NH, etc.) or topic (Events, Resources, etc.)
- Slug for URL-friendly identifiers

**messages**
- Channel messages
- Supports mentions (array of user IDs)
- Supports threads (reply_to references parent message)
- Soft delete (deleted_at timestamp)

**direct_messages**
- One-on-one messaging between users
- Read receipts (read_at timestamp)

**events**
- Event management with approval workflow
- Supports both in-person and virtual events
- Status: draft → pending → approved/rejected
- Admins can approve/reject events

**event_rsvps**
- RSVP tracking for events
- Status: going, maybe, not_going
- One RSVP per user per event

**reports**
- Content moderation system
- Can report users or messages
- Status: pending → reviewing → resolved/dismissed

**blocks**
- User blocking functionality
- Prevents blocked users from interacting

### Helper Functions

**is_approved_user()**
- Returns true if current user has 'approved' status
- Used in RLS policies to restrict access

**is_admin_or_mod()**
- Returns true if current user has admin or moderator role
- Used in RLS policies for elevated access

**can_view_field(profile_id, field_name, requesting_user_id)**
- Checks if requesting user can view a specific profile field
- Respects visibility settings: private, connections, members

**handle_new_user()**
- Trigger function that auto-creates profile on user signup
- Sets initial status to 'guest'
- Populates email from auth.users

**update_updated_at_column()**
- Trigger function that auto-updates updated_at timestamp
- Applied to profiles and events tables

## Troubleshooting

### Schema Execution Fails

**Error: "extension postgis does not exist"**
- Solution: PostGIS should be available by default in Supabase. If not, contact Supabase support.

**Error: "relation auth.users does not exist"**
- Solution: Make sure you're running the script in your Supabase project, not a local PostgreSQL instance.

### RLS Policies Not Working

**Users can't access data they should be able to**
- Check that the user's status is 'approved' in the profiles table
- Verify the user has the correct role in user_roles table
- Check the specific RLS policy for that table

**Admins can't access everything**
- Verify the admin has a row in user_roles with role='admin'
- Check that is_admin_or_mod() function exists and works

### Realtime Not Working

**Messages don't appear in real-time**
- Verify Realtime is enabled for the messages table
- Check browser console for Realtime connection errors
- Verify the Supabase client is configured correctly

### Storage Upload Fails

**Can't upload profile pictures**
- Verify the profile-pictures bucket exists
- Check that storage policies are configured
- Verify the file size is under the limit
- Check that the MIME type is allowed

## Next Steps

After database setup is complete:

1. ✅ Configure Google OAuth (see OAUTH-BLOCKER.md)
2. ✅ Set up environment variables in your app
3. ✅ Test authentication flow
4. ✅ Create first admin user
5. ✅ Test all features with the testing checklist

## Maintenance

### Backing Up Data

Supabase automatically backs up your database. To create a manual backup:

1. Navigate to **Database** → **Backups**
2. Click **Create Backup**

### Monitoring

Monitor database performance:

1. Navigate to **Database** → **Logs**
2. Check for slow queries
3. Monitor connection count
4. Check for errors

### Migrations

When making schema changes:

1. Create a new migration file
2. Test in a development project first
3. Apply to production
4. Update TypeScript types
5. Document the change

## Support

For database-related issues:
- Check Supabase documentation: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- GitHub Issues: https://github.com/supabase/supabase/issues
