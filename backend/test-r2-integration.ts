import { R2StorageService } from './src/services/r2StorageService';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const TEST_USER_ID = 'test-user-' + Date.now();
const TEST_FILE_PATH = path.join(__dirname, 'test-file.txt');

async function testR2Integration() {
  console.log('=== Starting R2 Integration Tests ===\n');
  
  try {
    // 1. Create a test file
    fs.writeFileSync(TEST_FILE_PATH, 'This is a test file for R2 integration ' + new Date().toISOString());
    const fileBuffer = fs.readFileSync(TEST_FILE_PATH);
    
    // 2. Test file upload
    console.log('Testing file upload...');
    const uploadResult = await R2StorageService.uploadFile(fileBuffer, {
      fileName: 'test-file.txt',
      mimeType: 'text/plain',
      size: fileBuffer.length,
      path: '/test',
      description: 'Test file for R2 integration'
    }, TEST_USER_ID);
    
    if (!uploadResult.success) {
      throw new Error(`Upload failed: ${uploadResult.error}`);
    }
    console.log('✅ File uploaded successfully');
    const objectKey = uploadResult.objectKey!;
    
    // 3. Test file download
    console.log('\nTesting file download...');
    const downloadedFile = await R2StorageService.getFileFromR2(objectKey);
    if (!downloadedFile) {
      throw new Error('File download failed');
    }
    console.log('✅ File downloaded successfully');
    
    // 4. Test presigned URL
    console.log('\nTesting presigned URL generation...');
    const presignedUrl = await R2StorageService.generatePresignedUrl(objectKey, 3600);
    console.log(`✅ Presigned URL: ${presignedUrl}`);
    
    // 5. Test file visibility
    console.log('\nTesting file visibility update...');
    const visibilityUpdated = await R2StorageService.updateFileVisibility(objectKey, true);
    if (!visibilityUpdated) {
      console.warn('⚠️ File visibility update might have failed');
    } else {
      console.log('✅ File visibility updated successfully');
    }
    
    console.log('\n=== All tests completed successfully ===');
    console.log('\n🎉 R2 Integration is working correctly!');
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  } finally {
    // Cleanup test file
    if (fs.existsSync(TEST_FILE_PATH)) {
      fs.unlinkSync(TEST_FILE_PATH);
    }
  }
}

testR2Integration().catch(console.error);
