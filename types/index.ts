export type PresenceStatus = "online" | "idle" | "dnd" | "offline" | "invisible";

export interface DiscordBadge {
  id: string;
  label: string;
  emoji?: string;
}

export interface UserProfile {
  id: string;
  discord_id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  bio: string | null;
  gender: string | null;
  badges: DiscordBadge[];
  presence: PresenceStatus;
  created_at: string;
  updated_at: string;
}

// Supabase database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, "created_at" | "updated_at"> & {
          id: string;
        };
        Update: Partial<Omit<UserProfile, "id" | "created_at">>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
