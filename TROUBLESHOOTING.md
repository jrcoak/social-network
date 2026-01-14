# Troubleshooting Guide

## Blank Page Issue

### Symptoms
- Browser shows blank white page at `http://localhost:8081`
- Page appears to be loading but nothing displays
- Browser console may show "Initializing..." message

### Root Causes
1. **Auth initialization hanging**: Supabase `getSession()` call may timeout
2. **OAuth callback loop**: App stuck processing OAuth redirect
3. **JavaScript error**: Bundle fails to load or execute
4. **Cache issue**: Browser serving old cached version

### Solutions

#### Solution 1: Hard Refresh Browser
The most common fix - clears cache and reloads JavaScript:

**Chrome/Edge/Firefox (Windows/Linux):**
- Press `Ctrl + Shift + R` or `Ctrl + F5`

**Chrome/Edge (Mac):**
- Press `Cmd + Shift + R`

**Safari (Mac):**
- Press `Cmd + Option + R`

**Alternative:**
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

#### Solution 2: Clear Browser Data
If hard refresh doesn't work:

1. Open browser settings
2. Go to Privacy/Security
3. Clear browsing data
4. Select:
   - Cached images and files
   - Cookies and site data
5. Time range: Last hour
6. Clear data
7. Reload page

#### Solution 3: Check Console for Errors
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for error messages (red text)
4. Look for our debug messages:
   - 🚀 App starting...
   - 🔄 Initializing auth...
   - ✅ Auth initialization complete
   - ⚠️ Initialization timeout

**Expected console output (successful load):**
```
🚀 App starting...
🔄 Initializing auth...
🔍 Checking for existing session...
ℹ️ No existing session found
👂 Setting up auth state listener...
✅ Auth initialization complete
⏳ App loading... {initialized: true, loading: false}
✅ App initialized, rendering routes
```

**If you see timeout warning:**
```
⚠️ Initialization timeout - forcing app to load
```
This is normal if Supabase is slow to respond. The app should still load.

#### Solution 4: Restart Dev Server
If the issue persists:

1. Stop the dev server:
   ```bash
   # Find the process
   ps aux | grep "expo start"
   
   # Kill it
   pkill -f "expo start"
   ```

2. Start it again:
   ```bash
   cd youth-workers-app
   npm run web
   ```

3. Wait for "Bundling complete" message
4. Refresh browser

#### Solution 5: Check Environment Variables
Verify `.env.local` exists and has correct values:

```bash
cd youth-workers-app
cat .env.local
```

Should show:
```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

If missing or incorrect:
1. Copy from `.env.example`
2. Fill in your Supabase credentials
3. Restart dev server

#### Solution 6: Verify Supabase Connection
Test if Supabase is accessible:

```bash
curl -I https://YOUR_PROJECT.supabase.co
```

Should return `HTTP/2 200`. If not:
- Check Supabase project is not paused
- Verify URL is correct
- Check internet connection

## OAuth Issues

### Symptoms
- Redirects to Google but comes back to blank page
- "Sign in with Google" button does nothing
- Console shows OAuth errors

### Solutions

#### Check OAuth Configuration
1. Go to Google Cloud Console
2. Verify OAuth client credentials
3. Check authorized redirect URIs include:
   - `http://localhost:8081`
   - `https://YOUR_PROJECT.supabase.co/auth/v1/callback`

#### Check Supabase Auth Settings
1. Go to Supabase dashboard
2. Authentication → Providers
3. Verify Google provider is enabled
4. Check Client ID and Secret are correct

#### Clear OAuth State
Sometimes OAuth state gets stuck:

1. Clear browser cookies for:
   - `localhost:8081`
   - `supabase.co`
   - `google.com`
2. Try signing in again

## Database Issues

### Symptoms
- App loads but shows errors when fetching data
- "Failed to fetch" errors in console
- Empty lists when data should exist

### Solutions

#### Verify Schema Executed
```sql
-- In Supabase SQL Editor
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Should show: channels, connections, direct_messages, event_rsvps, events, messages, profiles, reports, user_roles

#### Check RLS Policies
```sql
-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

All tables should have `rowsecurity = true`.

#### Verify Channels Exist
```sql
SELECT * FROM channels ORDER BY type, name;
```

Should show 10 channels (6 state + 4 topic). If empty:
1. Run `database-migrations.sql`
2. Verify no errors

## Performance Issues

### Symptoms
- App is slow to load
- Messages take long to appear
- UI feels laggy

### Solutions

#### Check Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Reload page
4. Look for:
   - Slow requests (> 2 seconds)
   - Failed requests (red)
   - Large bundle sizes (> 5MB)

#### Check Realtime Connection
```javascript
// In browser console
supabase.getChannels()
```

Should show active channels. If empty:
1. Check Realtime is enabled in Supabase
2. Verify WebSocket connection in Network tab

#### Reduce Bundle Size
If bundle is large:
1. Check for unnecessary imports
2. Use dynamic imports for large components
3. Remove unused dependencies

## Common Error Messages

### "Cannot read properties of undefined"
**Cause**: Trying to access property on null/undefined object
**Fix**: Check data is loaded before accessing properties

### "Network request failed"
**Cause**: Cannot reach Supabase
**Fix**: 
- Check internet connection
- Verify Supabase URL is correct
- Check Supabase project is not paused

### "Invalid API key"
**Cause**: Wrong Supabase anon key
**Fix**:
- Copy correct key from Supabase dashboard
- Update `.env.local`
- Restart dev server

### "Row Level Security policy violation"
**Cause**: User doesn't have permission to access data
**Fix**:
- Check user status is 'approved'
- Verify RLS policies are correct
- Check user has required role

## Still Having Issues?

### Collect Debug Information

1. **Browser Console Output**:
   - Open DevTools (F12)
   - Go to Console tab
   - Copy all messages
   - Look for 🚀, 🔄, ✅, ❌, ⚠️ emoji messages

2. **Network Requests**:
   - Open DevTools (F12)
   - Go to Network tab
   - Reload page
   - Look for failed requests (red)
   - Check request/response details

3. **Environment Info**:
   ```bash
   # Node version
   node --version
   
   # NPM version
   npm --version
   
   # Expo version
   cd youth-workers-app
   npx expo --version
   
   # Check if server is running
   ps aux | grep expo
   ```

4. **Database State**:
   ```sql
   -- In Supabase SQL Editor
   
   -- Check your user
   SELECT id, email, status FROM profiles WHERE email = 'your@email.com';
   
   -- Check your roles
   SELECT * FROM user_roles WHERE user_id = 'your-user-id';
   
   -- Check channels
   SELECT COUNT(*) FROM channels;
   ```

### Get Help

Include this information when asking for help:
- Browser and version
- Operating system
- Console output (with emoji messages)
- Failed network requests
- Steps to reproduce
- What you've already tried

## Quick Fixes Checklist

When something goes wrong, try these in order:

- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Clear browser cache
- [ ] Check browser console for errors
- [ ] Verify dev server is running
- [ ] Check `.env.local` exists and is correct
- [ ] Restart dev server
- [ ] Clear browser cookies
- [ ] Try incognito/private window
- [ ] Check Supabase project is active
- [ ] Verify database schema is executed
- [ ] Check OAuth credentials are correct

If none of these work, collect debug information and seek help.
