import { useState, useCallback } from 'react';
import { apiClient } from '@/shared/api/client';
import type { Customer } from '@/types';

export interface MatchResult {
  candidate: Customer;
  rawScore: number;
  aiScore?: number;
  aiLabel?: string;
  aiExplanation?: string;
  aiIntro?: string;
  scoreBreakdown: Record<string, number>;
}

export function useAiMatches(customerId: string) {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasComputed, setHasComputed] = useState(false);

  const fetchMatches = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // First try fetching AI matches
      const res = await apiClient.get<{ success: boolean; data: MatchResult[] }>(
        `/ai/${customerId}/ai-matches`
      );
      setMatches(res.data.data || []);
      setHasComputed(true);
    } catch (err: any) {
      console.warn('AI matches request failed, trying raw matches:', err);
      // Fallback: try raw matching endpoint if AI endpoint fails
      try {
        const fallbackRes = await apiClient.get<{ success: boolean; data: MatchResult[] }>(
          `/matching/${customerId}/matches`
        );
        setMatches(fallbackRes.data.data || []);
        setHasComputed(true);
      } catch (fallbackErr: any) {
        setError(
          fallbackErr?.response?.data?.message ||
            err?.response?.data?.message ||
            'Failed to compute matches'
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [customerId]);

  return { matches, isLoading, error, hasComputed, fetchMatches };
}

export function useMatchIntro(customerId: string) {
  const [intro, setIntro] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateIntro = useCallback(async (matchCandidateId: string) => {
    setIsLoading(true);
    try {
      const res = await apiClient.post<{ success: boolean; data: { intro: string } }>(
        `/ai/${customerId}/intro`,
        { matchCandidateId }
      );
      setIntro(res.data.data.intro);
    } catch (err) {
      console.error('Failed to generate intro:', err);
      setIntro(null);
    } finally {
      setIsLoading(false);
    }
  }, [customerId]);

  return { intro, isLoading, generateIntro };
}
