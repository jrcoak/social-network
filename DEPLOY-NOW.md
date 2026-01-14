# Deploy to Vercel Now - Quick Start

## ✅ Code is Ready!

All code has been pushed to GitHub and is ready for deployment.

## 🚀 Deploy in 5 Minutes

### Step 1: Go to Vercel

1. Open [vercel.com](https://vercel.com) in your browser
2. Click "Sign Up" or "Log In" (use GitHub account for easy setup)

### Step 2: Import Project

1. Click "Add New..." → "Project"
2. Click "Import Git Repository"
3. Find and select: **jrcoak/social-network**
4. Click "Import"

### Step 3: Configure Project

**Root Directory**: 
- Click "Edit" next to Root Directory
- Enter: `youth-workers-app`
- Click "Continue"

**Build Settings**:
- Framework Preset: **Other** (leave as is)
- Build Command: `npm run build:web`
- Output Directory: `dist`
- Install Command: `npm install`

### Step 4: Add Environment Variables

Click "Environment Variables" and add these (one at a time):

```
Name: EXPO_PUBLIC_SUPABASE_URL
Value: https://srixrvcebfbkuiugvnqv.supabase.co

Name: EXPO_PUBLIC_SUPABASE_ANON_KEY
Value: [Your anon key from .env.local]

Name: SUPABASE_SERVICE_ROLE_KEY
Value: [Your service role key from .env.local]

Name: GOOGLE_CLIENT_ID
Value: [Your Google client ID from .env.local]

Name: GOOGLE_CLIENT_SECRET
Value: [Your Google client secret from .env.local]
```

**To get values from .env.local**:
```bash
cd youth-workers-app
cat .env.local
```

### Step 5: Deploy!

1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. You'll see "Congratulations!" when done
4. Note your production URL (e.g., `https://youth-workers-ne.vercel.app`)

### Step 6: Update Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. APIs & Services → Credentials
3. Edit your OAuth 2.0 Client ID
4. Add to **Authorized JavaScript origins**:
   ```
   https://youth-workers-ne.vercel.app
   ```
   (Use your actual Vercel URL)
5. Add to **Authorized redirect URIs**:
   ```
   https://youth-workers-ne.vercel.app
   https://srixrvcebfbkuiugvnqv.supabase.co/auth/v1/callback
   ```
6. Click "Save"

### Step 7: Update Supabase

1. Go to Supabase Dashboard
2. Authentication → URL Configuration
3. **Site URL**: Add your Vercel URL
4. **Redirect URLs**: Add `https://your-vercel-url.vercel.app/**`
5. Click "Save"

### Step 8: Test!

1. Open your Vercel URL in a browser
2. Click "Sign in with Google"
3. It should work! 🎉

## Why This Fixes the Issue

The Gitpod localhost proxy causes OAuth issues because:
- Google OAuth doesn't trust the proxy URL
- Session cookies don't work correctly through the proxy
- WebSocket connections (for chat) are unreliable

Vercel provides a proper production URL that:
- ✅ Works perfectly with Google OAuth
- ✅ Handles sessions correctly
- ✅ Supports WebSocket connections
- ✅ Is fast and reliable

## What to Expect

After deployment, you should see:
1. **Sign-in page** loads immediately (no blank page!)
2. **Google OAuth** works smoothly
3. **Onboarding form** appears for new users
4. **Main app** loads for existing users
5. **All features** work correctly

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Make sure Root Directory is set to `youth-workers-app`

### OAuth Doesn't Work
- Verify redirect URIs in Google Console match exactly
- Check Supabase redirect URLs include your Vercel URL
- Clear browser cache and try again

### App Loads But Features Don't Work
- Check browser console for errors
- Verify environment variables in Vercel
- Check Supabase project is not paused

## Next Steps

After successful deployment:

1. **Create admin user** (follow DEPLOYMENT-GUIDE.md Step 4)
2. **Test all features** (use TESTING-CHECKLIST.md)
3. **Invite test users** to try the app
4. **Monitor** Vercel logs for any issues

## Need Help?

- Check `VERCEL-DEPLOYMENT.md` for detailed instructions
- Check `TROUBLESHOOTING.md` for common issues
- Check Vercel documentation at vercel.com/docs

## Summary

✅ Code pushed to GitHub
✅ Deployment configuration ready
✅ Instructions provided above

**Next**: Deploy to Vercel using the steps above!

**Estimated time**: 5-10 minutes

**Result**: Working production app with OAuth! 🚀
