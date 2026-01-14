# Vercel Deployment Guide

## Why Deploy to Vercel?

The Gitpod environment uses a proxy/tunnel for localhost which can cause issues with:
- OAuth redirects
- Session detection
- Cookie handling
- WebSocket connections

Deploying to Vercel provides a proper production URL that works reliably with OAuth and Supabase.

## Prerequisites

- GitHub account
- Vercel account (free tier is fine)
- Supabase project configured
- Google OAuth credentials

## Step 1: Push Code to GitHub

If you haven't already:

```bash
cd /workspaces/social-network

# Check current status
git status

# Add all files
git add -A

# Commit
git commit -m "Prepare for Vercel deployment"

# Push to GitHub
git push origin main
```

## Step 2: Deploy to Vercel

### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   cd youth-workers-app
   vercel
   ```

4. **Follow prompts**:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? `youth-workers-ne` (or your choice)
   - Directory? `./` (current directory)
   - Override settings? **N**

5. **Wait for deployment** (~2-3 minutes)

6. **Note the production URL**: `https://youth-workers-ne.vercel.app` (or similar)

### Option B: Using Vercel Dashboard

1. **Go to** [vercel.com](https://vercel.com)

2. **Click "Add New Project"**

3. **Import Git Repository**:
   - Connect your GitHub account
   - Select `social-network` repository
   - Click "Import"

4. **Configure Project**:
   - Framework Preset: **Other**
   - Root Directory: `youth-workers-app`
   - Build Command: `npm run build:web`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. **Add Environment Variables** (click "Environment Variables"):
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

6. **Click "Deploy"**

7. **Wait for deployment** (~2-3 minutes)

8. **Note the production URL** from the deployment page

## Step 3: Update Google OAuth

1. **Go to** [Google Cloud Console](https://console.cloud.google.com)

2. **Navigate to**: APIs & Services → Credentials

3. **Edit your OAuth 2.0 Client ID**

4. **Add to Authorized JavaScript origins**:
   ```
   https://youth-workers-ne.vercel.app
   ```
   (Replace with your actual Vercel URL)

5. **Add to Authorized redirect URIs**:
   ```
   https://youth-workers-ne.vercel.app
   https://srixrvcebfbkuiugvnqv.supabase.co/auth/v1/callback
   ```
   (Replace with your actual URLs)

6. **Click "Save"**

## Step 4: Update Supabase Auth

1. **Go to** Supabase Dashboard

2. **Navigate to**: Authentication → URL Configuration

3. **Add to Site URL**:
   ```
   https://youth-workers-ne.vercel.app
   ```

4. **Add to Redirect URLs**:
   ```
   https://youth-workers-ne.vercel.app/**
   ```

5. **Click "Save"**

## Step 5: Test Production Deployment

1. **Open your Vercel URL** in a browser

2. **Check console** for debug messages:
   ```
   🚀 App starting...
   🔄 Initializing auth...
   ✅ Auth initialization complete
   ```

3. **Test sign-in**:
   - Click "Sign in with Google"
   - Should redirect to Google
   - Select account
   - Should redirect back to app
   - Should show onboarding form (new users) or main app (existing users)

4. **Complete onboarding** if new user

5. **Test features**:
   - Chat messaging
   - Directory search
   - Events RSVP
   - Map display

## Step 6: Create Admin User

1. **Sign up** through the production app

2. **Go to** Supabase Dashboard → SQL Editor

3. **Get your user ID**:
   ```sql
   SELECT id, email, first_name, last_name, status 
   FROM profiles 
   ORDER BY created_at DESC 
   LIMIT 1;
   ```

4. **Promote to admin**:
   ```sql
   -- Approve account
   UPDATE profiles 
   SET status = 'approved', approved_at = NOW() 
   WHERE id = 'your-user-id';

   -- Grant admin role
   INSERT INTO user_roles (user_id, role) 
   VALUES ('your-user-id', 'admin');
   ```

5. **Refresh the app** - you should see "Admin Panel" button

## Continuous Deployment

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes
git add -A
git commit -m "Your changes"
git push origin main

# Vercel will automatically deploy
# Check deployment status at vercel.com
```

## Environment Variables

To update environment variables in production:

### Using Vercel CLI:
```bash
vercel env add EXPO_PUBLIC_SUPABASE_URL production
# Enter value when prompted

vercel env add EXPO_PUBLIC_SUPABASE_ANON_KEY production
# Enter value when prompted
```

### Using Vercel Dashboard:
1. Go to your project
2. Settings → Environment Variables
3. Add or edit variables
4. Redeploy for changes to take effect

## Custom Domain (Optional)

1. **Go to** Vercel Dashboard → Your Project → Settings → Domains

2. **Add domain**: `youthworkersne.com` (or your domain)

3. **Follow DNS instructions** to point domain to Vercel

4. **Update OAuth redirect URIs** to include custom domain

5. **Update Supabase redirect URLs** to include custom domain

## Troubleshooting Production

### Deployment Fails

**Check build logs**:
1. Go to Vercel Dashboard
2. Click on failed deployment
3. View "Building" logs
4. Look for error messages

**Common issues**:
- Missing dependencies: Run `npm install` locally first
- Build errors: Test `npm run build:web` locally
- Environment variables: Verify all are set correctly

### OAuth Not Working

1. **Verify redirect URIs** match exactly (including https://)
2. **Check Supabase auth settings** include production URL
3. **Clear browser cache** and try again
4. **Check browser console** for error messages

### App Loads But Features Don't Work

1. **Check environment variables** are set in Vercel
2. **Verify Supabase connection** from production
3. **Check RLS policies** allow access
4. **Look at browser console** for API errors

### Database Connection Issues

1. **Verify Supabase URL** is correct in environment variables
2. **Check Supabase project** is not paused
3. **Test connection** from browser console:
   ```javascript
   fetch('https://your-project.supabase.co')
   ```

## Monitoring

### View Logs

**Vercel Dashboard**:
1. Go to your project
2. Click "Deployments"
3. Click on a deployment
4. View "Functions" or "Runtime Logs"

**Browser Console**:
- Open DevTools (F12)
- Check Console tab for errors
- Check Network tab for failed requests

### Analytics

Vercel provides basic analytics:
1. Go to your project
2. Click "Analytics"
3. View page views, visitors, etc.

## Rollback

If something goes wrong:

1. **Go to** Vercel Dashboard → Deployments
2. **Find previous working deployment**
3. **Click "..." menu** → "Promote to Production"
4. **Confirm** - previous version is now live

## Production Checklist

Before going live:

- [ ] All environment variables set in Vercel
- [ ] Google OAuth redirect URIs updated
- [ ] Supabase redirect URLs updated
- [ ] Database schema executed
- [ ] Migrations run (channels created)
- [ ] Test sign-in works
- [ ] Test all core features
- [ ] Create admin user
- [ ] Test admin approval workflow
- [ ] Check browser console for errors
- [ ] Test on mobile devices
- [ ] Verify SSL certificate (https)

## Next Steps

After successful deployment:

1. **Test thoroughly** using `TESTING-CHECKLIST.md`
2. **Invite test users** to try the app
3. **Monitor for errors** in Vercel logs
4. **Gather feedback** from users
5. **Iterate and improve** based on feedback

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Check browser console
3. Review `TROUBLESHOOTING.md`
4. Check Vercel documentation
5. Check Expo documentation

## Cost

**Vercel Free Tier includes**:
- Unlimited deployments
- 100 GB bandwidth/month
- Automatic HTTPS
- Custom domains
- Preview deployments

This is sufficient for initial launch and testing. Upgrade if you exceed limits.

## Security

**Production security checklist**:
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Environment variables not exposed
- [ ] RLS policies active on all tables
- [ ] OAuth credentials secure
- [ ] No sensitive data in logs
- [ ] CORS configured correctly
- [ ] Security headers set (in vercel.json)

## Conclusion

Deploying to Vercel solves the localhost proxy issues and provides a reliable production environment. The OAuth flow should work correctly with a proper production URL.

**Your production URL**: `https://youth-workers-ne.vercel.app` (or your custom domain)

Test the app at this URL and verify OAuth works correctly!
