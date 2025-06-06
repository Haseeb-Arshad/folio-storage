import { createClient } from '@supabase/supabase-js';
import { config } from './env';

/**
 * Create a Supabase client for database operations
 * This client is authenticated with service role permissions (admin)
 */
export const supabase = createClient(
  config.SUPABASE_URL,
  config.SUPABASE_SERVICE_KEY,
  {
    auth: {
      persistSession: false,
    },
  }
);

/**
 * Create a Supabase client with limited permissions
 * This client is used for non-admin operations
 */
export const supabaseClient = createClient(
  config.SUPABASE_URL,
  config.SUPABASE_KEY
);
