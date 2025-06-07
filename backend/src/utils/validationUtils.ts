import type { Request, Response, NextFunction } from 'express';
import { ZodSchema, z } from 'zod';

/**
 * Middleware factory to validate request data using Zod schemas
 * This creates a middleware function that validates different parts of the request
 * based on the provided schemas
 * 
 * @param schemas Object containing Zod schemas for validating body, query, and/or params
 */
export const validateRequest = (schemas: {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body if schema provided
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      
      // Validate query params if schema provided
      if (schemas.query) {
        req.query = await schemas.query.parseAsync(req.query);
      }
      
      // Validate route params if schema provided
      if (schemas.params) {
        req.params = await schemas.params.parseAsync(req.params);
      }
      
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: 'Validation error',
          errors: error.format()
        });
      }
      
      return res.status(500).json({
        message: 'Server error during validation',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };
};

/**
 * Common validation schemas used throughout the application
 */
export const validationSchemas = {
  // User related schemas
  user: {
    register: z.object({
      email: z.string().email('Invalid email format'),
      password: z.string().min(8, 'Password must be at least 8 characters'),
      full_name: z.string().min(2, 'Full name must be at least 2 characters'),
    }),
    
    login: z.object({
      email: z.string().email('Invalid email format'),
      password: z.string(),
    }),
    
    updateProfile: z.object({
      full_name: z.string().min(2, 'Full name must be at least 2 characters').optional(),
      avatar_url: z.string().url('Invalid URL format').optional(),
    }),
    
    updateSettings: z.object({
      theme_preference: z.enum(['light', 'dark', 'system']).optional(),
      default_view: z.enum(['list', 'grid']).optional(),
      notifications_enabled: z.boolean().optional(),
    }),
  },
  
  // File related schemas
  file: {
    createFolder: z.object({
      name: z.string().min(1, 'Folder name is required'),
      path: z.string().default('/'),
      parentId: z.string().uuid('Invalid parent ID format').optional(),
      description: z.string().optional(),
    }),
    
    updateFile: z.object({
      name: z.string().min(1, 'File name is required').optional(),
      description: z.string().optional(),
      parentId: z.string().uuid('Invalid parent ID format').nullable().optional(),
      isStarred: z.boolean().optional(),
      isPublic: z.boolean().optional(),
    }),
    
    shareFile: z.object({
      targetUserEmail: z.string().email('Invalid email format'),
      permissionLevel: z.enum(['viewer', 'editor']),
    }),
    
    fileId: z.object({
      fileId: z.string().uuid('Invalid file ID format'),
    }),
  },
  
  // Common schemas
  common: {
    pagination: z.object({
      page: z.coerce.number().int().positive().default(1),
      limit: z.coerce.number().int().positive().max(100).default(20),
    }),
    
    search: z.object({
      query: z.string().min(1, 'Search query is required'),
    }),
  },
};
