# Post-Deployment Checklist

After deploying to Vercel, complete these steps to make OAuth work.

## Your Vercel URL

After deployment, Vercel will give you a URL like:
```
https://youth-workers-ne.vercel.app
```

**Write it down here**: _______________________________________

## Step 1: Update Google OAuth (Required)

### 1.1 Go to Google Cloud Console
- Open [console.cloud.google.com](https://console.cloud.google.com)
- Navigate to: **APIs & Services** → **Credentials**

### 1.2 Edit OAuth Client
- Find your OAuth 2.0 Client ID
- Click the edit icon (pencil)

### 1.3 Add Authorized JavaScript Origins
Add your Vercel URL:
```
https://youth-workers-ne.vercel.app
```
(Replace with your actual URL)

**Keep existing entries**:
- `http://localhost:8081` (for local development)
- Any other URLs you have

### 1.4 Add Authorized Redirect URIs
Add these two URLs:
```
https://youth-workers-ne.vercel.app
https://srixrvcebfbkuiugvnqv.supabase.co/auth/v1/callback
```

**Keep existing entries**:
- `http://localhost:8081`
- Any other URLs you have

### 1.5 Save
- Click "Save" at the bottom
- Wait 5 minutes for changes to propagate

## Step 2: Update Supabase Auth (Required)

### 2.1 Go to Supabase Dashboard
- Open [supabase.com](https://supabase.com)
- Select your project: `srixrvcebfbkuiugvnqv`

### 2.2 Update Site URL
- Navigate to: **Authentication** → **URL Configuration**
- **Site URL**: Add your Vercel URL
  ```
  https://youth-workers-ne.vercel.app
  ```

### 2.3 Update Redirect URLs
- **Redirect URLs**: Add this pattern
  ```
  https://youth-workers-ne.vercel.app/**
  ```

**Keep existing entries**:
- `http://localhost:8081/**`
- Any other URLs you have

### 2.4 Save
- Click "Save"
- Changes take effect immediately

## Step 3: Test OAuth (Required)

### 3.1 Open Production App
- Go to your Vercel URL in a browser
- Use incognito/private mode (to avoid cache issues)

### 3.2 Test Sign-In
- Click "Sign in with Google"
- Should redirect to Google
- Select your Google account
- Should redirect back to app
- Should show onboarding form (new users) or main app

### 3.3 Check Console
- Open DevTools (F12)
- Go to Console tab
- Look for:
  ```
  🚀 App starting...
  🔄 Initializing auth...
  ✅ Auth initialization complete
  ```

### 3.4 Verify Success
- [ ] App loads (no blank page)
- [ ] Sign-in button works
- [ ] Google OAuth redirects correctly
- [ ] Returns to app after OAuth
- [ ] Onboarding form appears (new users)
- [ ] No errors in console

## Step 4: Create Admin User (Required)

### 4.1 Sign Up
- Complete the onboarding form
- Fill in all required fields
- Submit

### 4.2 Get Your User ID
- Go to Supabase Dashboard
- SQL Editor → New Query
- Run:
  ```sql
  SELECT id, email, first_name, last_name, status 
  FROM profiles 
  ORDER BY created_at DESC 
  LIMIT 1;
  ```
- Copy your `id` (UUID)

### 4.3 Promote to Admin
- In SQL Editor, run (replace `your-user-id`):
  ```sql
  -- Approve your account
  UPDATE profiles 
  SET status = 'approved', approved_at = NOW() 
  WHERE id = 'your-user-id';

  -- Grant admin role
  INSERT INTO user_roles (user_id, role) 
  VALUES ('your-user-id', 'admin');
  ```

### 4.4 Verify
- Refresh the app
- Go to Profile tab
- Should see "Admin Panel" button
- Click it to verify access

## Step 5: Test Core Features (Recommended)

### 5.1 Chat
- [ ] Go to Chat tab
- [ ] Select a channel
- [ ] Send a message
- [ ] Message appears immediately

### 5.2 Directory
- [ ] Go to Directory tab
- [ ] See list of members (just you for now)
- [ ] Search works
- [ ] State filter works

### 5.3 Events
- [ ] Go to Events tab
- [ ] See events list (empty for now)
- [ ] "Create Event" button visible

### 5.4 Map
- [ ] Go to Map tab
- [ ] See member list
- [ ] State filter works

### 5.5 Admin Panel
- [ ] Click "Admin Panel" from Profile
- [ ] See pending users list (empty for now)
- [ ] No errors

## Step 6: Invite Test Users (Optional)

### 6.1 Share URL
- Send your Vercel URL to test users
- Have them sign up

### 6.2 Approve Users
- Go to Admin Panel
- See pending users
- Click "Approve" for each user
- Verify they get access

### 6.3 Test Multi-User Features
- [ ] Chat with multiple users
- [ ] See other users in directory
- [ ] RSVP to events together

## Step 7: Monitor (Recommended)

### 7.1 Check Vercel Logs
- Go to Vercel Dashboard
- Click your project
- View "Functions" or "Runtime Logs"
- Look for errors

### 7.2 Check Supabase Logs
- Go to Supabase Dashboard
- Click "Logs"
- Look for errors or unusual activity

### 7.3 Check Browser Console
- Open app in browser
- Open DevTools (F12)
- Check Console for errors
- Check Network for failed requests

## Troubleshooting

### OAuth Still Not Working

**Check redirect URIs**:
- [ ] Google Console has correct Vercel URL
- [ ] Supabase has correct Vercel URL
- [ ] URLs match exactly (including https://)
- [ ] Waited 5 minutes after saving Google changes

**Try**:
- Clear browser cache
- Use incognito/private mode
- Check browser console for errors
- Verify environment variables in Vercel

### App Loads But Features Don't Work

**Check**:
- [ ] Environment variables set in Vercel
- [ ] Supabase project not paused
- [ ] Database schema executed
- [ ] Migrations run (channels created)
- [ ] RLS policies enabled

**Try**:
- Check browser console for errors
- Check Network tab for failed requests
- Verify Supabase connection from browser

### Can't Create Admin User

**Check**:
- [ ] Signed up successfully
- [ ] Profile exists in database
- [ ] SQL query returns your user ID
- [ ] No errors when running UPDATE/INSERT

**Try**:
- Verify you're in correct Supabase project
- Check SQL Editor for error messages
- Refresh app after running SQL

## Success Criteria

You're done when:
- ✅ App loads at Vercel URL
- ✅ OAuth sign-in works
- ✅ Onboarding completes successfully
- ✅ Admin user created
- ✅ Admin panel accessible
- ✅ All core features work
- ✅ No errors in console

## Next Steps

After completing this checklist:

1. **Test thoroughly** using `TESTING-CHECKLIST.md`
2. **Invite real users** to try the app
3. **Gather feedback** on features and usability
4. **Monitor** for errors and issues
5. **Iterate** based on feedback

## Need Help?

- Check `TROUBLESHOOTING.md` for common issues
- Check `VERCEL-DEPLOYMENT.md` for detailed deployment info
- Check browser console for error messages
- Check Vercel logs for server errors
- Check Supabase logs for database errors

## Summary

**Required Steps**:
1. ✅ Update Google OAuth redirect URIs
2. ✅ Update Supabase redirect URLs
3. ✅ Test OAuth sign-in
4. ✅ Create admin user

**Recommended Steps**:
5. ✅ Test all core features
6. ✅ Invite test users
7. ✅ Monitor logs

**Time Required**: 15-20 minutes

**Result**: Fully functional production app! 🎉
