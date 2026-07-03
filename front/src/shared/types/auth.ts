export type UserRole = 'user' | 'moderator' | 'admin' | 'game_master';

export interface UserProfile {
  username: string;
  avatar_url: string | null;
  title_hrp: string | null;
  role: UserRole;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  email_verified_at: string | null;
  profile?: UserProfile;
}

export interface AuthResponse {
  user: AuthUser;
  message?: string;
}

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}
