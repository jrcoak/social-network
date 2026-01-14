# Youth Workers Community App - Implementation Specification

## Problem Statement

Build a private, approval-only community web and mobile application for youth workers across New England. The app needs to provide Discord-style chat, member profiles with privacy controls, an interactive map, and event management, all gated by manual admin approval.

This is a greenfield project starting from scratch, following the detailed technical specification in `Spec/fullspec.txt`.

## Project Overview

- **Target Users**: 100-200 youth workers at launch
- **Platforms**: Web (Phase 1), iOS + Android (Phase 2)
- **Tech Stack**: Expo (React Native) with web support, Supabase backend, TypeScript
- **Timeline**: Phased approach with iterative delivery

## Completion Criteria

### Phase 1: Core Web Application (Ralph Loop Target)

The Ralph loop will be considered **COMPLETE** when:

#### ✅ Application Running Locally
- Web app runs on localhost and is accessible in browser
- All core features functional (see below)
- No critical bugs blocking user flows

#### ✅ Core Features Functional

**Authentication & Onboarding**
- Google SSO sign-in (OAuth)
- Auto-create profile on first sign-in
- Profile completion form (all required fields)
- Admin approval workflow (pending → approved/rejected)
- Guest access (view-only mode before approval)

**User Profiles**
- Profile creation with all required fields (name, role, organization, bio, dates)
- Profile picture upload
- Visibility controls for sensitive fields (phone, birth year, etc.)
- Profile editing
- View other members' profiles (respecting visibility settings)

**Chat System**
- Channel list (state channels: MA, NH, ME, VT, RI, CT + topic channels)
- Real-time messaging in channels
- Message display with user info
- Basic message input and send
- Mentions support (@username)
- Thread/reply functionality

**Member Directory**
- List all approved members
- Search by name, organization, role
- Filter by state, ministry focus tags
- View member profiles from directory

**Interactive Map**
- Display members on map (fuzzed locations for privacy)
- Member markers with basic info popup
- Filter members by state, tags
- Toggle "hide from map" in profile settings

**Events**
- Create event (with approval workflow for non-admins)
- View events list (upcoming and past)
- Event details page
- RSVP functionality (going/maybe/not going)
- Calendar export (.ics file)
- Admin approval for submitted events

**Admin Panel**
- View pending user approvals
- Approve/reject user registrations
- View pending event approvals
- Approve/reject events
- View all users with status
- Basic moderation tools (suspend users)

#### ✅ External Services Integrated
- Supabase (database, auth, storage, realtime)
- Mapbox (map display)
- Email service (Resend or SES) for notifications
- All services configured with environment variables

#### ✅ Data & Security
- Database schema implemented (all tables from spec)
- Row Level Security (RLS) policies active
- Privacy controls enforced (visibility settings)
- Proper authentication guards on routes

#### ✅ Testing & Quality
- Integration tests for critical paths:
  - User registration → approval → login flow
  - Profile creation and visibility controls
  - Chat message send/receive
  - Event creation → approval → RSVP flow
- Manual testing checklist completed
- No console errors in normal operation

#### ✅ Documentation
- README with setup instructions
- Environment variables documented
- External services setup guide
- Local development workflow documented

### Phase 1.5: Production Deployment (Fast Follow)

**Target**: Complete within 1-2 hours after Phase 1
- Deploy to Vercel/Netlify
- Configure production environment variables
- Verify all features work in production
- Set up custom domain (if available)

### Phase 2: Mobile Apps (Future)

**Not in current Ralph loop scope**
- iOS app build and deployment
- Android app build and deployment
- Platform-specific optimizations
- App store submissions

## Detailed Requirements

### 1. Project Setup

**Initialize Expo Project**
- Create new Expo app with TypeScript template
- Configure Expo Router for file-based routing
- Set up NativeWind (Tailwind CSS for React Native)
- Configure web support
- Set up path aliases (@/components, @/lib, etc.)

**Install Dependencies**
- Supabase client
- State management (Zustand, React Query)
- Forms (React Hook Form, Zod)
- UI components (build custom with NativeWind)
- Mapbox GL
- Date utilities (date-fns)
- Image picker, camera, location, calendar, notifications (Expo modules)

**Project Structure**
```
youth-workers-app/
├── app/                    # Expo Router pages
│   ├── (auth)/            # Auth routes
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

**Configuration Files**
- app.json (Expo config)
- tailwind.config.js
- tsconfig.json (with strict mode)
- .env.local (environment variables)
- .gitignore (exclude node_modules, .env, etc.)

### 2. External Services Setup

**Supabase**
- Create new Supabase project
- Execute database schema SQL (from spec)
- Configure authentication settings
- Enable Google OAuth provider (add Google Client ID/Secret)
- Set up storage buckets (profile-pictures, event-images)
- Enable realtime for messages table
- Configure RLS policies
- Generate TypeScript types from schema

**Mapbox**
- Create Mapbox account
- Get API access token
- Configure for web usage

**Email Service (Resend or Amazon SES)**
- Set up email service account
- Configure sender domain/email
- Create email templates for:
  - Welcome email
  - Approval notification
  - Event notifications
  - Connection requests

**Environment Variables**
```
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
EXPO_PUBLIC_MAPBOX_TOKEN=
EMAIL_SERVICE_API_KEY=
EMAIL_FROM_ADDRESS=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### 3. Database Schema

Implement all tables from `Spec/fullspec.txt`:
- profiles (extends auth.users)
- user_roles
- connections
- channels
- messages
- direct_messages
- events
- event_rsvps
- reports
- blocks

**Key Features**
- UUID primary keys
- Foreign key relationships
- Check constraints for enums
- PostGIS for location data
- JSONB for flexible data (visibility settings)
- Proper indexes for performance
- RLS policies for security

### 4. Authentication & Authorization

**Auth Flow**
1. Sign in with Google SSO (OAuth)
2. Auto-create profile on first sign-in
3. Profile completion (onboarding) - required fields
4. Status: guest (can browse, can't interact)
5. Admin approval
6. Status: approved (full access)

**Authorization Levels**
- Guest: View-only access to public content
- Approved User: Full member access
- Moderator: Can moderate content, approve events
- Admin: Full access including user approvals

**Implementation**
- Supabase Auth with Google OAuth provider
- Auto-create profile record on first sign-in (via database trigger or auth hook)
- Custom RLS policies for authorization
- Auth context/store for client-side state
- Protected routes with auth guards
- Role-based UI rendering

### 5. User Profiles

**Required Fields**
- First name, last name
- Email, phone
- Role/title, organization name
- Organization address (street, city, state, zip)
- Bio (multi-line)
- Birth month/day (required), birth year (optional)
- Hire date (month/year required, day optional)

**Optional Fields**
- Profile picture
- Public email (different from login email)
- Organization website
- Ministry focus tags (multi-select)

**Visibility Controls**
Each field can be set to:
- Private: Only user and admins
- Connections: Only accepted connections
- Members: All approved members

**Location Privacy**
- Geocode organization address
- Fuzz location (add random offset within 5-10 miles)
- Store fuzzed location in database
- Option to hide from map entirely

**Profile Features**
- View own profile
- Edit profile
- Upload/change profile picture
- Manage visibility settings
- View other members' profiles (respecting visibility)
- Connection requests (send/accept/reject)

### 6. Chat System

**Channel Types**
- State channels: MA, NH, ME, VT, RI, CT (auto-created)
- Topic channels: Events, Resources, Prayer, etc. (admin-created)

**Message Features**
- Real-time messaging (Supabase Realtime)
- User avatar and name display
- Timestamp
- Mentions (@username with autocomplete)
- Replies/threads (reply to specific message)
- Edit own messages (within time limit)
- Delete own messages (soft delete)
- Message history (paginated, load more)

**Direct Messages**
- One-on-one messaging between connections
- Real-time updates
- Read receipts
- Message history

**UI Components**
- Channel list sidebar
- Message list (virtualized for performance)
- Message input with mention autocomplete
- Message bubbles (own vs others)
- Thread view

### 7. Member Directory

**Display**
- Grid or list view of members
- Member card: photo, name, role, organization, location
- Pagination or infinite scroll

**Search & Filter**
- Search by name, organization, role
- Filter by state
- Filter by ministry focus tags
- Sort by name, join date, location

**Interactions**
- Click member to view full profile
- Send connection request
- Send direct message (if connected)

### 8. Interactive Map

**Map Display**
- Mapbox GL map centered on New England
- Member markers at fuzzed locations
- Cluster markers when zoomed out

**Marker Features**
- Custom marker icon/color
- Popup on click: name, role, organization
- Link to full profile

**Filters**
- Filter by state
- Filter by ministry focus tags
- Show only connections

**Privacy**
- Respect "hide from map" setting
- Use fuzzed locations only
- No exact addresses displayed

### 9. Events

**Event Creation**
- Form with fields: title, description, dates, location
- Location type: physical or virtual
- Physical: address fields
- Virtual: meeting link
- Status: draft → submitted → approved → published
- Non-admins: events require approval
- Admins: events auto-approved

**Event Display**
- List view: upcoming and past events
- Filter by date range, location, organizer
- Event card: title, date, location, RSVP count
- Event details page: full info, RSVP list

**RSVP System**
- Options: Going, Maybe, Not Going
- Change RSVP anytime
- View who's going (if approved members)
- RSVP count displayed

**Calendar Integration**
- Export event to calendar (.ics file)
- Add to Google Calendar link
- Add to Apple Calendar link

**Admin Approval**
- View pending events
- Approve or reject with notes
- Edit event details if needed

### 10. Admin Panel

**User Management**
- View all users with status filter
- Pending approvals queue
- Approve/reject with notes
- View user details
- Suspend/unsuspend users
- Grant/revoke roles (admin, moderator)

**Event Management**
- View all events with status filter
- Pending events queue
- Approve/reject events
- Edit event details
- Delete events

**Moderation**
- View reported content (messages, users)
- Review reports
- Take action (warn, suspend, delete content)
- Resolve or dismiss reports

**Channel Management**
- Create new topic channels
- Edit channel details
- Archive channels

### 11. Connections System

**Connection Flow**
1. User A sends connection request to User B
2. User B receives notification
3. User B accepts or rejects
4. If accepted: mutual connection established
5. Both users can now see connection-only fields
6. Both users can send direct messages

**UI Features**
- Connection button on profiles
- Pending requests list
- Accepted connections list
- Remove connection option

### 12. Notifications

**Email Notifications**
- Welcome email on first sign-in
- Approval/rejection notification
- Connection request received
- Connection accepted
- Event RSVP reminders
- Mentioned in chat
- Event approval (for organizers)

**In-App Notifications** (Phase 2)
- Push notifications for mobile
- Badge counts
- Notification center

### 13. Privacy & Security

**Data Privacy**
- Visibility controls enforced at database level (RLS)
- Fuzzed locations for map
- No exact addresses exposed
- Phone numbers protected by visibility settings

**Security Measures**
- Row Level Security on all tables
- Authentication required for all actions
- Authorization checks for admin actions
- Input validation (Zod schemas)
- SQL injection prevention (Supabase parameterized queries)
- XSS prevention (React escaping)

**Moderation Tools**
- Report user/message functionality
- Block user functionality
- Admin review of reports
- Suspend/ban capabilities

### 14. UI/UX Design

**Design System**
- NativeWind (Tailwind CSS) for styling
- Consistent color palette (primary blue theme)
- Typography scale
- Spacing system
- Component library (buttons, inputs, cards, etc.)

**Responsive Design**
- Mobile-first approach
- Breakpoints: mobile, tablet, desktop
- Touch-friendly targets (44px minimum)
- Readable text sizes

**Navigation**
- Tab bar for main sections (Home, Chat, Directory, Map, Events, Profile)
- Stack navigation for detail screens
- Modal screens for forms
- Back navigation

**Loading States**
- Skeleton screens for content loading
- Spinners for actions
- Optimistic updates where appropriate

**Error Handling**
- User-friendly error messages
- Retry mechanisms
- Offline state handling (Phase 2)

### 15. Testing Strategy

**Integration Tests** (Phase 1)
- Auth flow: Google sign-in → auto-create profile → onboard → approve → access granted
- Profile: complete → edit → visibility controls
- Chat: send message → receive message → mentions
- Events: create → approve → RSVP
- Connections: request → accept → view connection-only fields

**Manual Testing Checklist**
- All user flows work end-to-end
- Responsive design on different screen sizes
- Cross-browser testing (Chrome, Firefox, Safari)
- Error states display correctly
- Loading states work
- No console errors

**Unit Tests** (Phase 2)
- Utility functions
- Custom hooks
- Complex business logic

**E2E Tests** (Phase 2)
- Critical user journeys
- Admin workflows

### 16. Documentation

**README.md**
- Project overview
- Tech stack
- Prerequisites
- Setup instructions
- Running locally
- Building for production
- Deployment

**SETUP.md**
- Detailed external services setup
- Supabase configuration
- Mapbox setup
- Email service setup
- Environment variables

**DEVELOPMENT.md**
- Project structure
- Coding conventions
- Component patterns
- State management approach
- Adding new features

**API.md** (if custom API endpoints)
- Endpoint documentation
- Request/response formats
- Authentication

## Implementation Approach

### Phase 1A: Foundation (Week 1-2)

**Sprint 1: Project Setup & Infrastructure**
1. Initialize Expo project with TypeScript
2. Configure Expo Router and NativeWind
3. Set up project structure (folders, path aliases)
4. Create Supabase project and execute schema
5. Set up Supabase client and auth
6. Create base UI components (Button, Input, Card, etc.)
7. Set up environment variables
8. Create .gitignore and initial documentation

**Sprint 2: Authentication & Onboarding**
1. Configure Google OAuth in Supabase
2. Implement Google SSO sign-in flow
3. Auto-create profile on first sign-in (database trigger/hook)
4. Onboarding/profile completion form
5. Auth context and protected routes
6. Guest mode (view-only)
7. Admin approval workflow (backend)

### Phase 1B: Core Features (Week 3-5)

**Sprint 3: User Profiles**
1. Profile display component
2. Profile edit form
3. Visibility controls UI
4. Profile picture upload
5. Location geocoding and fuzzing
6. View other profiles (with visibility enforcement)

**Sprint 4: Chat System**
1. Channel list component
2. Message list component (with realtime)
3. Message input component
4. Mentions autocomplete
5. Thread/reply functionality
6. Message edit/delete
7. Direct messages

**Sprint 5: Directory & Map**
1. Member directory list
2. Search and filter functionality
3. Mapbox integration
4. Member markers on map
5. Map filters
6. Marker popups and profile links

### Phase 1C: Events & Admin (Week 6-8)

**Sprint 6: Events**
1. Event creation form
2. Event list view
3. Event details page
4. RSVP functionality
5. Calendar export (.ics)
6. Event approval workflow

**Sprint 7: Admin Panel**
1. Admin layout and navigation
2. User approvals interface
3. Event approvals interface
4. User management (suspend, roles)
5. Moderation tools
6. Channel management

**Sprint 8: Connections & Notifications**
1. Connection request flow
2. Connection list
3. Email notification setup
4. Email templates
5. Notification triggers (approval, connections, mentions)

### Phase 1D: Polish & Testing (Week 9-10)

**Sprint 9: Testing & Bug Fixes**
1. Write integration tests
2. Manual testing checklist
3. Fix critical bugs
4. Performance optimization
5. Accessibility improvements

**Sprint 10: Documentation & Deployment Prep**
1. Complete README and setup docs
2. Environment variable documentation
3. Deployment guide
4. Final testing
5. Code cleanup

### Phase 1.5: Production Deployment (Week 10-11)

**Deployment Sprint**
1. Set up Vercel/Netlify project
2. Configure environment variables
3. Deploy to staging
4. Test in staging environment
5. Deploy to production
6. Set up custom domain
7. Monitor for issues
8. Create rollback plan

### Phase 2: Mobile Apps (Week 11-12+)

**Mobile Polish Sprint**
1. Test on iOS and Android devices
2. Platform-specific optimizations
3. Push notifications setup (Firebase)
4. App icons and splash screens
5. Build with EAS
6. Internal testing (TestFlight, Google Play Beta)
7. App store submissions
8. Launch!

## Success Metrics

**Phase 1 Complete When:**
- [ ] All core features functional on localhost
- [ ] Integration tests passing
- [ ] Manual testing checklist complete
- [ ] Documentation complete
- [ ] No critical bugs

**Phase 1.5 Complete When:**
- [ ] App deployed to production URL
- [ ] All features work in production
- [ ] Environment variables configured
- [ ] Monitoring set up

**Phase 2 Complete When:**
- [ ] iOS app in App Store
- [ ] Android app in Google Play Store
- [ ] Push notifications working
- [ ] Mobile-specific features polished

## Risk Mitigation

**Technical Risks**
- Supabase realtime performance with 100+ users → Load test early
- Map performance with many markers → Implement clustering
- Image upload size/performance → Compress images client-side
- Email deliverability → Use reputable service (Resend/SES)

**Scope Risks**
- Feature creep → Stick to spec, defer nice-to-haves
- Timeline slippage → Regular check-ins, adjust scope if needed
- External service issues → Have backup plans (e.g., alternative email service)

**User Risks**
- Low adoption → Ensure admin approval is fast
- Privacy concerns → Clear documentation of privacy controls
- Moderation needs → Have clear community guidelines

## Open Questions

None - all clarifications received from user.

## Notes

- This is a greenfield project starting from scratch
- Following detailed technical spec in `Spec/fullspec.txt`
- Phased approach: localhost first, then production deployment
- Testing focused on integration tests for critical paths
- Documentation is key for external services setup
