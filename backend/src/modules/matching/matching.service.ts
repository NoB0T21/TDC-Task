import { redis } from '../../shared/config/redis';
import { getMatchingPool, getCustomerById } from '../customers/customers.service';
import { runMatchingAlgorithm, type ScoredMatch } from './matching.algorithm';
import type { Customer } from '../../types';

const MATCH_CACHE_TTL = 24 * 60 * 60;

export interface MatchResult {
  candidate: Customer;
  rawScore: number;
  aiScore?: number;
  aiLabel?: string;
  aiExplanation?: string;
  aiIntro?: string;
  scoreBreakdown: Record<string, number>;
}

export async function getMatches(
  customerId: string,
  matchmakerId: string
): Promise<MatchResult[]> {
  const cacheKey = `matches:${customerId}`;
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(`Cache hit for matches:${customerId}`);
      return JSON.parse(cached) as MatchResult[];
    }
  } catch (err) {
    console.warn(`Redis get cache error for ${cacheKey}:`, err);
  }

  const customer = await getCustomerById(customerId, matchmakerId);
  if (!customer) throw new Error('Customer not found');

  const pool = await getMatchingPool({ gender: customer.gender });

  const scored: ScoredMatch[] = runMatchingAlgorithm(customer, pool, 15);

  const results: MatchResult[] = scored.map(({ candidate, rawScore, scoreBreakdown }) => ({
    candidate,
    rawScore,
    scoreBreakdown: scoreBreakdown as unknown as Record<string, number>,
  }));

  try {
    await redis.setex(cacheKey, MATCH_CACHE_TTL, JSON.stringify(results));
  } catch (err) {
    console.warn(`Redis set cache error for ${cacheKey}:`, err);
  }

  return results;
}

export async function invalidateMatchCache(customerId: string): Promise<void> {
  try {
    await redis.del(`matches:${customerId}`);
  } catch (err) {
    console.warn(`Redis delete cache error for matches:${customerId}:`, err);
  }
}
