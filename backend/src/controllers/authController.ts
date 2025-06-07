import { Request, Response } from 'express';
import { z } from 'zod';
import { UserModel } from '../models/userModel';
import { generateToken } from '../utils/authUtils';
import { supabase } from '../config/supabase';

// Validation schema for user registration
const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
});

// Validation schema for user login
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string(),
});

/**
 * Controller for authentication-related operations
 */
export const AuthController = {
  /**
   * Register a new user
   */
  async register(req: Request, res: Response) {
    try {
      // Validate request body
      const validationResult = registerSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({
          message: 'Validation error',
          errors: validationResult.error.format()
        });
      }
      
      const { email, password, full_name } = validationResult.data;
      
      // Check if user already exists
      const existingUser = await UserModel.getUserByEmail(email);
      
      if (existingUser) {
        return res.status(409).json({ message: 'User with this email already exists' });
      }
      
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto confirm email for simplicity
        user_metadata: {
          full_name
        }
      });
      
      if (authError || !authData.user) {
        console.error('Error creating user in Auth:', authError);
        return res.status(500).json({ message: 'Error creating user account' });
      }
      
      // Create user in our users table
      const user = await UserModel.createUser({
        email,
        full_name,
        storage_limit: 1073741824, // 1GB default storage limit
      });
      
      if (!user) {
        // Rollback auth user creation if database fails
        await supabase.auth.admin.deleteUser(authData.user.id);
        return res.status(500).json({ message: 'Error creating user profile' });
      }
      
      // Create default user settings
      await supabase
        .from('user_settings')
        .insert({
          user_id: user.id,
          theme_preference: 'system',
          default_view: 'grid',
          notifications_enabled: true,
          updated_at: new Date().toISOString()
        });
      
      // Generate JWT token
      const token = generateToken(user);
      
      // Return success response
      return res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          storage_used: user.storage_used,
          storage_limit: user.storage_limit
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      return res.status(500).json({ message: 'Server error during registration' });
    }
  },
  
  /**
   * Login an existing user
   */
  async login(req: Request, res: Response) {
    try {
      // Validate request body
      const validationResult = loginSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({
          message: 'Validation error',
          errors: validationResult.error.format()
        });
      }
      
      const { email, password } = validationResult.data;
      
      // Authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (authError || !authData.user) {
        console.error('Login error:', authError);
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      
      // Get user from database
      const user = await UserModel.getUserByEmail(email);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Generate JWT token
      const token = generateToken(user);
      
      // Return success response
      return res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          avatar_url: user.avatar_url,
          storage_used: user.storage_used,
          storage_limit: user.storage_limit
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Server error during login' });
    }
  },
  
  /**
   * Get current user profile
   */
  async getProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      
      // Get user from database
      const user = await UserModel.getUserById(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Get user settings
      const userSettings = await UserModel.getUserSettings(userId);
      
      // Return user profile
      return res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          avatar_url: user.avatar_url,
          storage_used: user.storage_used,
          storage_limit: user.storage_limit,
          created_at: user.created_at,
          settings: userSettings
        }
      });
    } catch (error) {
      console.error('Profile fetch error:', error);
      return res.status(500).json({ message: 'Server error fetching profile' });
    }
  },
  
  /**
   * Update user profile
   */
  async updateProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { full_name, avatar_url } = req.body;
      
      // Update user in the database
      const updatedUser = await UserModel.updateUser(userId, {
        full_name,
        avatar_url
      });
      
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Return updated user
      return res.status(200).json({
        message: 'Profile updated successfully',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          full_name: updatedUser.full_name,
          avatar_url: updatedUser.avatar_url,
          storage_used: updatedUser.storage_used,
          storage_limit: updatedUser.storage_limit
        }
      });
    } catch (error) {
      console.error('Profile update error:', error);
      return res.status(500).json({ message: 'Server error updating profile' });
    }
  },
  
  /**
   * Update user settings
   */
  async updateSettings(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { theme_preference, default_view, notifications_enabled } = req.body;
      
      // Validate settings
      const settingsSchema = z.object({
        theme_preference: z.enum(['light', 'dark', 'system']).optional(),
        default_view: z.enum(['list', 'grid']).optional(),
        notifications_enabled: z.boolean().optional(),
      });
      
      const validationResult = settingsSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({
          message: 'Validation error',
          errors: validationResult.error.format()
        });
      }
      
      // Update settings
      const updatedSettings = await UserModel.updateUserSettings(userId, {
        theme_preference,
        default_view,
        notifications_enabled,
        user_id: userId,
      });
      
      if (!updatedSettings) {
        return res.status(404).json({ message: 'User settings not found' });
      }
      
      return res.status(200).json({
        message: 'Settings updated successfully',
        settings: updatedSettings
      });
    } catch (error) {
      console.error('Settings update error:', error);
      return res.status(500).json({ message: 'Server error updating settings' });
    }
  }
};
