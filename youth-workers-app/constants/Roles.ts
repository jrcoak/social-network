// Ministry focus tags/roles
export const MINISTRY_FOCUS_TAGS = [
  'Middle School',
  'High School',
  'College',
  'Young Adults',
  'Worship',
  'Small Groups',
  'Outreach',
  'Missions',
  'Sports Ministry',
  'Arts & Creative',
  'Discipleship',
  'Leadership Development',
  'Family Ministry',
  'Urban Ministry',
  'Rural Ministry',
  'Camp & Retreat',
  'Volunteer Coordination',
  'Social Justice',
  'Mental Health',
  'Special Needs',
] as const;

export type MinistryFocusTag = typeof MINISTRY_FOCUS_TAGS[number];
