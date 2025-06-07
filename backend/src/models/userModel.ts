import { supabase } from '../config/supabase';
import { User, UserSettings } from './types';

/**
 * User model for handling user-related database operations
 */
export const UserModel = {
  /**
   * Create a new user in the database
   */
  async createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at' | 'storage_used'>): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .insert({
        ...user,
        storage_used: 0
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user:', error);
      return null;
    }
    
    return data;
  },
  
  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }
    
    return data;
  },
  
  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) {
      console.error('Error fetching user by email:', error);
      return null;
    }
    
    return data;
  },
  
  /**
   * Update user information
   */
  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user:', error);
      return null;
    }
    
    return data;
  },
  
  /**
   * Update user storage used
   */
  async updateStorageUsed(userId: string, size: number): Promise<boolean> {
    const { error } = await supabase.rpc('update_user_storage', {
      user_id: userId,
      file_size: size
    });
    
    if (error) {
      console.error('Error updating storage used:', error);
      return false;
    }
    
    return true;
  },
  
  /**
   * Get user settings
   */
  async getUserSettings(userId: string): Promise<UserSettings | null> {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user settings:', error);
      return null;
    }
    
    return data;
  },
  
  /**
   * Update user settings
   */
  async updateUserSettings(userId: string, settings: Partial<UserSettings>): Promise<UserSettings | null> {
    const { data, error } = await supabase
      .from('user_settings')
      .update({
        ...settings,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user settings:', error);
      return null;
    }
    
    return data;
  }
};
