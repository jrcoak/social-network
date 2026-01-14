# Known Issues

## Web Preview Not Loading (React Version Conflict)

**Status**: Identified, needs resolution

**Problem**: 
The web app shows a blank page with the error: "Cannot read properties of undefined (reading 'ReactCurrentDispatcher')"

**Root Cause**:
- Expo SDK 54 requires React 19.1.0
- react-dom and many other packages require React 18.3.1
- This creates a version mismatch that breaks the app

**Temporary Workaround**:
None currently - the app cannot run in web mode until this is resolved.

**Permanent Solutions** (choose one):

### Option 1: Downgrade to Expo SDK 52 (Recommended)
Expo SDK 52 works with React 18, which is more stable and compatible.

```bash
cd youth-workers-app
npm pkg set dependencies.expo="~52.0.0"
npx expo install --fix
npm install --legacy-peer-deps
```

### Option 2: Upgrade all packages to match Expo SDK 54
Update all packages to their Expo SDK 54 compatible versions:

```bash
cd youth-workers-app
npx expo install --fix
npm install --legacy-peer-deps
```

This will upgrade React to 19.1.0 and update all other packages.

### Option 3: Wait for package updates
Some packages may not yet have React 19 compatible versions. Waiting for ecosystem updates may be necessary.

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
