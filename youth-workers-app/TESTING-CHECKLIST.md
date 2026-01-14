# Testing Checklist

This checklist should be completed after OAuth configuration is fixed.

## Prerequisites

- [ ] OAuth redirect URIs configured correctly in Google Cloud Console
- [ ] Supabase Google OAuth provider configured
- [ ] Database schema executed in Supabase
- [ ] Environment variables set correctly
- [ ] App running locally (`npm run web`)

## Authentication & Onboarding

### Google OAuth Sign-In
- [ ] Click "Sign in with Google" button
- [ ] Redirected to Google OAuth consent screen
- [ ] Select Google account
- [ ] Redirected back to app
- [ ] Console shows: `✅ Session set from OAuth tokens: your-email@gmail.com`
- [ ] Profile auto-created in database

### Onboarding Flow
- [ ] Redirected to onboarding page after first sign-in
- [ ] All required fields present:
  - [ ] First name, last name
  - [ ] Phone number
  - [ ] Role/title
  - [ ] Organization name
  - [ ] Organization address (street, city, state, zip)
  - [ ] Bio
  - [ ] Birth month/day (required)
  - [ ] Birth year (optional)
  - [ ] Hire date (month/year required, day optional)
- [ ] Form validation works (required fields, format validation)
- [ ] Can upload profile picture
- [ ] Submit button creates/updates profile
- [ ] Profile status set to 'pending'

### Guest Mode
- [ ] After onboarding, user has 'pending' status
- [ ] Can view public content (directory, events)
- [ ] Cannot send messages in chat
- [ ] Cannot RSVP to events
- [ ] Cannot send connection requests
- [ ] See "Pending approval" message in restricted areas

## User Profiles

### View Own Profile
- [ ] Navigate to Profile tab
- [ ] See all profile information
- [ ] Profile picture displays correctly
- [ ] All fields populated from onboarding

### Edit Profile
- [ ] Click "Edit Profile" button
- [ ] All fields editable
- [ ] Can change profile picture
- [ ] Can update visibility settings for each field
- [ ] Save button updates profile
- [ ] Changes reflected immediately

### Visibility Controls
- [ ] Set phone to "Private" - only visible to user and admins
- [ ] Set phone to "Connections" - visible to accepted connections
- [ ] Set phone to "Members" - visible to all approved members
- [ ] Test visibility by viewing profile as different user types

### View Other Profiles
- [ ] Navigate to directory
- [ ] Click on another member
- [ ] See their profile
- [ ] Visibility settings respected (can't see private fields)
- [ ] Can send connection request
- [ ] Can send direct message (if connected)

## Admin Approval Workflow

### Admin Panel Access
- [ ] Create admin user (manually set role in database)
- [ ] Sign in as admin
- [ ] Navigate to Admin panel
- [ ] See admin-only navigation

### User Approvals
- [ ] See list of pending users
- [ ] View user details
- [ ] Approve user - status changes to 'approved'
- [ ] User receives approval notification (if email configured)
- [ ] Approved user now has full access
- [ ] Reject user - status changes to 'rejected'
- [ ] Rejected user cannot access app

### Suspend User
- [ ] Admin can suspend approved user
- [ ] Suspended user loses access
- [ ] Can unsuspend user

## Chat System

### Channel List
- [ ] See list of channels (state + topic channels)
- [ ] State channels: MA, NH, ME, VT, RI, CT
- [ ] Topic channels visible
- [ ] Can switch between channels

### Send Messages
- [ ] Type message in input
- [ ] Click send button
- [ ] Message appears in chat
- [ ] Message shows user avatar and name
- [ ] Message shows timestamp

### Real-time Updates
- [ ] Open app in two browser windows
- [ ] Send message in one window
- [ ] Message appears in other window immediately
- [ ] No page refresh needed

### Mentions
- [ ] Type @ in message input
- [ ] Autocomplete shows user list
- [ ] Select user from autocomplete
- [ ] Mention formatted correctly (@username)
- [ ] Mentioned user receives notification (if configured)

### Threads/Replies
- [ ] Click reply on a message
- [ ] Reply input appears
- [ ] Send reply
- [ ] Reply linked to parent message
- [ ] Thread view shows parent and replies

### Edit/Delete Messages
- [ ] Edit own message (within time limit)
- [ ] Changes reflected immediately
- [ ] Delete own message
- [ ] Message marked as deleted (soft delete)

## Member Directory

### View Directory
- [ ] Navigate to Directory tab
- [ ] See list of approved members
- [ ] Member cards show: photo, name, role, organization, location

### Search
- [ ] Search by name - results filter correctly
- [ ] Search by organization - results filter correctly
- [ ] Search by role - results filter correctly
- [ ] Clear search - all members shown

### Filter
- [ ] Filter by state - only members from selected state shown
- [ ] Filter by ministry focus tags - only members with selected tags shown
- [ ] Multiple filters work together
- [ ] Clear filters - all members shown

### Sort
- [ ] Sort by name (A-Z)
- [ ] Sort by join date (newest first)
- [ ] Sort by location (nearest first)

### Interactions
- [ ] Click member card - navigate to profile
- [ ] Send connection request from directory
- [ ] Send direct message (if connected)

## Interactive Map

### Map Display
- [ ] Navigate to Map tab
- [ ] Map loads and centers on New England
- [ ] Member markers appear on map
- [ ] Markers at fuzzed locations (not exact addresses)

### Marker Clustering
- [ ] Zoom out - markers cluster together
- [ ] Cluster shows count
- [ ] Zoom in - clusters expand to individual markers

### Marker Popups
- [ ] Click marker - popup appears
- [ ] Popup shows: name, role, organization
- [ ] Click name in popup - navigate to profile

### Map Filters
- [ ] Filter by state - only markers from selected state shown
- [ ] Filter by ministry focus tags - only markers with selected tags shown
- [ ] "Show only connections" toggle - only connected members shown
- [ ] Clear filters - all members shown

### Privacy
- [ ] Members with "hide from map" enabled don't appear
- [ ] Locations are fuzzed (not exact)
- [ ] No exact addresses displayed

## Events

### View Events
- [ ] Navigate to Events tab
- [ ] See list of upcoming events
- [ ] Event cards show: title, date, time, location, organizer
- [ ] Switch to "Past" tab - see past events

### Event Details
- [ ] Click event card - navigate to details page
- [ ] See full event information
- [ ] See RSVP list (who's going)
- [ ] See RSVP counts

### RSVP
- [ ] Click "Going" - RSVP status updated
- [ ] Click "Maybe" - RSVP status updated
- [ ] Click "Can't Go" - RSVP status updated
- [ ] Change RSVP - status updates
- [ ] RSVP counts update immediately

### Create Event
- [ ] Click "Create Event" button
- [ ] Fill out event form:
  - [ ] Title, description
  - [ ] Start date/time, end date/time
  - [ ] Event type (in-person or virtual)
  - [ ] Location (address or meeting link)
- [ ] Submit event
- [ ] Non-admin: event status is 'pending'
- [ ] Admin: event status is 'approved'

### Event Approval (Admin)
- [ ] Admin sees pending events
- [ ] Approve event - status changes to 'approved'
- [ ] Event appears in public list
- [ ] Organizer receives notification (if configured)
- [ ] Reject event - status changes to 'rejected'
- [ ] Rejected event not visible to public

### Calendar Export
- [ ] Click "Add to Calendar" on event
- [ ] .ics file downloads
- [ ] Open .ics file - event added to calendar
- [ ] Event details correct in calendar

## Connections

### Send Connection Request
- [ ] View another user's profile
- [ ] Click "Connect" button
- [ ] Connection request sent
- [ ] Button changes to "Request Sent"

### Receive Connection Request
- [ ] User B receives connection request from User A
- [ ] Notification appears (if configured)
- [ ] Navigate to connections page
- [ ] See pending request

### Accept Connection
- [ ] Click "Accept" on pending request
- [ ] Connection status changes to 'accepted'
- [ ] Both users now connected
- [ ] Can see connection-only fields on each other's profiles
- [ ] Can send direct messages

### Reject Connection
- [ ] Click "Reject" on pending request
- [ ] Connection status changes to 'rejected'
- [ ] Request removed from list

### View Connections
- [ ] Navigate to connections page
- [ ] See list of accepted connections
- [ ] Click connection - navigate to profile

### Remove Connection
- [ ] Click "Remove Connection" on accepted connection
- [ ] Connection deleted
- [ ] Can no longer see connection-only fields
- [ ] Can no longer send direct messages

## Direct Messages

### Send Direct Message
- [ ] Navigate to connected user's profile
- [ ] Click "Message" button
- [ ] Direct message conversation opens
- [ ] Type and send message
- [ ] Message appears in conversation

### Receive Direct Message
- [ ] User B receives message from User A
- [ ] Notification appears (if configured)
- [ ] Navigate to messages
- [ ] See conversation with User A
- [ ] See new message

### Real-time Updates
- [ ] Open DM conversation in two windows
- [ ] Send message in one window
- [ ] Message appears in other window immediately

## Admin Panel

### User Management
- [ ] View all users
- [ ] Filter by status (pending, approved, suspended, rejected)
- [ ] View user details
- [ ] Approve/reject pending users
- [ ] Suspend/unsuspend users
- [ ] Grant/revoke admin role
- [ ] Grant/revoke moderator role

### Event Management
- [ ] View all events
- [ ] Filter by status (pending, approved, rejected)
- [ ] View event details
- [ ] Approve/reject pending events
- [ ] Edit event details
- [ ] Delete events

### Moderation
- [ ] View reported content
- [ ] Review report details
- [ ] Take action (warn, suspend, delete content)
- [ ] Resolve or dismiss reports

### Channel Management
- [ ] Create new topic channel
- [ ] Edit channel details
- [ ] Archive channel
- [ ] Archived channel not visible to users

## Security & Privacy

### Authentication Guards
- [ ] Unauthenticated users redirected to sign-in
- [ ] Guest users cannot access restricted features
- [ ] Suspended users cannot access app
- [ ] Admin routes only accessible to admins

### Row Level Security
- [ ] Users can only edit their own profile
- [ ] Users can only delete their own messages
- [ ] Users can only see approved members (unless admin)
- [ ] Visibility settings enforced at database level

### Privacy Controls
- [ ] Private fields not visible to non-authorized users
- [ ] Connection-only fields only visible to connections
- [ ] Member-only fields only visible to approved members
- [ ] Location fuzzing works (not exact addresses)
- [ ] "Hide from map" setting respected

## Performance

### Loading States
- [ ] Skeleton screens show while loading
- [ ] Spinners show during actions
- [ ] No blank screens

### Error Handling
- [ ] Network errors show user-friendly messages
- [ ] Failed actions show error messages
- [ ] Retry mechanisms work

### Responsive Design
- [ ] Test on mobile screen size
- [ ] Test on tablet screen size
- [ ] Test on desktop screen size
- [ ] All features work on all sizes
- [ ] Touch targets large enough on mobile

## Cross-Browser Testing

- [ ] Chrome - all features work
- [ ] Firefox - all features work
- [ ] Safari - all features work
- [ ] Edge - all features work

## Console Errors

- [ ] No console errors during normal operation
- [ ] No console warnings (except expected ones)
- [ ] No network errors (except expected failures)

## Completion Criteria

All checkboxes above must be checked for Phase 1 to be considered complete.

## Known Issues

Document any issues found during testing:

1. 
2. 
3. 

## Notes

Add any additional notes or observations:

1. 
2. 
3.
