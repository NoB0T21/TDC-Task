import type { Request, Response } from 'express';
import { getMatches } from './matching.service';
import { sendSuccess, sendError } from '../../shared/utils/response.util';

export async function getCustomerMatches(req: Request, res: Response): Promise<void> {
  const customerId = req.params.customerId as string;
  try {
    const matches = await getMatches(customerId, req.matchmaker!.matchmakerId);
    sendSuccess(res, matches, 'Matches fetched');
  } catch (err: any) {
    if (err.message === 'Customer not found') {
      sendError(res, 'Customer not found', 404);
    } else {
      sendError(res, 'Failed to compute matches', 500);
    }
  }
}

export async function logMatchAction(req: Request, res: Response): Promise<void> {
  const customerId = req.params.customerId as string;
  const { matched_with_id, ai_score, ai_explanation, ai_intro } = req.body;

  try {
    const { supabase } = await import('../../shared/config/supabase');
    const { error } = await supabase.from('match_logs').insert({
      customer_id: customerId,
      matched_with_id,
      matchmaker_id: req.matchmaker!.matchmakerId,
      ai_score,
      ai_explanation,
      ai_intro,
      action: 'sent',
    });

    if (error) {
      console.warn('Failed to insert match log:', error.message);
    }
    sendSuccess(res, null, 'Match logged');
  } catch (err: any) {
    sendError(res, err.message || 'Failed to log match', 500);
  }
}
