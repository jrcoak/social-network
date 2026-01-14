# OAuth Configuration Blocker

## Current Issue

The application cannot complete the Google OAuth flow due to a configuration mismatch between Google Cloud Console and Supabase.

### Error Message
```
error=server_error
error_code=unexpected_failure
error_description=Unable to exchange external code
```

This error occurs when Supabase receives the OAuth authorization code from Google but cannot exchange it for access tokens.

## Root Cause

The **redirect URI** configured in Google Cloud Console does not match the callback URL that Supabase is using.

## Required Actions

### 1. Get Supabase Callback URL

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers** → **Google**
3. Copy the **Callback URL (for OAuth)** - it should look like:
   ```
   https://[your-project-ref].supabase.co/auth/v1/callback
   ```

### 2. Update Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Find your OAuth 2.0 Client ID (the one used for this app)
4. Click to edit it
5. Under **Authorized redirect URIs**, add the Supabase callback URL from step 1
6. Click **Save**

### 3. Verify Supabase Configuration

1. In Supabase dashboard, go to **Authentication** → **Providers** → **Google**
2. Verify these settings:
   - ✅ Google enabled
   - ✅ Client ID matches your Google Cloud Console OAuth client
   - ✅ Client Secret matches your Google Cloud Console OAuth client
   - ✅ Skip nonce check: **disabled** (recommended)

### 4. Test OAuth Flow

After updating the configuration:

1. Clear your browser cache/cookies for the app
2. Go to the app sign-in page
3. Click "Sign in with Google"
4. Complete the Google OAuth flow
5. You should be redirected back to the app with a successful session

## Expected Console Output After Fix

When OAuth works correctly, you should see:

```
📍 Hash: #access_token=...&refresh_token=...
🔗 OAuth callback detected with tokens, setting session...
✅ Session set from OAuth tokens: your-email@gmail.com
```

## Common Mistakes

❌ **Wrong**: Adding your app's URL (e.g., `https://youth-workers-ne.vercel.app`) as the redirect URI
✅ **Correct**: Adding the Supabase callback URL (e.g., `https://abc123.supabase.co/auth/v1/callback`)

❌ **Wrong**: Using different Google OAuth clients for development and production
✅ **Correct**: Use the same OAuth client or configure both redirect URIs

## Current App State

The application code is correctly configured to:
- ✅ Detect OAuth callback parameters in the URL
- ✅ Extract access and refresh tokens from the hash fragment
- ✅ Call `setSession()` to create the user session
- ✅ Clean up the URL after processing

The blocker is purely a configuration issue in external services.

## Next Steps After Fix

Once OAuth is working:
1. Test the complete sign-in flow
2. Verify profile creation
3. Test the onboarding flow
4. Verify admin approval workflow
5. Continue with remaining feature implementation
