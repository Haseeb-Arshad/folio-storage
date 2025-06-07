import { config as dotenvConfig } from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file
dotenvConfig();

// Define the schema for environment variables
const envSchema = z.object({
  // Server configuration
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Supabase configuration
  SUPABASE_URL: z.string().url(),
  SUPABASE_KEY: z.string().min(1),
  SUPABASE_SERVICE_KEY: z.string().min(1),
  
  // Storage configuration
  // Pinata IPFS storage configuration (legacy)
  PINATA_API_KEY: z.string().optional(),
  PINATA_SECRET_API_KEY: z.string().optional(),
  PINATA_JWT: z.string().optional(),
  
  // Cloudflare R2 storage configuration
  CLOUDFLARE_R2_ACCOUNT_ID: z.string().min(1),
  CLOUDFLARE_R2_ACCESS_KEY_ID: z.string().min(1),
  CLOUDFLARE_R2_SECRET_ACCESS_KEY: z.string().min(1),
  CLOUDFLARE_R2_BUCKET_NAME: z.string().min(1),
  CLOUDFLARE_R2_PUBLIC_URL: z.string().url().optional(),
  
  // JWT authentication
  JWT_SECRET: z.string().min(32).default('your_jwt_secret_here_min_32_chars_recommended'),
  JWT_EXPIRATION: z.string().default('24h'),
  
  // File upload limits
  MAX_FILE_SIZE: z.string().transform(val => parseInt(val, 10)).default('100000000'), // 100MB default
});

// Parse environment variables and validate them against schema
const _env = envSchema.safeParse(process.env);

// If validation fails, log the errors and exit
if (!_env.success) {
  console.error('❌ Invalid environment variables:', JSON.stringify(_env.error.format(), null, 2));
  process.exit(1);
}

// Export validated and typed environment variables
export const config = _env.data;
