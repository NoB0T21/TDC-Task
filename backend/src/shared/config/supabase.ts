import { createClient } from '@supabase/supabase-js';
import https from 'https';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from backend folder or current working directory
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

/**
 * HTTP/HTTPS Connection Pooling Agent.
 * Maintains a persistent pool of keep-alive sockets to reuse connections,
 * eliminating TCP and TLS handshake overhead on every Supabase query.
 */
const httpsPoolAgent = new https.Agent({
  keepAlive: true,
  maxSockets: 50,
  maxFreeSockets: 10,
  timeout: 30000,
});

/**
 * Noop realtime transport to strictly disable real-time WebSocket connections.
 * Ensures the backend exclusively uses pooled HTTP requests.
 */
class NoopRealtimeTransport {
  constructor() {}
  close() {}
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  // Realtime disabled completely - no WebSocket connection opened
  realtime: {
    transport: NoopRealtimeTransport as any,
  },
  global: {
    fetch: (url, options = {}) => {
      return fetch(url, {
        ...options,
        // @ts-ignore
        agent: httpsPoolAgent,
      });
    },
  },
});
