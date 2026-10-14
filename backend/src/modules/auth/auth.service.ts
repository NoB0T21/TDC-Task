import { supabase } from '../../shared/config/supabase';
import { redis } from '../../shared/config/redis';
import { verifyPassword } from '../../shared/utils/hash.util';
import { signToken } from '../../shared/utils/jwt.util';

const SESSION_TTL = 7 * 24 * 60 * 60;

export interface LoginResult {
  matchmaker: { id: string; email: string; name: string };
  token: string;
}

export async function loginService(email: string, password: string): Promise<LoginResult | null> {
  const { data: matchmaker, error } = await supabase
    .from('matchmakers')
    .select('id, email, name, password_hash, is_active')
    .eq('email', email.toLowerCase().trim())
    .single();

  if (error || !matchmaker || !matchmaker.is_active) {
    return null;
  }

  const isValid = await verifyPassword(password, matchmaker.password_hash);
  if (!isValid) {
    return null;
  }

  const token = signToken({ matchmakerId: matchmaker.id, email: matchmaker.email });

  try {
    await redis.setex(
      `session:${matchmaker.id}`,
      SESSION_TTL,
      JSON.stringify({ id: matchmaker.id, email: matchmaker.email, name: matchmaker.name })
    );
  } catch (redisErr) {
    console.warn('Redis session caching failed:', redisErr);
  }

  return {
    matchmaker: { id: matchmaker.id, email: matchmaker.email, name: matchmaker.name },
    token,
  };
}

export async function logoutService(token: string, matchmakerId: string): Promise<void> {
  try {
    await redis.setex(`blacklist:${token}`, SESSION_TTL, '1');
    await redis.del(`session:${matchmakerId}`);
  } catch (redisErr) {
    console.warn('Redis logout operation failed:', redisErr);
  }
}

export async function getMeService(matchmakerId: string) {
  try {
    const cached = await redis.get(`session:${matchmakerId}`);
    if (cached) return JSON.parse(cached);
  } catch (redisErr) {
    console.warn('Redis get session failed:', redisErr);
  }

  const { data, error } = await supabase
    .from('matchmakers')
    .select('id, email, name, created_at')
    .eq('id', matchmakerId)
    .single();

  if (error) return null;
  return data;
}
