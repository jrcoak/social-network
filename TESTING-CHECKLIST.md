# Testing Checklist

## Pre-Testing Setup

- [ ] Supabase project created and configured
- [ ] Database schema executed successfully
- [ ] Migrations run successfully
- [ ] Channels created (verify with `SELECT * FROM channels`)
- [ ] Google OAuth configured
- [ ] Environment variables set in `.env.local`
- [ ] Dev server running (`npm run web`)

## Authentication Flow

### Sign Up / Sign In
- [ ] Click "Sign in with Google" button
- [ ] Redirects to Google sign-in page
- [ ] Select Google account
- [ ] Redirects back to app
- [ ] Shows onboarding form (for new users)

### Onboarding
- [ ] Step 1: Personal Information
  - [ ] First name (required)
  - [ ] Last name (required)
  - [ ] Phone number (required)
  - [ ] Bio (required, min 20 chars)
- [ ] Step 2: Organization Details
  - [ ] Role/title (required)
  - [ ] Organization name (required)
  - [ ] Street address (required)
  - [ ] City (required)
  - [ ] State dropdown (required)
  - [ ] ZIP code (required)
- [ ] Step 3: Additional Information
  - [ ] Birth month (required)
  - [ ] Birth day (required)
  - [ ] Birth year (optional)
  - [ ] Hire month (required)
  - [ ] Hire year (required)
- [ ] Click "Complete Profile"
- [ ] Profile saved to database
- [ ] Status set to "pending"
- [ ] Redirects to main app

### Profile Status States
- [ ] **Pending**: Can view app but limited interactions
- [ ] **Approved**: Full access to all features
- [ ] **Rejected**: Cannot access app
- [ ] **Suspended**: Temporarily blocked

## Directory

### Viewing Members
- [ ] Shows list of approved members only
- [ ] Displays member cards with:
  - [ ] Profile picture (or initials)
  - [ ] Full name
  - [ ] Role/title
  - [ ] Organization name
  - [ ] State badge

### Search
- [ ] Search by first name
- [ ] Search by last name
- [ ] Search by organization name
- [ ] Search by role/title
- [ ] Search is case-insensitive
- [ ] Results update in real-time

### Filters
- [ ] "All States" shows all members
- [ ] Filter by MA
- [ ] Filter by NH
- [ ] Filter by ME
- [ ] Filter by VT
- [ ] Filter by RI
- [ ] Filter by CT
- [ ] Filters work with search

### Empty States
- [ ] Shows message when no members found
- [ ] Shows message when search has no results

## Chat

### Access Control
- [ ] Pending users see "Chat Unavailable" message
- [ ] Approved users can access chat

### Channels
- [ ] Shows all channels (state + topic)
- [ ] Can switch between channels
- [ ] Selected channel is highlighted
- [ ] Channel names display correctly

### Messaging
- [ ] Can type message in input field
- [ ] Send button enabled when message has content
- [ ] Send button disabled when message is empty
- [ ] Click send button sends message
- [ ] Message appears in chat immediately
- [ ] Message shows sender name
- [ ] Message shows timestamp
- [ ] Own messages appear on right (blue)
- [ ] Other messages appear on left (gray)

### Real-time Updates
- [ ] Open app in two browser tabs
- [ ] Send message in tab 1
- [ ] Message appears in tab 2 immediately
- [ ] No page refresh needed

### Message Display
- [ ] Messages show sender avatar
- [ ] Messages show sender name
- [ ] Messages show time sent
- [ ] Long messages wrap correctly
- [ ] Emoji display correctly
- [ ] Messages scroll to bottom on load
- [ ] Messages scroll to bottom on new message

### Empty States
- [ ] Shows "No messages yet" when channel is empty

## Events

### Viewing Events
- [ ] Shows upcoming events by default
- [ ] Can switch to past events
- [ ] Events sorted by date (upcoming: ascending, past: descending)
- [ ] Event cards show:
  - [ ] Title
  - [ ] Date and time
  - [ ] Location (if in-person)
  - [ ] Description (truncated)
  - [ ] Organizer name
  - [ ] Event type badge (In Person / Virtual)
  - [ ] RSVP counts (going / maybe)

### RSVP Functionality
- [ ] Pending users cannot RSVP
- [ ] Approved users can RSVP
- [ ] Click "Going" marks as going
- [ ] Click "Maybe" marks as maybe
- [ ] Click "Can't Go" marks as not going
- [ ] Selected status is highlighted
- [ ] Can change RSVP status
- [ ] RSVP counts update immediately

### Filters
- [ ] "Upcoming" shows future events only
- [ ] "Past" shows past events only
- [ ] Filter persists when switching tabs

### Empty States
- [ ] Shows "No upcoming events" when none exist
- [ ] Shows "No past events" when none exist

### Create Event Button
- [ ] Visible for approved users
- [ ] Hidden for pending users
- [ ] Click opens create event form (placeholder)

## Map

### Access Control
- [ ] Pending users see "Map Unavailable" message
- [ ] Approved users can access map

### Member Display
- [ ] Shows members who haven't hidden from map
- [ ] Shows members with location data
- [ ] Displays member list below map placeholder

### Filters
- [ ] "All States" shows all members
- [ ] Filter by state shows only members in that state
- [ ] State badges show member count
- [ ] Filters update member list

### Member Cards
- [ ] Shows profile picture or initials
- [ ] Shows full name
- [ ] Shows organization name
- [ ] Shows city and state
- [ ] Shows state badge

### Map Placeholder
- [ ] Shows message about Mapbox integration
- [ ] Explains map is coming soon

### Empty States
- [ ] Shows message when no members in selected area

## Profile

### Viewing Own Profile
- [ ] Shows profile header with:
  - [ ] Profile picture or initials
  - [ ] Full name
  - [ ] Role/title
  - [ ] Organization name
- [ ] Shows profile details:
  - [ ] Contact information
  - [ ] Organization details
  - [ ] Bio
  - [ ] Dates (birth, hire)
- [ ] Shows "Edit Profile" button (placeholder)
- [ ] Shows "Sign Out" button

### Admin Features
- [ ] Admin users see "Admin Panel" button
- [ ] Non-admin users don't see button
- [ ] Click button navigates to admin panel

### Sign Out
- [ ] Click "Sign Out" button
- [ ] Confirms sign out
- [ ] Redirects to sign-in page
- [ ] Session cleared
- [ ] Cannot access protected routes

## Admin Panel

### Access Control
- [ ] Only admin users can access
- [ ] Non-admin users see "Access Denied" message
- [ ] Non-admin users redirected to main app

### Pending Users List
- [ ] Shows all users with "pending" status
- [ ] Sorted by creation date (newest first)
- [ ] Shows count of pending users

### User Details
- [ ] Shows profile picture or initials
- [ ] Shows full name
- [ ] Shows email
- [ ] Shows phone
- [ ] Shows role/title
- [ ] Shows organization details
- [ ] Shows full address
- [ ] Shows bio
- [ ] Shows birth date
- [ ] Shows hire date
- [ ] Shows application date
- [ ] Shows "Pending" badge

### Approval Actions
- [ ] "Approve" button visible
- [ ] "Reject" button visible
- [ ] Click "Approve" updates status to "approved"
- [ ] Click "Reject" updates status to "rejected"
- [ ] Shows "Processing..." while updating
- [ ] Shows success message after update
- [ ] User removed from pending list
- [ ] List refreshes automatically

### Empty States
- [ ] Shows "No pending user approvals" when list is empty

### Navigation
- [ ] "Back" button returns to previous page

## Error Handling

### Network Errors
- [ ] Shows error message when API call fails
- [ ] Doesn't crash app
- [ ] User can retry action

### Authentication Errors
- [ ] Shows error when OAuth fails
- [ ] Shows error when session expires
- [ ] Redirects to sign-in page

### Validation Errors
- [ ] Shows field-level errors in forms
- [ ] Prevents submission with invalid data
- [ ] Error messages are clear and helpful

### Database Errors
- [ ] Shows error when query fails
- [ ] Doesn't expose sensitive information
- [ ] Logs error to console for debugging

## Performance

### Loading States
- [ ] Shows loading spinner during initial load
- [ ] Shows loading spinner during data fetch
- [ ] Shows loading text when appropriate
- [ ] Doesn't show loading indefinitely (10s timeout)

### Real-time Performance
- [ ] Messages appear instantly (< 1s)
- [ ] No lag when typing
- [ ] Smooth scrolling
- [ ] No memory leaks (check browser dev tools)

### Data Fetching
- [ ] Lists load quickly (< 2s)
- [ ] Images load progressively
- [ ] No unnecessary re-fetches

## Security

### Authentication
- [ ] Cannot access app without signing in
- [ ] Session persists across page reloads
- [ ] Session expires appropriately
- [ ] Cannot access other users' private data

### Authorization
- [ ] Pending users have limited access
- [ ] Approved users have full access
- [ ] Admin features only visible to admins
- [ ] Cannot perform admin actions without admin role

### Data Privacy
- [ ] Profile visibility settings respected
- [ ] Cannot view private fields without permission
- [ ] Location data is fuzzed
- [ ] Cannot access suspended users' data

## Browser Compatibility

### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers
- [ ] Chrome Mobile
- [ ] Safari Mobile
- [ ] Firefox Mobile

### Responsive Design
- [ ] Works on desktop (1920x1080)
- [ ] Works on laptop (1366x768)
- [ ] Works on tablet (768x1024)
- [ ] Works on mobile (375x667)

## Console Errors

### Development
- [ ] No errors in browser console
- [ ] No warnings about missing keys
- [ ] No warnings about deprecated APIs
- [ ] Logging is informative and helpful

### Production
- [ ] No sensitive data logged
- [ ] Errors are caught and handled
- [ ] User-friendly error messages

## Database Integrity

### Data Validation
- [ ] Required fields cannot be null
- [ ] Email format validated
- [ ] Phone format validated
- [ ] State values restricted to NE states
- [ ] Status values restricted to valid options

### Relationships
- [ ] Foreign keys enforced
- [ ] Cascade deletes work correctly
- [ ] Cannot create orphaned records

### RLS Policies
- [ ] Users can only update own profile
- [ ] Users can only see approved members
- [ ] Admins can see all users
- [ ] Messages visible to all approved users

## Post-Testing

- [ ] All critical paths tested
- [ ] All bugs documented
- [ ] All features working as expected
- [ ] Ready for production deployment

## Notes

Use this space to document any issues found during testing:

```
Issue: [Description]
Steps to Reproduce: [Steps]
Expected: [Expected behavior]
Actual: [Actual behavior]
Severity: [Critical/High/Medium/Low]
Status: [Open/Fixed/Won't Fix]
```
