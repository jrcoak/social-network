// Visibility permission levels
export const VISIBILITY_LEVELS = {
  PRIVATE: 'private', // Only user and admins
  CONNECTIONS: 'connections', // Only accepted connections
  MEMBERS: 'members', // All approved members
} as const;

export type VisibilityLevel = typeof VISIBILITY_LEVELS[keyof typeof VISIBILITY_LEVELS];

// Fields that can have visibility controls
export const VISIBILITY_FIELDS = {
  PHONE: 'phone',
  BIRTH_MONTH_DAY: 'birth_month_day',
  BIRTH_YEAR: 'birth_year',
  HIRE_DATE: 'hire_date',
  PROFILE_PICTURE: 'profile_picture',
} as const;

export type VisibilityField = typeof VISIBILITY_FIELDS[keyof typeof VISIBILITY_FIELDS];

// Default visibility settings
export const DEFAULT_VISIBILITY_SETTINGS: Record<VisibilityField, VisibilityLevel> = {
  [VISIBILITY_FIELDS.PHONE]: VISIBILITY_LEVELS.PRIVATE,
  [VISIBILITY_FIELDS.BIRTH_MONTH_DAY]: VISIBILITY_LEVELS.CONNECTIONS,
  [VISIBILITY_FIELDS.BIRTH_YEAR]: VISIBILITY_LEVELS.PRIVATE,
  [VISIBILITY_FIELDS.HIRE_DATE]: VISIBILITY_LEVELS.MEMBERS,
  [VISIBILITY_FIELDS.PROFILE_PICTURE]: VISIBILITY_LEVELS.MEMBERS,
};
