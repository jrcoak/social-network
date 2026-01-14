# Youth Workers Community App - Deployment Guide

## Prerequisites

- Supabase account
- Google Cloud Console account (for OAuth)
- Node.js 18+ installed
- Git installed

## Step 1: Supabase Setup

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details:
   - Name: `youth-workers-ne`
   - Database Password: (generate strong password)
   - Region: Choose closest to New England (e.g., `us-east-1`)
4. Wait for project to be created (~2 minutes)

### 1.2 Execute Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy entire contents of `database-schema.sql`
4. Paste and click "Run"
5. Verify: Should see "Success. No rows returned"

### 1.3 Run Migrations

1. In SQL Editor, create another new query
2. Copy entire contents of `database-migrations.sql`
3. Paste and click "Run"
4. Verify channels created:
   ```sql
   SELECT * FROM channels ORDER BY type, name;
   ```
   Should see 10 channels (6 state + 4 topic)

### 1.4 Configure Storage

1. Go to **Storage** in Supabase dashboard
2. Create bucket: `profile-pictures`
   - Public: Yes
   - File size limit: 5MB
   - Allowed MIME types: `image/jpeg, image/png, image/webp`
3. Create bucket: `event-images`
   - Public: Yes
   - File size limit: 10MB
   - Allowed MIME types: `image/jpeg, image/png, image/webp`

### 1.5 Enable Realtime

1. Go to **Database** → **Replication**
2. Find `messages` table
3. Toggle "Enable Realtime" to ON
4. Click "Save"

### 1.6 Get API Keys

1. Go to **Settings** → **API**
2. Copy these values (you'll need them later):
   - Project URL: `https://xxxxx.supabase.co`
   - `anon` `public` key
   - `service_role` `secret` key

## Step 2: Google OAuth Setup

### 2.1 Create OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Configure consent screen if prompted:
   - User Type: External
   - App name: Youth Workers NE
   - User support email: your email
   - Developer contact: your email
6. Application type: **Web application**
7. Name: `Youth Workers NE Web`
8. Authorized JavaScript origins:
   - `http://localhost:8081` (for development)
   - Your production URL (e.g., `https://youth-workers-ne.vercel.app`)
9. Authorized redirect URIs:
   - `http://localhost:8081` (for development)
   - `https://xxxxx.supabase.co/auth/v1/callback` (replace with your Supabase URL)
   - Your production URL
10. Click **Create**
11. Copy **Client ID** and **Client Secret**

### 2.2 Configure Supabase Auth

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Find **Google** provider
3. Enable it
4. Paste your Google Client ID and Client Secret
5. Click **Save**

## Step 3: Local Development Setup

### 3.1 Clone Repository

```bash
git clone https://github.com/jrcoak/social-network.git
cd social-network/youth-workers-app
```

### 3.2 Install Dependencies

```bash
npm install
```

### 3.3 Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` with your values:
   ```env
   # Supabase Configuration
   EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret

   # Mapbox Configuration (optional for now)
   EXPO_PUBLIC_MAPBOX_TOKEN=

   # Email Service Configuration (optional for now)
   EMAIL_SERVICE_API_KEY=
   EMAIL_FROM_ADDRESS=
   ```

### 3.4 Start Development Server

```bash
npm run web
```

App should open at `http://localhost:8081`

## Step 4: Create First Admin User

### 4.1 Sign Up

1. Open app in browser
2. Click "Sign in with Google"
3. Complete profile onboarding
4. You'll be in "pending" status

### 4.2 Promote to Admin

1. Go to Supabase dashboard → **SQL Editor**
2. Get your user ID:
   ```sql
   SELECT id, email, first_name, last_name, status 
   FROM profiles 
   ORDER BY created_at DESC 
   LIMIT 1;
   ```
3. Copy your user ID
4. Run these commands (replace `<your-user-id>`):
   ```sql
   -- Approve your account
   UPDATE profiles 
   SET status = 'approved', approved_at = NOW() 
   WHERE id = '<your-user-id>';

   -- Make yourself admin
   INSERT INTO user_roles (user_id, role) 
   VALUES ('<your-user-id>', 'admin');
   ```
5. Refresh the app - you should now see "Admin Panel" button in Profile tab

## Step 5: Test Core Features

### 5.1 Test Authentication
- ✅ Sign in with Google
- ✅ Profile creation
- ✅ Sign out and sign back in

### 5.2 Test Chat
- ✅ View channels
- ✅ Send message
- ✅ Receive messages in real-time (open in two browser tabs)

### 5.3 Test Directory
- ✅ View members list
- ✅ Search members
- ✅ Filter by state

### 5.4 Test Events
- ✅ View events list
- ✅ RSVP to event
- ✅ Switch between upcoming/past

### 5.5 Test Admin Panel
- ✅ View pending users
- ✅ Approve a user
- ✅ Reject a user

## Step 6: Production Deployment

### 6.1 Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure:
   - Framework Preset: Other
   - Build Command: `cd youth-workers-app && npm run build`
   - Output Directory: `youth-workers-app/dist`
6. Add Environment Variables (same as `.env.local`)
7. Click "Deploy"

### 6.2 Update OAuth Redirect URIs

1. Go to Google Cloud Console
2. Edit your OAuth client
3. Add production URL to:
   - Authorized JavaScript origins
   - Authorized redirect URIs
4. Save

### 6.3 Update Supabase Auth

1. Go to Supabase dashboard → **Authentication** → **URL Configuration**
2. Add your production URL to:
   - Site URL
   - Redirect URLs
3. Save

## Step 7: Post-Deployment

### 7.1 Create Test Data (Optional)

Create a few test events:
```sql
INSERT INTO events (
  title, 
  description, 
  start_time, 
  event_type, 
  location, 
  created_by, 
  status
) VALUES (
  'Youth Workers Meetup',
  'Monthly gathering for youth workers in the Boston area',
  NOW() + INTERVAL '7 days',
  'in_person',
  'Boston, MA',
  '<your-user-id>',
  'approved'
);
```

### 7.2 Monitor Application

- Check Supabase logs for errors
- Monitor Vercel deployment logs
- Test all features in production

## Troubleshooting

### OAuth Not Working

1. Check Google OAuth credentials are correct
2. Verify redirect URIs match exactly (including http/https)
3. Check Supabase Auth provider is enabled
4. Clear browser cache and cookies

### Database Errors

1. Verify schema was executed successfully
2. Check RLS policies are enabled
3. Verify user has correct role in `user_roles` table

### Realtime Not Working

1. Verify Realtime is enabled for `messages` table
2. Check browser console for WebSocket errors
3. Verify Supabase project is not paused

### App Not Loading

1. Check environment variables are set correctly
2. Verify Supabase URL and keys are valid
3. Check browser console for errors
4. Try clearing browser cache

## Next Steps

1. **Email Notifications**: Set up Resend or AWS SES
2. **Mapbox Integration**: Add interactive map
3. **Mobile Apps**: Build iOS and Android apps
4. **Custom Domain**: Configure custom domain in Vercel
5. **Analytics**: Add analytics tracking
6. **Monitoring**: Set up error tracking (Sentry)

## Support

For issues or questions:
- Check GitHub Issues
- Review Supabase documentation
- Contact project maintainer
