import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_API_KEY) {
  throw Error('Missing Supabase environment variable(s)');
}

console.log('new Supabase client created');

// Create a single supabase client for interacting with your database
export default createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_API_KEY
);
