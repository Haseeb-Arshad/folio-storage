import express from 'express';
import { FileController } from '../controllers/fileController';
import { authMiddleware } from '../middleware/authMiddleware';
import multer from 'multer';

const router = express.Router();

// Apply authentication middleware to all file routes
router.use(authMiddleware);

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// File upload
router.post('/', upload.single('file'), FileController.uploadFile);

// Folder operations
router.post('/folders', FileController.createFolder);

// List files in folder (root or specific folder)
router.get('/folders', FileController.getFiles);
router.get('/folders/:folderId', FileController.getFiles);

// Search files
router.get('/search', FileController.searchFiles);

// File operations
router.get('/:fileId', FileController.getFile);
router.put('/:fileId', FileController.updateFile);
router.delete('/:fileId', FileController.deleteFile);
router.delete('/:fileId/permanent', FileController.permanentlyDeleteFile);
router.get('/:fileId/download', FileController.downloadFile);
router.post('/:fileId/share', FileController.shareFile);
router.get('/:fileId/activity', FileController.getFileActivityLogs);

export default router;
