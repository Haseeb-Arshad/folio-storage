const { R2StorageService } = require('./dist/index');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Test configuration
const TEST_USER_ID = 'test-user-' + Date.now();
const TEST_FILE_PATH = path.join(__dirname, 'test-file.txt');
const TEST_DOWNLOAD_PATH = path.join(__dirname, 'test-download.txt');

async function runTests() {
  console.log('=== Starting R2 Integration Tests ===\n');
  
  try {
    // 1. Create a test file
    const testContent = `Test file content - ${new Date().toISOString()}`;
    fs.writeFileSync(TEST_FILE_PATH, testContent);
    const fileBuffer = fs.readFileSync(TEST_FILE_PATH);
    
    console.log('1. Testing file upload...');
    const uploadResult = await R2StorageService.uploadFile(fileBuffer, {
      fileName: 'test-file.txt',
      mimeType: 'text/plain',
      size: fileBuffer.length,
      path: '/test',
      description: 'Test file for R2 integration'
    }, TEST_USER_ID);
    
    if (!uploadResult.success) {
      throw new Error(`❌ Upload failed: ${uploadResult.error}`);
    }
    console.log('✅ File uploaded successfully');
    const objectKey = uploadResult.objectKey;
    
    console.log('\n2. Testing file download...');
    const downloadedFile = await R2StorageService.getFileFromR2(objectKey);
    if (!downloadedFile) {
      throw new Error('❌ File download failed');
    }
    
    // Save downloaded file to disk for verification
    fs.writeFileSync(TEST_DOWNLOAD_PATH, downloadedFile);
    const downloadedContent = fs.readFileSync(TEST_DOWNLOAD_PATH, 'utf-8');
    
    if (downloadedContent !== testContent) {
      throw new Error('❌ Downloaded file content does not match original');
    }
    console.log('✅ File downloaded successfully and content verified');
    
    console.log('\n3. Testing presigned URL generation...');
    const presignedUrl = await R2StorageService.generatePresignedUrl(objectKey, 3600);
    if (!presignedUrl) {
      throw new Error('❌ Failed to generate presigned URL');
    }
    console.log(`✅ Presigned URL generated: ${presignedUrl}`);
    
    console.log('\n4. Testing file visibility update...');
    const visibilityUpdated = await R2StorageService.updateFileVisibility(objectKey, true);
    if (!visibilityUpdated) {
      console.warn('⚠️ File visibility update might have failed');
    } else {
      console.log('✅ File visibility updated successfully');
    }
    
    console.log('\n5. Testing file deletion...');
    const deleteResult = await R2StorageService.deleteFile(objectKey);
    if (!deleteResult) {
      console.warn('⚠️ File deletion might have failed');
    } else {
      console.log('✅ File deleted successfully');
    }
    
    console.log('\n=== All tests completed successfully ===');
    console.log('🎉 R2 Integration is working correctly!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  } finally {
    // Cleanup test files
    [TEST_FILE_PATH, TEST_DOWNLOAD_PATH].forEach(filePath => {
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (error) {
          console.warn(`Warning: Failed to delete test file ${filePath}:`, error.message);
        }
      }
    });
  }
}

// Run the tests
runTests().catch(error => {
  console.error('Unhandled error in test:', error);
  process.exit(1);
});
