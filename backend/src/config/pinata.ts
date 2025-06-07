import pinataSDK from '@pinata/sdk';
import { config } from './env';

let pinata: ReturnType<typeof pinataSDK>;

// Initialize Pinata client based on available credentials
if (config.PINATA_JWT) {
  pinata = new pinataSDK({ pinataJWTKey: config.PINATA_JWT });
} else {
  pinata = new pinataSDK({
    pinataApiKey: config.PINATA_API_KEY,
    pinataSecretApiKey: config.PINATA_SECRET_API_KEY
  });
}

/**
 * Test the Pinata connection
 */
export async function testPinataConnection(): Promise<boolean> {
  try {
    const response = await pinata.testAuthentication();
    console.log('✅ Pinata connection successful:', response);
    return true;
  } catch (error) {
    console.error('❌ Pinata connection failed:', error);
    return false;
  }
}

export { pinata };
