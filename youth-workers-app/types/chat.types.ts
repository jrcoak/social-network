import type { Database } from './database.types';

export type Channel = Database['public']['Tables']['channels']['Row'];
export type ChannelInsert = Database['public']['Tables']['channels']['Insert'];

export type Message = Database['public']['Tables']['messages']['Row'];
export type MessageInsert = Database['public']['Tables']['messages']['Insert'];
export type MessageUpdate = Database['public']['Tables']['messages']['Update'];

export type DirectMessage = Database['public']['Tables']['direct_messages']['Row'];
export type DirectMessageInsert = Database['public']['Tables']['direct_messages']['Insert'];

export type ChannelType = Channel['type'];

export interface MessageWithUser extends Message {
  user: {
    id: string;
    first_name: string;
    last_name: string;
    profile_picture_url: string | null;
  };
  reply_to_message?: Message | null;
}

export interface DirectMessageWithUser extends DirectMessage {
  from_user: {
    id: string;
    first_name: string;
    last_name: string;
    profile_picture_url: string | null;
  };
  to_user: {
    id: string;
    first_name: string;
    last_name: string;
    profile_picture_url: string | null;
  };
}
