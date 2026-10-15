import { apiClient } from '@/shared/api/client';

export async function logMatchAction(
  customerId: string,
  matchedWithId: string,
  aiScore?: number,
  aiExplanation?: string,
  aiIntro?: string
) {
  try {
    await apiClient.post(`/matching/${customerId}/log`, {
      matched_with_id: matchedWithId,
      ai_score: aiScore,
      ai_explanation: aiExplanation,
      ai_intro: aiIntro,
    });
  } catch (err) {
    // Logging is non-critical, don't throw
    console.warn('Failed to log match action:', err);
  }
}
