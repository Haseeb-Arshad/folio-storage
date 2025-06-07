import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { FileModel } from '../models/fileModel';
import { StorageService } from '../services/storageService';
import { R2StorageService } from '../services/r2StorageService';
import multer from 'multer';
import { config } from '../config/env';
import type { AuthRequest } from '../middleware/authMiddleware';
import type { File } from '../models/types';

// Initialize Supabase client
const supabase = createClient(
  config.SUPABASE_URL,
  config.SUPABASE_SERVICE_KEY
);

// Configure multer for memory storage
const storage = multer.memoryStorage();
export const upload = multer({ 
  storage,
  limits: { 
    fileSize: config.MAX_FILE_SIZE 
  }
});

// Helper type for file upload results
interface UploadResult {
  success: boolean;
  fileId?: string;
  ipfsHash?: string;
  pinataUrl?: string;
  error?: string;
}

// Helper type for file update parameters
interface FileUpdateParams {
  name?: string;
  description?: string;
  parent_id?: string;
  is_starred?: boolean;
  is_public?: boolean;
}

/**
 * Controller for file-related operations
 */
export const FileController = {
  /**
   * Upload a new file
   */
  async uploadFile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }
      const userId = req.user.id;
      
      if (!req.file) {
        res.status(400).json({ message: 'No file provided' });
        return;
      }
      
      // Extract file details
      const { originalname, mimetype, size, buffer } = req.file;
      const { path = '/', parentId, description } = req.body;
      
      // Upload file to Cloudflare R2
      const uploadResult = await R2StorageService.uploadFile(buffer, {
        fileName: originalname,
        mimeType: mimetype,
        size: size,
        path: path,
        description: description
      }, userId) as UploadResult;

      if (!uploadResult.success) {
        res.status(500).json({
          message: 'Failed to upload file',
          error: uploadResult.error || 'Unknown upload error'
        });
        return;
      }

      // Save file metadata to Supabase
      const file = await FileModel.createFile({
        owner_id: userId,
        name: originalname,
        mime_type: mimetype,
        size: size,
        path: path,
        parent_id: parentId,
        description: description || '',
        ipfs_hash: uploadResult.ipfsHash || '',
        ipfs_pin_status: 'pinned', // R2 uploads are considered 'pinned' immediately
        is_folder: false,
        is_public: false,
        is_starred: false,
        is_shared: false
      });

      res.status(201).json(file);
    } catch (error: unknown) {
      res.status(500).json({ 
        message: 'Failed to upload file',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      return;
    }
  },
  
  /**
   * Create a new folder
   */
  async createFolder(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }
      const userId = req.user.id;
      const { name, parentId } = req.body;

      if (!name) {
        res.status(400).json({ message: 'Folder name is required' });
        return;
      }

      // Validate folder name
      const folderSchema = z.object({
        name: z.string().min(1, 'Folder name is required'),
        parentId: z.string().optional()
      });

      const validationResult = folderSchema.safeParse({ name, parentId });
      if (!validationResult.success) {
        res.status(400).json({
          message: 'Validation error',
          errors: validationResult.error.format()
        });
        return;
      }

      const folder = await FileModel.createFile({
        owner_id: userId,
        name,
        mime_type: 'folder',
        parent_id: parentId || null,
        size: 0,
        path: '/',
        description: '',
        is_folder: true,
        is_public: false,
        ipfs_hash: '',
        ipfs_pin_status: 'pinned', // For folders, mark as pinned even though there's no actual R2 object
        is_starred: false,
        is_shared: false
      });

      if (!folder) {
        res.status(500).json({ message: 'Failed to create folder' });
        return;
      }

      res.status(201).json(folder);
    } catch (error: unknown) {
      res.status(500).json({ 
        message: 'Failed to create folder',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      return;
    }
  },
  
  /**
   * Get all files in a folder
   */
  async getFiles(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }
      const userId = req.user.id;
      const { folderId } = req.params;
      const { search, type, sortBy, sortDir, page, pageSize } = req.query;

      // Validate query parameters
      const querySchema = z.object({
        search: z.string().optional(),
        type: z.string().optional(),
        sortBy: z.string().optional(),
        sortDir: z.enum(['asc', 'desc']).optional(),
        page: z.number().int().min(1).optional(),
        pageSize: z.number().int().min(1).optional()
      });

      const query = querySchema.safeParse(req.query);
      if (!query.success) {
        res.status(400).json({
          message: 'Invalid query parameters',
          errors: query.error.format()
        });
        return;
      }

      const files = await FileModel.getFilesInFolder(folderId || null, userId);
      // Note: The original getFiles method with filtering options doesn't exist in the FileModel
      // For now, we'll use getFilesInFolder and handle filtering in the controller if needed

      res.json(files);
    } catch (error: unknown) {
      res.status(500).json({ 
        message: 'Failed to get files',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      return;
    }
  },
  
  /**
   * Get a single file by ID
   */
  async getFile(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }
      const userId = req.user.id;
      const { fileId } = req.params;

      if (!fileId) {
        res.status(400).json({ message: 'File ID is required' });
        return;
      }

      const file = await FileModel.getFileById(userId, fileId);
      if (!file) {
        res.status(404).json({ message: 'File not found' });
        return;
      }

      res.json(file);
    } catch (error: unknown) {
      res.status(500).json({ 
        message: 'Failed to get file', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    } finally {
      return;
    }
  },
  
  /**
   * Download a file
   */
  async downloadFile(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }
      const userId = req.user.id;
      const { fileId } = req.params;

      if (!fileId) {
        res.status(400).json({ message: 'File ID is required' });
        return;
      }

      const file = await FileModel.getFileById(userId, fileId);
      if (!file) {
        res.status(404).json({ message: 'File not found' });
        return;
      }

      // Get file content from R2
      const fileContent = await R2StorageService.getFileFromR2(file.ipfs_hash);
      if (!fileContent) {
        res.status(500).json({ message: 'Failed to retrieve file content' });
        return;
      }

      // Set appropriate headers
      res.setHeader('Content-Type', file.mime_type);
      res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
      res.setHeader('Content-Length', file.size.toString());

      // Stream the file content
      res.send(fileContent);
    } catch (error: unknown) {
      res.status(500).json({ 
        message: 'Failed to download file', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    } finally {
      return;
    }
  },
  
  /**
   * Update file details
   */
  async updateFile(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }
      const userId = req.user.id;
      const { fileId } = req.params;

      if (!fileId) {
        res.status(400).json({ message: 'File ID is required' });
        return;
      }

      // Validate request body
      const updateSchema = z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        parentId: z.string().nullable().optional(),
        isStarred: z.boolean().optional(),
        isPublic: z.boolean().optional()
      });

      const validationResult = updateSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        res.status(400).json({
          message: 'Validation error',
          errors: validationResult.error.format()
        });
        return;
      }

      // Prepare updates
      const updates: any = {};

      if (validationResult.data.name !== undefined) {
        updates.name = validationResult.data.name;
      }

      if (validationResult.data.description !== undefined) {
        updates.description = validationResult.data.description;
      }

      if (validationResult.data.parentId !== undefined) {
        updates.parentId = validationResult.data.parentId;
      }

      if (validationResult.data.isStarred !== undefined) {
        updates.isStarred = validationResult.data.isStarred;
      }

      if (validationResult.data.isPublic !== undefined) {
        updates.isPublic = validationResult.data.isPublic;

        // If file has a storage hash, update its public status in R2
        const file = await FileModel.getFileById(userId, fileId);
        if (file && !file.is_folder && file.ipfs_hash) {
          await R2StorageService.updateFileVisibility(file.ipfs_hash, validationResult.data.isPublic);
        }
      }

      // Convert updates to match expected property names in the model
      const fileUpdates: Partial<File> = {};
      
      if (updates.name !== undefined) fileUpdates.name = updates.name;
      if (updates.description !== undefined) fileUpdates.description = updates.description;
      if (updates.parentId !== undefined) fileUpdates.parent_id = updates.parentId;
      if (updates.isStarred !== undefined) fileUpdates.is_starred = updates.isStarred;
      if (updates.isPublic !== undefined) fileUpdates.is_public = updates.isPublic;
      
      // Update the file
      const updatedFile = await FileModel.updateFile(fileId, userId, fileUpdates);
      
      if (!updatedFile) {
        res.status(404).json({ message: 'File not found or permission denied' });
        return;
      }

      res.json(updatedFile);
    } catch (error: unknown) {
      res.status(500).json({ 
        message: 'Failed to update file', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    } finally {
      return;
    }
  },
  
  /**
   * Delete a file (soft delete)
   */
  async deleteFile(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }
      const userId = req.user.id;
      const { fileId } = req.params;

      if (!fileId) {
        res.status(400).json({ message: 'File ID is required' });
        return;
      }

      // Soft delete the file
      const success = await FileModel.softDeleteFile(fileId, userId);
      
      if (!success) {
        res.status(404).json({ message: 'File not found or permission denied' });
        return;
      }

      res.json({ message: 'File deleted successfully' });
    } catch (error: unknown) {
      res.status(500).json({ 
        message: 'Failed to delete file', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    } finally {
      return;
    }
  },
  
  /**
   * Permanently delete a file
   */
  async permanentlyDeleteFile(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }
      const userId = req.user.id;
      const { fileId } = req.params;

      if (!fileId) {
        res.status(400).json({ message: 'File ID is required' });
        return;
      }

      // Permanently delete the file
      const success = await FileModel.permanentlyDeleteFile(fileId, userId);
      
      if (!success) {
        res.status(404).json({ message: 'File not found or permission denied' });
        return;
      }

      res.status(200).json({ message: 'File permanently deleted' });
    } catch (error: unknown) {
      res.status(500).json({ 
        message: 'Failed to permanently delete file', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    } finally {
      return;
    }
  },
  
  /**
   * Share a file with another user
   */
  async shareFile(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }
      const userId = req.user.id;
      const { fileId, userIds, expiryDate, permissions } = req.body;

      if (!fileId || !userIds || !Array.isArray(userIds)) {
        res.status(400).json({ message: 'File ID and user IDs are required' });
        return;
      }

      // Process each user ID individually since FileModel.shareFile expects a single targetUserId
      const shareResults = [];
      for (const targetUserId of userIds) {
        // Default permission level if not specified
        const permissionLevel = permissions || 'read';
        
        // Share the file with the current user
        const success = await FileModel.shareFile(fileId, userId, targetUserId, permissionLevel);
        if (success) {
          shareResults.push({ userId: targetUserId, success });
        }
      }

      res.json(shareResults);
    } catch (error: unknown) {
      res.status(500).json({ 
        message: 'Failed to share file', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    } finally {
      return;
    }
  },
  
  /**
   * Search for files
   */
  async searchFiles(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }
      const userId = req.user.id;
      const { query, type, sortBy, sortDir, page, pageSize } = req.query;

      if (!query) {
        res.status(400).json({ message: 'Search query is required' });
        return;
      }

      // Validate query parameters
      const searchSchema = z.object({
        query: z.string(),
        type: z.string().optional(),
        sortBy: z.string().optional(),
        sortDir: z.enum(['asc', 'desc']).optional(),
        page: z.number().int().min(1).optional(),
        pageSize: z.number().int().min(1).optional()
      });

      const parsedQuery = searchSchema.safeParse(req.query);
      if (!parsedQuery.success) {
        res.status(400).json({
          message: 'Invalid search parameters',
          errors: parsedQuery.error.format()
        });
        return;
      }

      // Make sure data exists before accessing query
      const searchQuery = parsedQuery.success ? parsedQuery.data.query as string : '';
      const results = await FileModel.searchFiles(searchQuery, userId);

      res.json(results);
    } catch (error: unknown) {
      res.status(500).json({ 
        message: 'Failed to search files',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      return;
    }
  },
  
  /**
   * Get file activity logs
   */
  async getFileActivityLogs(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }
      const userId = req.user.id;
      const { fileId } = req.params;

      if (!fileId) {
        res.status(400).json({ message: 'File ID is required' });
        return;
      }

      // Make sure fileId is a string, not an array
      const fileIdStr = typeof fileId === 'string' ? fileId : (Array.isArray(fileId) ? fileId[0] : String(fileId));
      const logs = await FileModel.getActivityLogs(userId, fileIdStr);
      
      res.json(logs);
    } catch (error: unknown) {
      res.status(500).json({ 
        message: 'Failed to get activity logs', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    } finally {
      return;
    }
  }
};
