-- SUPABASE DATABASE SCHEMA FOR GOOGLE DRIVE ALTERNATIVE

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  storage_used BIGINT NOT NULL DEFAULT 0,
  storage_limit BIGINT NOT NULL DEFAULT 1073741824, -- 1GB default
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User settings table
CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  theme_preference TEXT NOT NULL DEFAULT 'system',
  default_view TEXT NOT NULL DEFAULT 'grid',
  notifications_enabled BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Files table for both files and folders
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  size BIGINT NOT NULL, -- In bytes (0 for folders)
  mime_type TEXT NOT NULL,
  ipfs_hash TEXT, -- IPFS content identifier (empty for folders)
  ipfs_pin_status TEXT DEFAULT 'pinned',
  path TEXT NOT NULL DEFAULT '/',
  is_folder BOOLEAN NOT NULL DEFAULT false,
  parent_id UUID REFERENCES files(id) ON DELETE SET NULL,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_starred BOOLEAN NOT NULL DEFAULT false,
  is_shared BOOLEAN NOT NULL DEFAULT false,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_accessed_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE -- Null means not deleted (soft delete)
);

-- File permissions for sharing
CREATE TABLE file_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  permission_level TEXT NOT NULL CHECK (permission_level IN ('viewer', 'editor', 'owner')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(file_id, user_id) -- Prevent duplicate permissions
);

-- Activity logs
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- create, view, update, delete, share, download
  action_details TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Function to update user storage
CREATE OR REPLACE FUNCTION update_user_storage(user_id UUID, file_size BIGINT)
RETURNS void AS $$
BEGIN
  UPDATE users
  SET 
    storage_used = storage_used + file_size,
    updated_at = now()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Indexes for better performance
CREATE INDEX idx_files_owner_id ON files(owner_id);
CREATE INDEX idx_files_parent_id ON files(parent_id);
CREATE INDEX idx_files_deleted_at ON files(deleted_at);
CREATE INDEX idx_file_permissions_user_id ON file_permissions(user_id);
CREATE INDEX idx_activity_logs_file_id ON activity_logs(file_id);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);

-- Row level security policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY users_select ON users FOR SELECT 
  USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM file_permissions WHERE user_id = auth.uid()
  ));
CREATE POLICY users_update ON users FOR UPDATE
  USING (auth.uid() = id);

-- User settings policies
CREATE POLICY user_settings_select ON user_settings FOR SELECT 
  USING (auth.uid() = user_id);
CREATE POLICY user_settings_update ON user_settings FOR UPDATE
  USING (auth.uid() = user_id);
CREATE POLICY user_settings_insert ON user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Files policies
CREATE POLICY files_select ON files FOR SELECT 
  USING (
    owner_id = auth.uid() OR 
    is_public = true OR 
    EXISTS (
      SELECT 1 FROM file_permissions
      WHERE file_permissions.file_id = files.id AND file_permissions.user_id = auth.uid()
    )
  );
CREATE POLICY files_insert ON files FOR INSERT
  WITH CHECK (owner_id = auth.uid());
CREATE POLICY files_update ON files FOR UPDATE
  USING (
    owner_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM file_permissions
      WHERE file_permissions.file_id = files.id 
        AND file_permissions.user_id = auth.uid()
        AND file_permissions.permission_level = 'editor'
    )
  );
CREATE POLICY files_delete ON files FOR DELETE
  USING (owner_id = auth.uid());

-- File permissions policies
CREATE POLICY file_permissions_select ON file_permissions FOR SELECT
  USING (user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM files 
      WHERE files.id = file_permissions.file_id AND files.owner_id = auth.uid()
    )
  );
CREATE POLICY file_permissions_insert ON file_permissions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM files 
      WHERE files.id = file_permissions.file_id AND files.owner_id = auth.uid()
    )
  );
CREATE POLICY file_permissions_update ON file_permissions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM files 
      WHERE files.id = file_permissions.file_id AND files.owner_id = auth.uid()
    )
  );
CREATE POLICY file_permissions_delete ON file_permissions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM files 
      WHERE files.id = file_permissions.file_id AND files.owner_id = auth.uid()
    )
  );

-- Activity logs policies
CREATE POLICY activity_logs_select ON activity_logs FOR SELECT
  USING (user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM files 
      WHERE files.id = activity_logs.file_id AND files.owner_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM file_permissions
      WHERE file_permissions.file_id = activity_logs.file_id 
        AND file_permissions.user_id = auth.uid()
    )
  );
