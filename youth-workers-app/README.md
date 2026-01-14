# Youth Workers NE - Community App

A private, approval-only community web and mobile application for youth workers across New England.

## Features

- **Authentication**: Google SSO with admin approval workflow
- **User Profiles**: Detailed profiles with privacy controls
- **Chat System**: Real-time messaging in state and topic channels
- **Member Directory**: Search and filter members
- **Interactive Map**: View members on a map (with privacy-fuzzed locations)
- **Events**: Create, browse, and RSVP to events
- **Admin Panel**: User and event approval, moderation tools

## Tech Stack

- **Frontend**: Expo (React Native) with web support
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Maps**: Mapbox GL
- **Language**: TypeScript

## Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account and project
- Google Cloud Console project (for OAuth)
- Mapbox account (for maps)

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd youth-workers-app
npm install
```

### 2. Environment Variables

Create a `.env.local` file:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_MAPBOX_TOKEN=your-mapbox-token
```

### 3. Database Setup

1. Go to your Supabase project
2. Open the SQL Editor
3. Execute the contents of `/database-schema.sql`
4. Execute the contents of `/database-migrations.sql` (if any)

### 4. Configure Google OAuth

See [OAUTH-BLOCKER.md](./OAUTH-BLOCKER.md) for detailed OAuth setup instructions.

**Critical**: The redirect URI in Google Cloud Console MUST match your Supabase callback URL:
```
https://[your-project].supabase.co/auth/v1/callback
```

### 5. Run Development Server

```bash
npm run web
```

The app will open at `http://localhost:8081`

## Project Structure

```
youth-workers-app/
├── app/                    # Expo Router pages
│   ├── (auth)/            # Authentication routes
│   ├── (tabs)/            # Main app tabs
│   ├── (modals)/          # Modal screens
│   ├── admin/             # Admin routes
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── chat/             # Chat components
│   ├── events/           # Event components
│   ├── profile/          # Profile components
│   ├── map/              # Map components
│   └── admin/            # Admin components
├── lib/                  # Core utilities
├── hooks/                # Custom React hooks
├── stores/               # Zustand stores
├── types/                # TypeScript types
└── constants/            # App constants
```

## Available Scripts

- `npm run web` - Start web development server
- `npm run ios` - Start iOS development (requires Mac)
- `npm run android` - Start Android development
- `npm run build:web` - Build for web production
- `npm run export:web` - Export static web build

## Development Workflow

### Adding a New Feature

1. Create components in `components/`
2. Add pages in `app/`
3. Create hooks in `hooks/` if needed
4. Update types in `types/`
5. Test locally
6. Commit and push

### Database Changes

1. Write migration SQL
2. Test in Supabase SQL Editor
3. Add to `/database-migrations.sql`
4. Update TypeScript types: `npx supabase gen types typescript --project-id <project-ref> > types/database.types.ts`

### Styling

Uses NativeWind (Tailwind CSS):

```tsx
<View className="flex-1 bg-white p-4">
  <Text className="text-lg font-bold text-gray-900">Hello</Text>
</View>
```

## Deployment

### Web (Vercel/Netlify)

1. Connect repository to Vercel/Netlify
2. Set environment variables
3. Build command: `npm run export:web`
4. Output directory: `dist`

### Mobile (EAS Build)

```bash
npm install -g eas-cli
eas login
eas build --platform ios
eas build --platform android
```

## Troubleshooting

### OAuth Not Working

See [OAUTH-BLOCKER.md](./OAUTH-BLOCKER.md) for detailed troubleshooting.

**Common issue**: Redirect URI mismatch between Google Cloud Console and Supabase.

### Database Connection Issues

1. Verify `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`
2. Check Supabase project is not paused
3. Verify RLS policies are configured

### Map Not Loading

1. Verify `EXPO_PUBLIC_MAPBOX_TOKEN` is set
2. Check Mapbox token has correct permissions
3. Ensure token is for web usage

## Documentation

- [OAuth Setup Guide](./OAUTH-BLOCKER.md)
- [Database Schema](/database-schema.sql)
- [Spec Document](/spec.md)

## Support

For issues or questions, contact the development team.

## License

Private - All Rights Reserved
