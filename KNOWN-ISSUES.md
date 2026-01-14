# Known Issues

## Web Preview Not Loading (React Version Conflict)

**Status**: ✅ RESOLVED

**Problem**: 
The web app shows a blank page with the error: "Cannot read properties of undefined (reading 'ReactCurrentDispatcher')"

**Root Cause**:
- Expo SDK 54 requires React 19.1.0
- react-dom and many other packages require React 18.3.1
- This creates a version mismatch that breaks the app

**Temporary Workaround**:
None currently - the app cannot run in web mode until this is resolved.

**Solution Applied**: ✅ Downgraded to Expo SDK 52

The app now uses:
- Expo SDK 52
- React 18.3.1
- react-dom 18.3.1
- All compatible package versions

The web app now loads successfully and shows the sign-in page.

## Impact

- **Web development**: Blocked until resolved
- **Mobile development**: Should work (not tested yet)
- **Feature development**: Can continue with code that doesn't require running the app
- **Supabase setup**: Can proceed independently

## Next Steps

1. Choose a solution approach (recommend Option 1 - downgrade to SDK 52)
2. Apply the fix
3. Test web app loads
4. Continue with Supabase setup

## Workaround for Viewing UI

Until fixed, you can:
- Review code and components in the repository
- Set up external services (Supabase, etc.)
- Continue with backend/database work
- Test on mobile device once Expo SDK version is resolved
