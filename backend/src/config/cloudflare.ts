import { S3Client } from '@aws-sdk/client-s3';
import { config } from './env';

// Configure the Cloudflare R2 client (S3-compatible API)
const R2_ENDPOINT = `https://${config.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

// Create the S3 client with Cloudflare R2 configuration
export const r2Client = new S3Client({
  region: 'auto', // Cloudflare R2 uses 'auto' region
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: config.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: config.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

// Bucket name for storing files
export const bucketName = config.CLOUDFLARE_R2_BUCKET_NAME;

// Public URL for accessing files (if configured)
export const publicUrl = config.CLOUDFLARE_R2_PUBLIC_URL;

/**
 * Test the Cloudflare R2 connection
 */
export async function testCloudflareR2Connection(): Promise<boolean> {
  try {
    // List buckets to verify connection
    const command = {
      Bucket: bucketName
    };
    
    // Test the connection by making a simple request
    await r2Client.send({ ...command, MaxKeys: 1 });
    console.log('✅ Cloudflare R2 connection successful');
    return true;
  } catch (error) {
    console.error('❌ Cloudflare R2 connection failed:', error);
    return false;
  }
}
