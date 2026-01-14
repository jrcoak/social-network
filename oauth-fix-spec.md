# OAuth Login Fix - Specification

## Problem Statement

Google OAuth login is failing with error: "Unable to exchange external code". The user cannot sign in to the application, blocking all functionality.

## Root Cause Analysis

Based on the configuration provided:

**Current Google Cloud Console Authorized redirect URIs:**
1. ❌ `https://social-network-ywne.vercel.app/auth/v1/callback` - INCORRECT
2. ✅ `https://srixrvcebfbkuiugvnqv.supabase.co/auth/v1/callback` - CORRECT

**Current Supabase Redirect URLs:**
- `https://social-network-ywne.vercel.app/**` - This is correct for the app redirect

**The Problem:**
The first redirect URI in Google Cloud Console is wrong. Google OAuth should ONLY redirect to the Supabase callback URL, not the app URL. The app URL is configured in Supabase settings, not in Google Cloud Console.

## Current Status

✅ Google Cloud Console redirect URIs fixed
❌ Still getting "Unable to exchange external code" error

This means there's another configuration issue beyond redirect URIs.

## Completion Criteria

The OAuth fix will be considered **COMPLETE** when:

1. ✅ Google Cloud Console has ONLY the Supabase callback URL as an authorized redirect URI (DONE)
2. ✅ All Google OAuth credentials match between Google Cloud Console and Supabase
3. ✅ OAuth consent screen properly configured
4. ✅ User can click "Sign in with Google" in the app
5. ✅ User is redirected to Google OAuth consent screen
6. ✅ After selecting Google account, user is redirected back to the app
7. ✅ Console shows: `✅ Session set from OAuth tokens: user-email@gmail.com`
8. ✅ User is signed in and can access the app
9. ✅ No "Unable to exchange external code" error

## Required Actions

### Action 1: Fix Google Cloud Console Configuration

**User must do this (cannot be automated):**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Find the OAuth 2.0 Client ID used for this app
4. Click to edit it
5. Under **Authorized redirect URIs**, REMOVE this URI:
   - ❌ `https://social-network-ywne.vercel.app/auth/v1/callback`
6. Keep ONLY this URI:
   - ✅ `https://srixrvcebfbkuiugvnqv.supabase.co/auth/v1/callback`
7. Click **Save**

### Action 2: Verify Google OAuth Client Credentials Match

**CRITICAL - This is likely the issue:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. **Copy the Client ID** (looks like: `123456789-abc123.apps.googleusercontent.com`)
5. Click **Download JSON** or view the **Client Secret**
6. **Copy the Client Secret** (looks like: `GOCSPX-abc123xyz...`)

Now go to Supabase:
7. Navigate to **Authentication** → **Providers** → **Google**
8. **Paste the Client ID** - must match EXACTLY
9. **Paste the Client Secret** - must match EXACTLY
10. Click **Save**

**Common mistake:** Using the wrong OAuth client or having typos in credentials.

### Action 3: Verify OAuth Consent Screen

1. In Google Cloud Console, go to **APIs & Services** → **OAuth consent screen**
2. Check the **Publishing status**:
   - If **Testing**: You MUST add your email as a test user
   - If **In Production**: Should work for any Google account
3. If in Testing mode:
   - Click **ADD USERS** under "Test users"
   - Add your Google email address
   - Click **Save**

### Action 4: Verify Supabase URL Configuration

1. Go to Supabase project dashboard
2. Navigate to **Authentication** → **URL Configuration**
3. Verify **Site URL** is set to: `https://social-network-ywne.vercel.app`
4. Verify **Redirect URLs** includes: `https://social-network-ywne.vercel.app/**`

### Action 5: Check OAuth Scopes

1. In Supabase, go to **Authentication** → **Providers** → **Google**
2. Under **Scopes**, verify it includes at minimum:
   - `openid`
   - `email`
   - `profile`

### Action 6: Test OAuth Flow

After fixing ALL configurations above:

1. **Wait 5-10 minutes** for Google changes to propagate
2. Clear browser cache/cookies for the app (or use incognito mode)
3. Go to `https://social-network-ywne.vercel.app`
4. Open browser DevTools Console (F12)
5. Click "Sign in with Google"
6. Watch the console output
7. Complete Google OAuth flow
8. Verify successful sign-in

### Action 7: If Still Failing - Check These

**In Google Cloud Console:**
1. Verify the OAuth client is for "Web application" type
2. Check that APIs are enabled:
   - Go to **APIs & Services** → **Library**
   - Search for "Google+ API" or "People API"
   - Make sure it's enabled

**In Supabase:**
1. Check project logs:
   - Go to **Logs** → **Auth Logs**
   - Look for error messages about the OAuth exchange
2. Verify database connection is working
3. Check that the project is not paused

## Expected Behavior After Fix

### Console Output
```
🔄 Initializing auth...
🔍 Checking for existing session...
📍 Current URL: https://social-network-ywne.vercel.app/(auth)/sign-in#access_token=...
📍 Hash: #access_token=...&refresh_token=...
🔗 OAuth callback detected with tokens, setting session...
✅ Session set from OAuth tokens: user@example.com
👤 Fetching profile and roles...
✅ Profile fetched successfully: user@example.com
```

### User Experience
1. User clicks "Sign in with Google"
2. Redirected to Google OAuth consent screen
3. Selects Google account
4. Redirected back to app
5. Sees loading spinner briefly
6. Redirected to onboarding (if first time) or main app (if returning user)

## Why This Fix Works

**OAuth Flow Explanation:**

1. User clicks "Sign in with Google" in app
2. App redirects to Google OAuth with:
   - Client ID
   - Redirect URI: `https://srixrvcebfbkuiugvnqv.supabase.co/auth/v1/callback`
3. User authenticates with Google
4. Google redirects to Supabase callback URL with authorization code
5. Supabase exchanges code for tokens with Google
6. Supabase redirects to app URL with tokens in hash fragment
7. App extracts tokens and creates session

**The error occurs at step 5** because Google rejects the token exchange when the redirect URI doesn't match exactly.

## Common Mistakes

❌ **Wrong**: Adding app URL to Google Cloud Console redirect URIs
✅ **Correct**: Only Supabase callback URL in Google Cloud Console

❌ **Wrong**: Adding Supabase callback URL to Supabase redirect URLs
✅ **Correct**: Only app URLs in Supabase redirect URLs

## Verification Checklist

After making changes, verify:

- [ ] Google Cloud Console has ONLY Supabase callback URL
- [ ] Supabase has app URL in redirect URLs
- [ ] Supabase Site URL is set to app URL
- [ ] Google OAuth provider is enabled in Supabase
- [ ] Client ID and Secret match between Google and Supabase
- [ ] Browser cache cleared before testing
- [ ] OAuth flow completes successfully
- [ ] User is signed in after OAuth
- [ ] No console errors

## Most Likely Issues (In Order)

Based on "Unable to exchange external code" error, check these in order:

### 1. Client ID/Secret Mismatch (MOST COMMON)
- The Client ID or Client Secret in Supabase doesn't exactly match Google Cloud Console
- Even a single character difference will cause this error
- **Fix:** Copy-paste credentials directly from Google Cloud Console to Supabase

### 2. OAuth Consent Screen in Testing Mode
- If your OAuth consent screen is in "Testing" mode, only test users can sign in
- **Fix:** Add your email as a test user, or publish the consent screen

### 3. Wrong OAuth Client Type
- The OAuth client must be "Web application" type
- **Fix:** Create a new OAuth client of type "Web application"

### 4. Missing or Incorrect Scopes
- Supabase needs at minimum: `openid`, `email`, `profile`
- **Fix:** Verify scopes in Supabase Google provider settings

### 5. Google APIs Not Enabled
- Required APIs might not be enabled in your Google Cloud project
- **Fix:** Enable "Google+ API" or "People API"

## Additional Checks

If OAuth still fails after checking the above:

1. **Google OAuth Consent Screen**
   - Status: Published (not Testing)
   - Or: Your email is added to test users if in Testing mode

2. **Google OAuth Scopes**
   - Minimum required: `email`, `profile`, `openid`

3. **Supabase Project Status**
   - Project is not paused
   - Database is accessible

4. **Network Issues**
   - No firewall blocking Supabase
   - No ad blockers interfering

5. **Browser Console**
   - Check for any JavaScript errors
   - Check Network tab for failed requests

## Success Criteria Summary

✅ OAuth configuration fixed in Google Cloud Console
✅ User can sign in with Google
✅ No "Unable to exchange external code" error
✅ Session created successfully
✅ User redirected to appropriate page after sign-in

## Notes

- This is a configuration-only fix - no code changes needed
- The app code is already correctly implemented
- The fix requires user action in external services (Google Cloud Console)
- Testing should be done in an incognito/private browser window to avoid cached credentials
