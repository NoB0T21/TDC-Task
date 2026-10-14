import { createClient } from '@supabase/supabase-js';
import https from 'https';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    'Missing Supabase credentials: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be defined in .env'
  );
}

const httpsPoolAgent = new https.Agent({
  keepAlive: true,
  maxSockets: 50,
  maxFreeSockets: 10,
  timeout: 30000,
});

class NoopRealtimeTransport {
  constructor() {}
  close() {}
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  realtime: {
    transport: NoopRealtimeTransport as any,
  },
  global: {
    fetch: (url, options = {}) => {
      return (fetch as any)(url, {
        ...options,
        agent: httpsPoolAgent,
      });
    },
  },
});
