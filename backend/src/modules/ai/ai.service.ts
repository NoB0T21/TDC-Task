import { GoogleGenerativeAI, type GenerativeModel } from '@google/generative-ai';
import type { Customer } from '../../types';
import type { MatchResult } from '../matching/matching.service';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

function getModel(): GenerativeModel {
  const modelName = process.env.GEMINI_MODEL || 'gemini-flash-latest';
  return genAI.getGenerativeModel({ model: modelName });
}

export interface AiMatchScore {
  candidateId: string;
  aiScore: number;
  label: string;
  explanation: string;
}

export async function scoreMatchesWithAI(
  client: Customer,
  matches: MatchResult[]
): Promise<AiMatchScore[]> {
  const candidatesToScore = matches.slice(0, 10);
  if (candidatesToScore.length === 0) {
    return [];
  }

  const model = getModel();

  const clientSummary = buildProfileSummary(client, 'client');
  const candidateSummaries = candidatesToScore
    .map((m, i) => `[${i + 1}] ${buildProfileSummary(m.candidate, 'candidate')} | Algorithm raw score: ${m.rawScore}`)
    .join('\n');

  const prompt = `
You are an expert Indian matchmaking consultant. Your job is to evaluate compatibility between a client and potential matches.

CLIENT PROFILE:
${clientSummary}

POTENTIAL MATCHES (Algorithm pre-filtered):
${candidateSummaries}

For each match, provide:
1. An AI compatibility score from 0-100
2. A label: "High Potential Match" (80+), "Good Match" (60-79), or "Possible Match" (40-59)
3. A 2-sentence explanation referencing specific compatible and potentially mismatched factors

Respond in this exact JSON format (no markdown, no code blocks, just JSON):
{
  "scores": [
    {
      "index": 1,
      "aiScore": 85,
      "label": "High Potential Match",
      "explanation": "Both share the same religion and language, and their career trajectories complement each other well. The age gap of 3 years aligns with traditional preferences, though differing views on kids may need discussion."
    }
  ]
}

Be culturally nuanced. Consider: age compatibility, income alignment, relocation willingness, children preferences, religion, career stage, and lifestyle alignment.
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    let jsonStr = text;
    const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    const parsed = JSON.parse(jsonStr) as {
      scores: Array<{ index: number; aiScore: number; label: string; explanation: string }>;
    };

    return parsed.scores
      .filter((s) => s.index >= 1 && s.index <= candidatesToScore.length)
      .map((s) => ({
        candidateId: candidatesToScore[s.index - 1].candidate.id,
        aiScore: Math.min(100, Math.max(0, s.aiScore)),
        label: s.label || getLabel(s.aiScore),
        explanation: s.explanation,
      }));
  } catch (err) {
    console.error('AI scoring failed, using fallback:', err);
    const maxRaw = Math.max(...candidatesToScore.map((m) => m.rawScore), 1);
    return candidatesToScore.map((m) => {
      const normalized = Math.round((m.rawScore / maxRaw) * 100);
      return {
        candidateId: m.candidate.id,
        aiScore: normalized,
        label: getLabel(normalized),
        explanation: 'Score based on compatibility algorithm (AI temporarily unavailable).',
      };
    });
  }
}

export async function generateMatchIntro(
  client: Customer,
  match: Customer
): Promise<string> {
  const model = getModel();

  const prompt = `
You are a professional Indian matchmaking consultant writing a warm, personalized introduction paragraph for an email to the client about a potential match.

CLIENT: ${client.first_name} ${client.last_name}, ${buildProfileSummary(client, 'client')}
POTENTIAL MATCH: ${match.first_name} ${match.last_name}, ${buildProfileSummary(match, 'candidate')}

Write a 3-4 sentence introduction paragraph that:
- Highlights 2-3 specific compatible traits
- Uses warm, professional language appropriate for matrimonial matchmaking
- Does NOT mention anything sensitive (caste, income directly)
- Sounds like a trusted friend vouching for the match
- Is addressed to ${client.first_name}

Respond with ONLY the paragraph text, nothing else.
`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (err) {
    console.error('AI intro generation failed, using fallback:', err);
    return `We'd like to introduce you to ${match.first_name} ${match.last_name}, a ${match.designation || 'professional'} based in ${match.city}. Based on shared values and compatible life goals, we believe this could be a meaningful connection worth exploring.`;
  }
}

function buildProfileSummary(person: Customer, _role: string): string {
  const age = getAge(person.date_of_birth);
  return [
    `${age}yr ${person.gender}`,
    person.city,
    person.religion,
    person.designation,
    person.company,
    person.income_lpa !== undefined ? `income: ₹${person.income_lpa}L` : '',
    person.height_cm ? `height: ${person.height_cm}cm` : '',
    person.want_kids ? `kids: ${person.want_kids}` : '',
    person.open_to_relocate ? `relocate: ${person.open_to_relocate}` : '',
    person.dietary_preference ? `diet: ${person.dietary_preference}` : '',
    person.marital_status ? `marital: ${person.marital_status}` : '',
  ]
    .filter(Boolean)
    .join(', ');
}

function getAge(dob: string): number {
  return Math.floor((Date.now() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25));
}

function getLabel(score: number): string {
  if (score >= 80) return 'High Potential Match';
  if (score >= 60) return 'Good Match';
  return 'Possible Match';
}
