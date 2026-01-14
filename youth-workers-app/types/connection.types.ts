import type { Database } from './database.types';

export type Connection = Database['public']['Tables']['connections']['Row'];
export type ConnectionInsert = Database['public']['Tables']['connections']['Insert'];
export type ConnectionUpdate = Database['public']['Tables']['connections']['Update'];

export type ConnectionStatus = Connection['status'];

export interface ConnectionWithUser extends Connection {
  connected_user: {
    id: string;
    first_name: string;
    last_name: string;
    profile_picture_url: string | null;
    role_title: string;
    organization_name: string;
  };
}
