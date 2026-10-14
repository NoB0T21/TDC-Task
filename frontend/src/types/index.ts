export interface Matchmaker {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  token: string;
}

export type CustomerStatus = 'new' | 'active' | 'matched' | 'paused' | 'closed';
export type Gender = 'male' | 'female' | 'other';
export type Tristate = 'yes' | 'no' | 'maybe';
export type MaritalStatus = 'single' | 'divorced' | 'widowed';
export type DietaryPreference = 'veg' | 'non-veg' | 'jain' | 'vegan' | 'eggetarian';
export type HabitLevel = 'never' | 'occasionally' | 'socially' | 'regularly';

export interface Customer {
  id: string;
  assigned_matchmaker_id: string;
  first_name: string;
  last_name: string;
  gender: Gender;
  date_of_birth: string;
  country: string;
  city: string;
  height_cm: number;
  email: string;
  phone?: string;
  college?: string;
  degree?: string;
  income_lpa?: number;
  company?: string;
  designation?: string;
  marital_status: MaritalStatus;
  languages: string[];
  siblings: number;
  caste?: string;
  religion?: string;
  want_kids: Tristate;
  open_to_relocate: Tristate;
  open_to_pets: Tristate;
  dietary_preference?: DietaryPreference;
  drinking?: HabitLevel;
  smoking?: HabitLevel;
  hobbies?: string[];
  profile_photo_url?: string;
  status_tag: CustomerStatus;
  notes?: string;
  is_dummy: boolean;
  created_at: string;
  updated_at: string;
}

export interface MatchResult {
  candidate: Customer;
  rawScore: number;
  aiScore?: number;
  aiLabel?: string;
  aiExplanation?: string;
  scoreBreakdown: Record<string, number>;
}

export interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
