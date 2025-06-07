// Database schemas representing our Supabase tables

/**
 * User profile schema
 */
export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  storage_used: number;
  storage_limit: number;
}

/**
 * File schema for storing file metadata
 */
export interface File {
  id: string;
  name: string;
  description?: string;
  size: number;
  mime_type: string;
  ipfs_hash: string;
  ipfs_pin_status: 'queued' | 'pinning' | 'pinned' | 'failed';
  path: string;
  is_folder: boolean;
  parent_id?: string;
  owner_id: string;
  is_starred: boolean;
  is_shared: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  last_accessed_at?: string;
  deleted_at?: string;
}

/**
 * File sharing permissions schema
 */
export interface FilePermission {
  id: string;
  file_id: string;
  user_id: string;
  permission_level: 'viewer' | 'editor' | 'owner';
  created_at: string;
  updated_at: string;
}

/**
 * Activity log schema to track file operations
 */
export interface ActivityLog {
  id: string;
  user_id: string;
  file_id: string;
  action: 'create' | 'view' | 'update' | 'delete' | 'share' | 'download';
  action_details?: string;
  ip_address?: string;
  created_at: string;
}

/**
 * User settings schema
 */
export interface UserSettings {
  user_id: string;
  theme_preference: 'light' | 'dark' | 'system';
  default_view: 'list' | 'grid';
  notifications_enabled: boolean;
  updated_at: string;
}
