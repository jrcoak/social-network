# Youth Workers Community App - Setup Guide

This guide walks you through setting up all external services required for the application.

## Prerequisites

- Node.js 20.x or later
- npm or yarn
- Git

## 1. Supabase Setup

### Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Fill in project details:
   - **Name**: `youth-workers-ne`
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to New England (e.g., `us-east-1`)
   - **Pricing Plan**: Free tier is fine for development
4. Click "Create new project" and wait for provisioning (2-3 minutes)

### Get Supabase Credentials

Once your project is ready:

1. Go to **Project Settings** (gear icon in sidebar)
2. Navigate to **API** section
3. Copy the following values to your `.env.local` file:
   - **Project URL** → `EXPO_PUBLIC_SUPABASE_URL`
   - **anon public** key → `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this secret!)

### Execute Database Schema

1. In your Supabase project, go to **SQL Editor** (in sidebar)
2. Click "New Query"
3. Copy the entire database schema from `database-schema.sql` (we'll create this next)
4. Paste into the SQL editor
5. Click "Run" to execute
6. Verify all tables were created in the **Table Editor**

### Configure Authentication

1. Go to **Authentication** → **Providers** in Supabase
2. We'll configure Google OAuth in step 3 below

### Create Storage Buckets

1. Go to **Storage** in Supabase sidebar
2. Click "Create a new bucket"
3. Create bucket: `profile-pictures`
   - **Public bucket**: Yes
   - **File size limit**: 5MB
   - **Allowed MIME types**: image/jpeg, image/png, image/webp
4. Create bucket: `event-images`
   - **Public bucket**: Yes
   - **File size limit**: 5MB
   - **Allowed MIME types**: image/jpeg, image/png, image/webp

### Enable Realtime

1. Go to **Database** → **Replication** in Supabase
2. Find the `messages` table
3. Toggle "Enable Realtime" to ON
4. Find the `direct_messages` table
5. Toggle "Enable Realtime" to ON

## 2. Google OAuth Setup

### Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable the **Google+ API**:
   - Go to **APIs & Services** → **Library**
   - Search for "Google+ API"
   - Click "Enable"

### Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click "Create Credentials" → "OAuth client ID"
3. Configure OAuth consent screen (if prompted):
   - **User Type**: External
   - **App name**: Youth Workers NE
   - **User support email**: Your email
   - **Developer contact**: Your email
   - **Scopes**: Add `email` and `profile`
4. Create OAuth client ID:
   - **Application type**: Web application
   - **Name**: Youth Workers NE Web
   - **Authorized JavaScript origins**: 
     - `http://localhost:8081`
     - Your Supabase project URL
   - **Authorized redirect URIs**:
     - `https://YOUR_SUPABASE_PROJECT_REF.supabase.co/auth/v1/callback`
     - (Get this from Supabase: Authentication → Providers → Google)
5. Copy **Client ID** and **Client Secret**

### Configure in Supabase

1. Go to your Supabase project
2. Navigate to **Authentication** → **Providers**
3. Find **Google** and click to expand
4. Toggle "Enable Sign in with Google" to ON
5. Paste your **Client ID** and **Client Secret**
6. Copy the **Callback URL** shown (you may need to add this to Google Console)
7. Click "Save"

### Update Environment Variables

Add to your `.env.local`:
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## 3. Mapbox Setup

### Create Mapbox Account

1. Go to [https://mapbox.com](https://mapbox.com)
2. Sign up for a free account
3. Verify your email

### Get Access Token

1. Go to your [Account page](https://account.mapbox.com)
2. Navigate to **Access tokens**
3. Your default public token is already created
4. Copy the token
5. Add to `.env.local`:
   ```
   EXPO_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
   ```

**Note**: Free tier includes 50,000 map loads per month, which should be sufficient for development and initial launch.

## 4. Email Service Setup

Choose either **Resend** (recommended) or **Amazon SES**.

### Option A: Resend (Recommended)

1. Go to [https://resend.com](https://resend.com)
2. Sign up for free account
3. Verify your email
4. Go to **API Keys**
5. Click "Create API Key"
6. Name it "Youth Workers NE"
7. Copy the API key
8. Go to **Domains** to add your sending domain (or use their test domain for development)
9. Add to `.env.local`:
   ```
   EMAIL_SERVICE_API_KEY=your_resend_api_key
   EMAIL_FROM_ADDRESS=noreply@yourdomain.com
   ```

### Option B: Amazon SES

1. Go to [AWS Console](https://console.aws.amazon.com)
2. Navigate to **Amazon SES**
3. Verify your sending email address or domain
4. Create SMTP credentials or API access key
5. Add to `.env.local`:
   ```
   EMAIL_SERVICE_API_KEY=your_ses_access_key
   EMAIL_FROM_ADDRESS=noreply@yourdomain.com
   ```

## 5. Install Dependencies

```bash
cd youth-workers-app
npm install
```

## 6. Run the Application

### Development Server

```bash
npm start
```

This will start the Expo dev server. You can then:
- Press `w` to open in web browser
- Press `i` to open in iOS simulator (macOS only)
- Press `a` to open in Android emulator
- Scan QR code with Expo Go app on your phone

### Web Only

```bash
npm run web
```

## 7. Verify Setup

Once everything is configured:

1. ✅ App loads without errors
2. ✅ Can navigate between screens
3. ✅ Tailwind CSS styles are working
4. ✅ No console errors about missing environment variables

## Troubleshooting

### "Supabase client not configured"
- Check that all Supabase environment variables are set in `.env.local`
- Restart the dev server after adding environment variables

### "Google OAuth not working"
- Verify redirect URIs match exactly in Google Console and Supabase
- Check that Google+ API is enabled
- Ensure OAuth consent screen is configured

### "Map not loading"
- Verify Mapbox token is correct
- Check that token has appropriate scopes
- Ensure token is prefixed with `EXPO_PUBLIC_`

### "Emails not sending"
- Verify email service API key is correct
- Check that sender email/domain is verified
- Review email service logs for errors

## Next Steps

After setup is complete:
1. Create first admin user
2. Test authentication flow
3. Test profile creation
4. Verify database permissions
5. Test real-time chat
6. Test file uploads

## Security Notes

⚠️ **Never commit `.env.local` to version control**
⚠️ **Keep service role keys secret**
⚠️ **Use different credentials for production**
⚠️ **Enable RLS policies before going live**
