import { supabase } from '../config/supabase';
import { v4 as uuidv4 } from 'uuid';
import type { File, FilePermission } from './types';
import { UserModel } from './userModel';

/**
 * File model for handling file-related database operations
 */
export const FileModel = {
  /**
   * Create a new file record in the database
   */
  async createFile(file: Omit<File, 'id' | 'created_at' | 'updated_at'>): Promise<File | null> {
    const fileId = uuidv4();
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('files')
      .insert({
        ...file,
        id: fileId,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating file:', error);
      return null;
    }
    
    // Update user's storage used
    if (!file.is_folder) {
      await UserModel.updateStorageUsed(file.owner_id, file.size);
    }
    
    // Log the activity
    await this.logActivity({
      user_id: file.owner_id,
      file_id: fileId,
      action: 'create',
      action_details: `Created ${file.is_folder ? 'folder' : 'file'}: ${file.name}`
    });
    
    return data;
  },
  
  /**
   * Get file by ID
   */
  async getFileById(id: string, userId: string): Promise<File | null> {
    // Check if the user has permission to view the file
    const hasPermission = await this.checkPermission(id, userId, ['viewer', 'editor', 'owner']);
    
    if (!hasPermission) {
      console.error('User does not have permission to view this file');
      return null;
    }
    
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();
    
    if (error) {
      console.error('Error fetching file:', error);
      return null;
    }
    
    // Log the file access
    await this.logActivity({
      user_id: userId,
      file_id: id,
      action: 'view'
    });
    
    // Update last_accessed_at
    await supabase
      .from('files')
      .update({
        last_accessed_at: new Date().toISOString()
      })
      .eq('id', id);
    
    return data;
  },
  
  /**
   * Get files in a folder
   */
  async getFilesInFolder(folderId: string | null, userId: string): Promise<File[]> {
    let query = supabase
      .from('files')
      .select('*')
      .is('deleted_at', null);
    
    if (folderId === null) {
      // Get root files
      query = query.is('parent_id', null);
    } else {
      // Get files in a specific folder
      query = query.eq('parent_id', folderId);
    }
    
    // Get files owned by the user or shared with the user
    query = query.or(`owner_id.eq.${userId},is_public.eq.true`);
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching files in folder:', error);
      return [];
    }
    
    // Also get files shared with the user
    const { data: sharedFiles, error: sharedError } = await supabase
      .from('file_permissions')
      .select('files(*)')
      .eq('user_id', userId)
      .is('files.deleted_at', null);
    
    if (sharedError) {
      console.error('Error fetching shared files:', sharedError);
    } else if (sharedFiles) {
      // Add shared files to the results
      const formattedSharedFiles = sharedFiles.map(item => item.files);
      data.push(...formattedSharedFiles);
    }
    
    return data || [];
  },
  
  /**
   * Update file information
   */
  async updateFile(id: string, userId: string, updates: Partial<File>): Promise<File | null> {
    // Check if the user has permission to edit the file
    const hasPermission = await this.checkPermission(id, userId, ['editor', 'owner']);
    
    if (!hasPermission) {
      console.error('User does not have permission to edit this file');
      return null;
    }
    
    const { data, error } = await supabase
      .from('files')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating file:', error);
      return null;
    }
    
    // Log the activity
    await this.logActivity({
      user_id: userId,
      file_id: id,
      action: 'update',
      action_details: `Updated ${data.is_folder ? 'folder' : 'file'}: ${data.name}`
    });
    
    return data;
  },
  
  /**
   * Soft delete a file (mark as deleted)
   */
  async softDeleteFile(id: string, userId: string): Promise<boolean> {
    // Check if the user has permission to delete the file
    const hasPermission = await this.checkPermission(id, userId, ['owner']);
    
    if (!hasPermission) {
      console.error('User does not have permission to delete this file');
      return false;
    }
    
    // Get the file to know the size for storage adjustment
    const { data: file } = await supabase
      .from('files')
      .select('*')
      .eq('id', id)
      .single();
    
    if (!file) {
      console.error('File not found');
      return false;
    }
    
    // Mark the file as deleted
    const { error } = await supabase
      .from('files')
      .update({
        deleted_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting file:', error);
      return false;
    }
    
    // Update user's storage used (reduce the storage used)
    if (!file.is_folder) {
      await UserModel.updateStorageUsed(userId, -file.size);
    }
    
    // Log the activity
    await this.logActivity({
      user_id: userId,
      file_id: id,
      action: 'delete',
      action_details: `Deleted ${file.is_folder ? 'folder' : 'file'}: ${file.name}`
    });
    
    return true;
  },
  
  /**
   * Permanently delete a file from the database and storage
   * Note: The actual file in R2 will be handled by the storage service
   */
  async permanentlyDeleteFile(id: string, userId: string): Promise<boolean> {
    // Check if the user has permission to delete the file
    const hasPermission = await this.checkPermission(id, userId, ['owner']);
    
    if (!hasPermission) {
      console.error('User does not have permission to permanently delete this file');
      return false;
    }
    
    // Get file details
    const { data: file } = await supabase
      .from('files')
      .select('*')
      .eq('id', id)
      .single();
    
    if (!file) {
      console.error('File not found');
      return false;
    }
    
    // Delete all permissions for the file
    await supabase
      .from('file_permissions')
      .delete()
      .eq('file_id', id);
    
    // Delete activity logs for the file
    await supabase
      .from('activity_logs')
      .delete()
      .eq('file_id', id);
    
    // Delete the file record
    const { error } = await supabase
      .from('files')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error permanently deleting file:', error);
      return false;
    }
    
    return true;
  },
  
  /**
   * Share a file with another user
   */
  async shareFile(fileId: string, ownerId: string, targetUserId: string, permissionLevel: FilePermission['permission_level']): Promise<boolean> {
    // Check if the user owns the file
    const hasPermission = await this.checkPermission(fileId, ownerId, ['owner']);
    
    if (!hasPermission) {
      console.error('User does not have permission to share this file');
      return false;
    }
    
    // Check if the user already has a permission for this file
    const { data: existingPermission } = await supabase
      .from('file_permissions')
      .select('*')
      .eq('file_id', fileId)
      .eq('user_id', targetUserId)
      .single();
    
    // Update or insert the permission
    if (existingPermission) {
      const { error } = await supabase
        .from('file_permissions')
        .update({
          permission_level: permissionLevel,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingPermission.id);
      
      if (error) {
        console.error('Error updating file permission:', error);
        return false;
      }
    } else {
      const { error } = await supabase
        .from('file_permissions')
        .insert({
          id: uuidv4(),
          file_id: fileId,
          user_id: targetUserId,
          permission_level: permissionLevel,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error creating file permission:', error);
        return false;
      }
    }
    
    // Update file to indicate it's shared
    await supabase
      .from('files')
      .update({
        is_shared: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', fileId);
    
    // Log the activity
    await this.logActivity({
      user_id: ownerId,
      file_id: fileId,
      action: 'share',
      action_details: `Shared with user: ${targetUserId} as ${permissionLevel}`
    });
    
    return true;
  },
  
  /**
   * Check if a user has permission to access a file
   */
  async checkPermission(
    fileId: string, 
    userId: string, 
    allowedPermissionLevels: FilePermission['permission_level'][]
  ): Promise<boolean> {
    // Check if user is the owner
    const { data: file } = await supabase
      .from('files')
      .select('*')
      .eq('id', fileId)
      .single();
    
    if (!file) {
      return false;
    }
    
    // Check if user is the owner
    if (file.owner_id === userId) {
      return true;
    }
    
    // Check if file is public and permission level allows 'viewer'
    if (file.is_public && allowedPermissionLevels.includes('viewer')) {
      return true;
    }
    
    // Check specific permissions
    const { data: permission } = await supabase
      .from('file_permissions')
      .select('permission_level')
      .eq('file_id', fileId)
      .eq('user_id', userId)
      .single();
    
    if (!permission) {
      return false;
    }
    
    return allowedPermissionLevels.includes(permission.permission_level);
  },
  
  /**
   * Log a file activity
   */
  async logActivity(params: {
    user_id: string;
    file_id: string;
    action: string;
    action_details?: string;
    ip_address?: string;
  }): Promise<void> {
    const { user_id, file_id, action, action_details = '', ip_address = '' } = params;
    
    const { error } = await supabase
      .from('activity_logs')
      .insert({
        id: uuidv4(),
        user_id,
        file_id,
        action,
        action_details,
        ip_address,
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error logging activity:', error);
    }
  },
  
  /**
   * Get activity logs for a file
   */
  async getActivityLogs(fileId: string, userId: string): Promise<any[]> {
    // Check if the user has permission to view the file
    const hasPermission = await this.checkPermission(fileId, userId, ['viewer', 'editor', 'owner']);
    
    if (!hasPermission) {
      console.error('User does not have permission to view activity logs for this file');
      return [];
    }
    
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*, users(full_name, email)')
      .eq('file_id', fileId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching activity logs:', error);
      return [];
    }
    
    return data || [];
  },
  
  /**
   * Search files by name, description, etc.
   */
  async searchFiles(query: string, userId: string): Promise<File[]> {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .or(`owner_id.eq.${userId},is_public.eq.true`)
      .is('deleted_at', null)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`);
    
    if (error) {
      console.error('Error searching files:', error);
      return [];
    }
    
    // Also search in shared files
    const { data: sharedFiles, error: sharedError } = await supabase
      .from('file_permissions')
      .select('files(*)')
      .eq('user_id', userId)
      .is('files.deleted_at', null)
      .or(`files.name.ilike.%${query}%,files.description.ilike.%${query}%`);
    
    if (sharedError) {
      console.error('Error searching shared files:', sharedError);
    } else if (sharedFiles) {
      // Add shared files to the results
      const formattedSharedFiles = sharedFiles.map(item => item.files);
      data.push(...formattedSharedFiles);
    }
    
    return data || [];
  }
};
