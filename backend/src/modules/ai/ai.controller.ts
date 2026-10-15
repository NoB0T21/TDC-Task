import type { Request, Response } from 'express';
import { z } from 'zod';
import { scoreMatchesWithAI, generateMatchIntro } from './ai.service';
import { getMatches } from '../matching/matching.service';
import { getCustomerById } from '../customers/customers.service';
import { sendSuccess, sendError } from '../../shared/utils/response.util';
import { redis } from '../../shared/config/redis';

export async function scoreMatches(req: Request, res: Response): Promise<void> {
  const customerId = req.params.customerId as string;

  const aiCacheKey = `ai-scores:${customerId}`;
  try {
    const cached = await redis.get(aiCacheKey);
    if (cached) {
      sendSuccess(res, JSON.parse(cached), 'AI scores fetched (cached)');
      return;
    }
  } catch (err) {
    console.warn(`Redis get cache error for ${aiCacheKey}:`, err);
  }

  const customer = await getCustomerById(customerId, req.matchmaker!.matchmakerId);
  if (!customer) {
    sendError(res, 'Customer not found', 404);
    return;
  }

  let matches;
  try {
    matches = await getMatches(customerId, req.matchmaker!.matchmakerId);
  } catch (err: any) {
    if (err.message === 'Customer not found') {
      sendError(res, 'Customer not found', 404);
      return;
    }
    throw err;
  }

  if (!matches.length) {
    sendSuccess(res, [], 'No matches found');
    return;
  }

  const aiScores = await scoreMatchesWithAI(customer, matches);

  const enriched = matches
    .map((m) => {
      const aiData = aiScores.find((s) => s.candidateId === m.candidate.id);
      return {
        ...m,
        aiScore: aiData?.aiScore,
        aiLabel: aiData?.label,
        aiExplanation: aiData?.explanation,
      };
    })
    .sort((a, b) => (b.aiScore ?? 0) - (a.aiScore ?? 0));

  try {
    await redis.setex(aiCacheKey, 6 * 60 * 60, JSON.stringify(enriched));
  } catch (err) {
    console.warn(`Redis set cache error for ${aiCacheKey}:`, err);
  }

  sendSuccess(res, enriched, 'AI-scored matches fetched');
}

const introSchema = z.object({
  matchCandidateId: z.string().uuid(),
});

export async function generateIntro(req: Request, res: Response): Promise<void> {
  const customerId = req.params.customerId as string;
  const parsed = introSchema.safeParse(req.body);
  if (!parsed.success) {
    sendError(res, 'Invalid matchCandidateId', 422);
    return;
  }

  const { matchCandidateId } = parsed.data;

  const introCacheKey = `intro:${customerId}:${matchCandidateId}`;
  try {
    const cached = await redis.get(introCacheKey);
    if (cached) {
      sendSuccess(res, { intro: cached }, 'Intro fetched (cached)');
      return;
    }
  } catch (err) {
    console.warn(`Redis get cache error for ${introCacheKey}:`, err);
  }

  const [client, match] = await Promise.all([
    getCustomerById(customerId, req.matchmaker!.matchmakerId),
    getCustomerById(matchCandidateId, req.matchmaker!.matchmakerId),
  ]);

  const { supabase } = await import('../../shared/config/supabase');
  const matchCandidate =
    match ?? (await supabase.from('customers').select('*').eq('id', matchCandidateId).single()).data;

  if (!client || !matchCandidate) {
    sendError(res, 'Customer or candidate not found', 404);
    return;
  }

  const intro = await generateMatchIntro(client, matchCandidate as any);

  try {
    await redis.setex(introCacheKey, 24 * 60 * 60, intro);
  } catch (err) {
    console.warn(`Redis set cache error for ${introCacheKey}:`, err);
  }

  sendSuccess(res, { intro }, 'Intro generated');
}
