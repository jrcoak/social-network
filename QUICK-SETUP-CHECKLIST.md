# Quick Setup Checklist

Complete these steps to enable full app functionality. See SETUP.md for detailed instructions.

## ✅ Required Steps

### 1. Supabase Setup (30-45 minutes)

**Create Project:**
- [ ] Go to [supabase.com](https://supabase.com) and create account
- [ ] Create new project: "youth-workers-ne"
- [ ] Choose region: us-east-1 (or closest to New England)
- [ ] Save database password

**Get Credentials:**
- [ ] Copy Project URL → Add to `.env.local` as `EXPO_PUBLIC_SUPABASE_URL`
- [ ] Copy anon public key → Add to `.env.local` as `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Copy service_role key → Add to `.env.local` as `SUPABASE_SERVICE_ROLE_KEY`

**Execute Database Schema:**
- [ ] Go to SQL Editor in Supabase
- [ ] Copy entire contents of `database-schema.sql`
- [ ] Paste and run in SQL Editor
- [ ] Verify tables created in Table Editor

**Create Storage Buckets:**
- [ ] Go to Storage in Supabase
- [ ] Create bucket: `profile-pictures` (public, 5MB limit)
- [ ] Create bucket: `event-images` (public, 5MB limit)

**Enable Realtime:**
- [ ] Go to Database → Replication
- [ ] Enable Realtime for `messages` table
- [ ] Enable Realtime for `direct_messages` table

### 2. Google OAuth Setup (15-20 minutes)

**Create OAuth Credentials:**
- [ ] Go to [Google Cloud Console](https://console.cloud.google.com)
- [ ] Create new project or select existing
- [ ] Enable Google+ API
- [ ] Go to APIs & Services → Credentials
- [ ] Create OAuth client ID (Web application)
- [ ] Add authorized redirect URI: `https://YOUR_SUPABASE_PROJECT_REF.supabase.co/auth/v1/callback`
- [ ] Copy Client ID and Client Secret

**Configure in Supabase:**
- [ ] Go to Supabase → Authentication → Providers
- [ ] Enable Google provider
- [ ] Paste Client ID and Client Secret
- [ ] Save

**Update Environment:**
- [ ] Add Client ID to `.env.local` as `GOOGLE_CLIENT_ID`
- [ ] Add Client Secret to `.env.local` as `GOOGLE_CLIENT_SECRET`

### 3. Mapbox Setup (5 minutes)

- [ ] Go to [mapbox.com](https://mapbox.com) and create account
- [ ] Navigate to Access Tokens
- [ ] Copy default public token
- [ ] Add to `.env.local` as `EXPO_PUBLIC_MAPBOX_TOKEN`

### 4. Email Service Setup (10-15 minutes)

**Option A: Resend (Recommended)**
- [ ] Go to [resend.com](https://resend.com) and create account
- [ ] Create API key
- [ ] Add to `.env.local` as `EMAIL_SERVICE_API_KEY`
- [ ] Add sender email to `.env.local` as `EMAIL_FROM_ADDRESS`

**Option B: Amazon SES**
- [ ] Go to AWS Console → Amazon SES
- [ ] Verify sender email/domain
- [ ] Create SMTP credentials or API key
- [ ] Add to `.env.local` as `EMAIL_SERVICE_API_KEY`
- [ ] Add sender email to `.env.local` as `EMAIL_FROM_ADDRESS`

## 📋 Final Checklist

After completing all steps above:

- [ ] All environment variables in `.env.local` are filled in
- [ ] Database schema executed successfully in Supabase
- [ ] Google OAuth configured in both Google Console and Supabase
- [ ] Storage buckets created in Supabase
- [ ] Realtime enabled for message tables

## 🚀 Ready to Continue

Once you've completed these steps, share your `.env.local` values (or confirm they're set) and I can:
- Test the authentication flow
- Implement profile updates
- Build remaining features (chat, directory, map, events, admin)

## ⚠️ Important Notes

- **Never commit `.env.local`** - it's already in .gitignore
- **Keep service_role key secret** - only use server-side
- **Free tiers are sufficient** for development and initial launch
- **Estimated total time**: 60-90 minutes

## 📞 Need Help?

If you get stuck on any step, refer to SETUP.md for detailed instructions with screenshots and troubleshooting tips.
