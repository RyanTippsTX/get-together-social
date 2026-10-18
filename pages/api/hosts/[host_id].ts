import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../../lib/database.types';
import { createDeleteHostHandler } from '../../../lib/server/deleteHost';

if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.SUPABASE_SERVICE_KEY ||
  !process.env.NEXT_PUBLIC_SUPABASE_API_KEY
) {
  throw Error('Missing Supabase environment variable(s)');
}
const serverClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

// The legacy auth SDK mutates its Authorization header in getUser(token).
// Keep user-token verification isolated from the privileged admin client.
const authClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_API_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
);
export default createDeleteHostHandler(serverClient, (token) => authClient.auth.getUser(token));
