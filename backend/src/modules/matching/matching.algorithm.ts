import type { Customer } from '../../types';

export interface ScoredMatch {
  candidate: Customer;
  rawScore: number;
  scoreBreakdown: ScoreBreakdown;
}

export interface ScoreBreakdown {
  ageScore: number;
  heightScore: number;
  incomeScore: number;
  kidsScore: number;
  relocateScore: number;
  religionScore: number;
  languageScore: number;
  dietScore: number;
  maritalScore: number;
  hobbyScore: number;
}

function getAgeYears(dob: string): number {
  const birth = new Date(dob);
  const now = new Date();
  return Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
}

function tristateMismatchPenalty(a?: string, b?: string): number {
  if (!a || !b) return 0;
  if (a === b) return 20;
  if (a === 'maybe' || b === 'maybe') return 10;
  return 0;
}

function scoreMaleCandidate(client: Customer, candidate: Customer): ScoreBreakdown {
  const clientAge = getAgeYears(client.date_of_birth);
  const candidateAge = getAgeYears(candidate.date_of_birth);
  const ageDiff = clientAge - candidateAge;

  let ageScore = 0;
  if (ageDiff >= 1 && ageDiff <= 5) ageScore = 25;
  else if (ageDiff >= 0 && ageDiff < 1) ageScore = 18;
  else if (ageDiff > 5 && ageDiff <= 8) ageScore = 12;
  else if (ageDiff < 0 && ageDiff >= -2) ageScore = 8;
  else ageScore = 0;

  const heightDiff = (client.height_cm ?? 0) - (candidate.height_cm ?? 0);
  let heightScore = 0;
  if (heightDiff >= 5) heightScore = 15;
  else if (heightDiff >= 0) heightScore = 10;
  else if (heightDiff >= -3) heightScore = 5;

  const incomeRatio = (candidate.income_lpa ?? 0) / (client.income_lpa || 1);
  let incomeScore = 0;
  if (incomeRatio < 0.5) incomeScore = 15;
  else if (incomeRatio < 0.75) incomeScore = 12;
  else if (incomeRatio < 1.0) incomeScore = 8;
  else if (incomeRatio < 1.2) incomeScore = 5;

  const kidsScore = tristateMismatchPenalty(client.want_kids, candidate.want_kids);

  const relocateScore = tristateMismatchPenalty(client.open_to_relocate, candidate.open_to_relocate) / 2;

  const religionScore = client.religion && candidate.religion && client.religion === candidate.religion ? 10 : 0;

  const commonLangs = client.languages?.filter((l) => candidate.languages?.includes(l)) ?? [];
  const languageScore = Math.min(commonLangs.length * 2.5, 5);

  const dietScore =
    client.dietary_preference && candidate.dietary_preference && client.dietary_preference === candidate.dietary_preference
      ? 5
      : client.dietary_preference === 'veg' && candidate.dietary_preference === 'jain'
      ? 3
      : 0;

  const maritalScore =
    client.marital_status === 'single' && candidate.marital_status === 'single'
      ? 5
      : client.marital_status && client.marital_status === candidate.marital_status
      ? 3
      : 0;

  const commonHobbies = client.hobbies?.filter((h) => candidate.hobbies?.includes(h)) ?? [];
  const hobbyScore = Math.min(commonHobbies.length * 2, 5);

  return {
    ageScore,
    heightScore,
    incomeScore,
    kidsScore,
    relocateScore,
    religionScore,
    languageScore,
    dietScore,
    maritalScore,
    hobbyScore,
  };
}

function scoreFemaleCandidate(client: Customer, candidate: Customer): ScoreBreakdown {
  const clientAge = getAgeYears(client.date_of_birth);
  const candidateAge = getAgeYears(candidate.date_of_birth);
  const ageDiff = candidateAge - clientAge;

  let ageScore = 0;
  if (ageDiff >= 2 && ageDiff <= 5) ageScore = 20;
  else if (ageDiff >= 0 && ageDiff < 2) ageScore = 15;
  else if (ageDiff > 5 && ageDiff <= 8) ageScore = 12;
  else if (ageDiff < 0 && ageDiff >= -1) ageScore = 8;
  else ageScore = 0;

  const heightDiff = (candidate.height_cm ?? 0) - (client.height_cm ?? 0);
  let heightScore = 0;
  if (heightDiff >= 5) heightScore = 10;
  else if (heightDiff >= 0) heightScore = 7;
  else if (heightDiff >= -3) heightScore = 3;

  const incomeRatio = (candidate.income_lpa ?? 0) / (client.income_lpa || 1);
  let incomeScore = 0;
  if (incomeRatio >= 1.5) incomeScore = 20;
  else if (incomeRatio >= 1.0) incomeScore = 15;
  else if (incomeRatio >= 0.8) incomeScore = 10;

  const kidsScore = tristateMismatchPenalty(client.want_kids, candidate.want_kids);

  const relocateScore = tristateMismatchPenalty(client.open_to_relocate, candidate.open_to_relocate) * 0.75;

  const religionScore = client.religion && candidate.religion && client.religion === candidate.religion ? 5 : 0;

  const commonLangs = client.languages?.filter((l) => candidate.languages?.includes(l)) ?? [];
  const languageScore = Math.min(commonLangs.length * 2.5, 5);

  const dietScore =
    client.dietary_preference && candidate.dietary_preference && client.dietary_preference === candidate.dietary_preference
      ? 5
      : candidate.dietary_preference === 'veg' && client.dietary_preference === 'veg'
      ? 5
      : 0;

  const maritalScore =
    client.marital_status && client.marital_status === candidate.marital_status ? 5 : 0;

  const commonHobbies = client.hobbies?.filter((h) => candidate.hobbies?.includes(h)) ?? [];
  const hobbyScore = Math.min(commonHobbies.length * 2, 5);

  return {
    ageScore,
    heightScore,
    incomeScore,
    kidsScore,
    relocateScore,
    religionScore,
    languageScore,
    dietScore,
    maritalScore,
    hobbyScore,
  };
}

export function runMatchingAlgorithm(
  client: Customer,
  pool: Customer[],
  topN = 15
): ScoredMatch[] {
  const isMale = client.gender === 'male';

  const scored = pool.map((candidate) => {
    const breakdown = isMale
      ? scoreMaleCandidate(client, candidate)
      : scoreFemaleCandidate(client, candidate);

    const rawScore = Object.values(breakdown).reduce((a, b) => a + b, 0);
    return { candidate, rawScore, scoreBreakdown: breakdown };
  });

  return scored
    .sort((a, b) => b.rawScore - a.rawScore)
    .slice(0, topN);
}
