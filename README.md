# Youth Workers Community App

A private, approval-only community mobile and web application for youth workers across New England.

## Project Status

### ✅ Completed (Phase 1A - Foundation)

**Project Setup**
- Expo project with TypeScript
- Expo Router for file-based routing
- NativeWind (Tailwind CSS) for styling
- Complete folder structure
- All core dependencies installed
- Environment variables configured

**External Services Documentation**
- Comprehensive SETUP.md guide
- Complete database schema (database-schema.sql)
- Supabase, Google OAuth, Mapbox, Email service setup instructions

**Core Infrastructure**
- Supabase client singleton
- Database TypeScript types
- Constants (States, Colors, Roles, Permissions)
- Auth store with Zustand
- Custom hooks (useAuth, useProfile)

**UI Component Library**
- Button (variants, sizes, loading states)
- Input (label, error, helper text)
- Card, Avatar, Badge, Modal
- LoadingSpinner, Select
- All styled with Tailwind classes

**Authentication & Navigation**
- Google OAuth sign-in page
- Multi-step onboarding form (3 steps)
- Form validation (React Hook Form + Zod)
- Tab navigation (6 tabs)
- Profile page with sign-out
- Smart routing based on auth state
- Auth initialization in root layout

**Profile Components**
- ProfileHeader (avatar, name, role, bio, status)
- ProfileDetails (contact, organization, dates)
- Visibility controls support

### 🚧 Pending External Setup

Before continuing development, you need to:

1. **Create Supabase Project** (see SETUP.md)
   - Execute database-schema.sql
   - Configure Google OAuth
   - Create storage buckets
   - Enable Realtime
   - Add credentials to .env.local

2. **Set up Mapbox** (see SETUP.md)
   - Create account
   - Get access token
   - Add to .env.local

3. **Set up Email Service** (see SETUP.md)
   - Choose Resend or Amazon SES
   - Configure sender domain
   - Add credentials to .env.local

### 📋 Next Steps (After External Setup)

**Immediate Tasks**
- Test authentication flow with real Supabase
- Implement profile update functionality
- Test onboarding form submission

**Phase 1B: Core Features**
- Chat system (channels, messages, real-time)
- Member directory (search, filter)
- Interactive map (Mapbox integration)

**Phase 1C: Advanced Features**
- Events (creation, approval, RSVP)
- Admin panel (approvals, moderation)
- Connections system
- Email notifications

**Phase 1D: Testing & Polish**
- Integration tests
- Manual testing
- Bug fixes
- Documentation

**Phase 1.5: Deployment**
- Deploy to Vercel/Netlify
- Production environment setup

## Tech Stack

- **Frontend**: Expo (React Native) with web support
- **Language**: TypeScript (strict mode)
- **Styling**: NativeWind (Tailwind CSS)
- **Navigation**: Expo Router (file-based)
- **State**: Zustand + React Query
- **Forms**: React Hook Form + Zod
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Maps**: Mapbox GL
- **Email**: Resend or Amazon SES

## Project Structure

```
youth-workers-app/
├── app/                    # Expo Router pages
│   ├── (auth)/            # Auth routes (sign-in, onboarding)
│   ├── (tabs)/            # Main app tabs
│   ├── (modals)/          # Modal screens
│   ├── admin/             # Admin routes
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── profile/          # Profile components
│   ├── chat/             # Chat components (TODO)
│   ├── events/           # Event components (TODO)
│   ├── map/              # Map components (TODO)
│   └── admin/            # Admin components (TODO)
├── lib/                  # Core utilities
│   └── supabase.ts       # Supabase client
├── hooks/                # Custom React hooks
│   ├── useAuth.ts        # Auth hook
│   └── useProfile.ts     # Profile hook
├── stores/               # Zustand stores
│   └── authStore.ts      # Auth state management
├── types/                # TypeScript types
│   ├── database.types.ts # Generated from Supabase
│   ├── user.types.ts     # User types
│   ├── chat.types.ts     # Chat types
│   ├── event.types.ts    # Event types
│   └── connection.types.ts # Connection types
└── constants/            # App constants
    ├── Colors.ts         # Theme colors
    ├── States.ts         # New England states
    ├── Roles.ts          # Ministry focus tags
    └── Permissions.ts    # Visibility levels
```

## Development

### Prerequisites

- Node.js 20.x or later
- npm or yarn

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   cd youth-workers-app
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Follow SETUP.md to configure external services

5. Start the development server:
   ```bash
   npm start
   ```

### Available Scripts

- `npm start` - Start Expo dev server
- `npm run web` - Start web development server
- `npm run android` - Start Android development
- `npm run ios` - Start iOS development (macOS only)

## Documentation

- **SETUP.md** - External services setup guide
- **spec.md** - Complete project specification
- **database-schema.sql** - Database schema with RLS policies

## Features

### Authentication
- Google OAuth sign-in
- Auto-profile creation on first sign-in
- Multi-step onboarding
- Admin approval workflow
- Guest mode (view-only before approval)

### User Profiles
- Complete profile information
- Profile picture upload
- Visibility controls for sensitive fields
- Ministry focus tags
- Organization details

### Navigation
- 6 main tabs: Home, Chat, Directory, Map, Events, Profile
- Modal screens for detail views
- Admin-only routes
- Protected routes based on auth status

## Security

- Row Level Security (RLS) on all database tables
- Visibility controls for profile fields
- Location fuzzing for privacy
- Admin approval required for new users
- Role-based access control

## Contributing

This is a private project. See CONTRIBUTING.md for guidelines.

## License

Private - All rights reserved
