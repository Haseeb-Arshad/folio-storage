// Test R2 Storage Service directly
import { R2StorageService } from './src/services/r2StorageService.fixed.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function testR2() {
  try {
    console.log('Testing R2 Storage Service...');
    
    // Create a test file
    const testContent = `Test file content - ${new Date().toISOString()}`;
    const testFilePath = path.join(__dirname, 'test-file.txt');
    fs.writeFileSync(testFilePath, testContent);
    const fileBuffer = fs.readFileSync(testFilePath);
    
    // Test upload
    console.log('Testing file upload...');
    const uploadResult = await R2StorageService.uploadFile(fileBuffer, {
      fileName: 'test-file.txt',
      mimeType: 'text/plain',
      size: fileBuffer.length,
      path: '/test',
      description: 'Test file for R2 integration'
    }, 'test-user-123');
    
    console.log('Upload result:', uploadResult);
    
    if (!uploadResult.success) {
      throw new Error(`Upload failed: ${uploadResult.error}`);
    }
    
    const objectKey = uploadResult.objectKey;
    console.log('File uploaded successfully. Object key:', objectKey);
    
    // Cleanup
    fs.unlinkSync(testFilePath);
    
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

testR2();
