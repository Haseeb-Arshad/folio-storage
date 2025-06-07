import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  CopyObjectCommand
} from '@aws-sdk/client-s3';
import type {
  PutObjectCommandInput,
  GetObjectCommandInput,
  HeadObjectCommandInput,
  DeleteObjectCommandInput,
  CopyObjectCommandInput
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { r2Client, bucketName, publicUrl } from '../config/cloudflare';
import { FileModel } from '../models/fileModel';
import { Readable } from 'node:stream';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service to handle file storage operations with Cloudflare R2
 */
export const R2StorageService = {
  /**
   * Upload a file to Cloudflare R2
   * @param fileBuffer - The file buffer to upload
   * @param fileDetails - Details about the file
   * @param userId - ID of the user uploading the file
   */
  async uploadFile(fileBuffer: Buffer, fileDetails: { 
    fileName: string;
    mimeType: string;
    size: number;
    path?: string;
    description?: string;
  }, userId: string): Promise<{ success: boolean; fileId?: string; objectKey?: string; publicUrl?: string; error?: string; }> {
    try {
      // Generate a unique object key for R2 storage
      const objectKey = `${userId}/${uuidv4()}-${fileDetails.fileName}`;
      
      // Prepare the upload command
      const uploadParams: PutObjectCommandInput = {
        Bucket: bucketName,
        Key: objectKey,
        Body: fileBuffer,
        ContentType: fileDetails.mimeType,
        Metadata: {
          userId,
          fileName: fileDetails.fileName,
          mimeType: fileDetails.mimeType,
          size: fileDetails.size.toString(),
          uploadedAt: new Date().toISOString()
        }
      };

      // Upload the file to Cloudflare R2
      const command = new PutObjectCommand(uploadParams);
      const result = await r2Client.send(command);
      
      if (!result) {
        return { 
          success: false,
          error: 'Failed to upload file to Cloudflare R2'
        };
      }
      
      // Construct the public URL if available
      const filePublicUrl = publicUrl ? 
        `${publicUrl}/${objectKey}` : 
        '';  // Use empty string instead of undefined
      
      // Create a file record in the database
      const file = await FileModel.createFile({
        name: fileDetails.fileName,
        description: fileDetails.description || '',
        size: fileDetails.size,
        mime_type: fileDetails.mimeType,
        ipfs_hash: objectKey, // Store the R2 object key in the ipfs_hash field for compatibility
        ipfs_pin_status: 'pinned', // Use 'pinned' for compatibility
        path: fileDetails.path || '/', 
        is_folder: false,
        parent_id: null, // Can be updated later based on user's folder selection
        owner_id: userId,
        is_starred: false,
        is_shared: false,
        is_public: false,
      });
      
      if (!file) {
        // If database creation fails, try to delete the object from R2
        try {
          const deleteParams: DeleteObjectCommandInput = {
            Bucket: bucketName,
            Key: objectKey
          };
          await r2Client.send(new DeleteObjectCommand(deleteParams));
        } catch (deleteError) {
          console.error('Failed to delete file after database failure:', deleteError);
        }
        
        return { 
          success: false,
          error: 'Failed to create file record in database'
        };
      }
      
      return {
        success: true,
        fileId: file.id,
        objectKey,
        publicUrl: filePublicUrl
      };
    } catch (error: any) {
      console.error('Error uploading file to Cloudflare R2:', error);
      return {
        success: false,
        error: error.message || 'Unknown error during file upload'
      };
    }
  },
  
  /**
   * Create a folder in the database
   * Note: R2 doesn't have a folder concept like file systems, but we 
   * maintain the same interface for compatibility
   */
  async createFolder(folderDetails: {
    name: string;
    path: string;
    parentId?: string;
    description?: string;
  }, userId: string): Promise<{ success: boolean; folderId?: string; error?: string }> {
    try {
      const folder = await FileModel.createFile({
        name: folderDetails.name,
        description: folderDetails.description || '',
        size: 0, // Folders don't have size
        mime_type: 'folder',
        ipfs_hash: '', // No storage hash for folders
        ipfs_pin_status: 'pinned', // Default status for compatibility
        path: folderDetails.path,
        is_folder: true,
        parent_id: folderDetails.parentId || null,
        owner_id: userId,
        is_starred: false,
        is_shared: false,
        is_public: false,
      });
      
      if (!folder) {
        return {
          success: false,
          error: 'Failed to create folder'
        };
      }
      
      return {
        success: true,
        folderId: folder.id
      };
    } catch (error: any) {
      console.error('Error creating folder:', error);
      return {
        success: false,
        error: error.message || 'Unknown error creating folder'
      };
    }
  },
  
  /**
   * Download a file from Cloudflare R2
   */
  async getFileFromR2(objectKey: string): Promise<Buffer | null> {
    try {
      const params: GetObjectCommandInput = {
        Bucket: bucketName,
        Key: objectKey
      };
      
      const command = new GetObjectCommand(params);
      const response = await r2Client.send(command);
      
      if (!response || !response.Body) {
        console.error('Failed to retrieve file from R2');
        return null;
      }
      
      // Convert the response body to a buffer
      const streamBody = response.Body as Readable;
      const chunks: Buffer[] = [];
      
      for await (const chunk of streamBody) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      
      return Buffer.concat(chunks);
    } catch (error) {
      console.error('Error fetching file from R2:', error);
      return null;
    }
  },
  
  /**
   * Check if an object exists in R2
   */
  async checkObjectStatus(objectKey: string): Promise<string> {
    try {
      const params: HeadObjectCommandInput = {
        Bucket: bucketName,
        Key: objectKey
      };
      
      const command = new HeadObjectCommand(params);
      await r2Client.send(command);
      
      // If the request succeeds, the object exists
      return 'pinned'; // Use 'pinned' for compatibility
    } catch (error: any) {
      if (error.$metadata?.httpStatusCode === 404) {
        return 'not_found';
      }
      console.error('Error checking object status:', error);
      return 'error';
    }
  },
  
  /**
   * Generate a pre-signed URL for a file (useful for private access)
   */
  async generatePresignedUrl(objectKey: string, expiresInSeconds = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: objectKey,
      });
      
      const url = await getSignedUrl(r2Client, command, { expiresIn: expiresInSeconds });
      return url;
    } catch (error) {
      console.error('Error generating presigned URL:', error);
      return ''; // Return empty string instead of null
    }
  },
  
  /**
   * Update file metadata for public/private status
   * Note: R2 doesn't have the same concept as Pinata metadata, but we can
   * use object ACLs or copy with new metadata
   */
  async updateFileVisibility(objectKey: string, isPublic: boolean): Promise<boolean> {
    try {
      if (!objectKey) return false;
      
      const params: HeadObjectCommandInput = {
        Bucket: bucketName,
        Key: objectKey
      };
      
      const headCommand = new HeadObjectCommand(params);
      const objectData = await r2Client.send(headCommand);
      
      // Get current metadata
      const currentMetadata = objectData.Metadata || {};
      
      // Update metadata with new visibility
      const updatedMetadata = {
        ...currentMetadata,
        isPublic: String(isPublic)
      };
      
      // Create new object with updated metadata
      const putParams: PutObjectCommandInput = {
        Bucket: bucketName,
        Key: objectKey,
        Metadata: updatedMetadata,
        ContentType: objectData.ContentType
      };
      
      // First, get the existing object content
      const getParams: GetObjectCommandInput = {
        Bucket: bucketName,
        Key: objectKey
      };
      
      const getCommand = new GetObjectCommand(getParams);
      const existingObject = await r2Client.send(getCommand);
      
      // Use the existing content for the updated object
      if (existingObject.Body) {
        putParams.Body = existingObject.Body;
      }
      
      const putCommand = new PutObjectCommand(putParams);
      await r2Client.send(putCommand);
      
      return true;
    } catch (error) {
      console.error('Error updating file visibility:', error);
      return false;
    }
  }
};
