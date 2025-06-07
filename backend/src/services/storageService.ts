/**
 * STORAGE SERVICE MIGRATION
 * 
 * This file now re-exports the R2StorageService implementation.
 * The Pinata IPFS implementation has been deprecated and replaced with Cloudflare R2.
 * 
 * @deprecated This file is kept for backward compatibility and re-exports R2StorageService.
 */
import { R2StorageService } from './r2StorageService';

/**
 * Re-export the R2StorageService as StorageService for backward compatibility
 */
export const StorageService = {
  /**
   * Upload a file to Cloudflare R2
   * @param fileBuffer - The file buffer to upload
   * @param fileDetails - Details about the file
   * @param userId - ID of the user uploading the file
   */
  uploadFile: R2StorageService.uploadFile,
  
  /**
   * Create a folder in the database
   */
  createFolder: R2StorageService.createFolder,
  
  /**
   * Download a file from R2
   */
  getFileFromIPFS: R2StorageService.getFileFromR2, // For backward compatibility
  getFileFromR2: R2StorageService.getFileFromR2,
  
  /**
   * Check the status of a file in R2
   */
  checkPinStatus: R2StorageService.checkObjectStatus, // For backward compatibility
  checkObjectStatus: R2StorageService.checkObjectStatus,
  
  /**
   * Update a file's visibility in R2
   */
  updateFileVisibility: R2StorageService.updateFileVisibility,
  
  /**
   * Generate a pre-signed URL for a file
   */
  generatePresignedUrl: R2StorageService.generatePresignedUrl
};
