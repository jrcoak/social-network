import type { Database } from './database.types';

export type Event = Database['public']['Tables']['events']['Row'];
export type EventInsert = Database['public']['Tables']['events']['Insert'];
export type EventUpdate = Database['public']['Tables']['events']['Update'];

export type EventRSVP = Database['public']['Tables']['event_rsvps']['Row'];
export type EventRSVPInsert = Database['public']['Tables']['event_rsvps']['Insert'];
export type EventRSVPUpdate = Database['public']['Tables']['event_rsvps']['Update'];

export type EventStatus = Event['status'];
export type EventLocationType = Event['location_type'];
export type RSVPStatus = EventRSVP['status'];

export interface EventWithOrganizer extends Event {
  organizer: {
    id: string;
    first_name: string;
    last_name: string;
    profile_picture_url: string | null;
    organization_name: string;
  };
  rsvp_count?: {
    going: number;
    maybe: number;
    not_going: number;
  };
  user_rsvp?: RSVPStatus | null;
}
