import { supabase } from '../../shared/config/supabase';
import type { Customer, Gender, CustomerStatus } from '../../types';

const LIST_COLUMNS = `
  id, assigned_matchmaker_id, first_name, last_name, gender, date_of_birth, city, country,
  marital_status, status_tag, profile_photo_url, religion, caste,
  income_lpa, designation, company, height_cm, want_kids, created_at, updated_at
`;

const DETAIL_COLUMNS = `*`;

export interface CustomerListParams {
  matchmakerId: string;
  page?: number;
  limit?: number;
  search?: string;
  statusTag?: string;
  gender?: string;
}

export async function getCustomersByMatchmaker(params: CustomerListParams) {
  const { matchmakerId, page = 1, limit = 20, search, statusTag, gender } = params;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('customers')
    .select(LIST_COLUMNS, { count: 'exact' })
    .eq('assigned_matchmaker_id', matchmakerId)
    .eq('is_dummy', false) // Never show dummy profiles in dashboard client list
    .order('created_at', { ascending: false })
    .range(from, to);

  if (search && search.trim()) {
    const s = search.trim();
    query = query.or(`first_name.ilike.%${s}%,last_name.ilike.%${s}%,email.ilike.%${s}%`);
  }

  if (statusTag) {
    query = query.eq('status_tag', statusTag);
  }

  if (gender) {
    query = query.eq('gender', gender);
  }

  const { data, error, count } = await query;
  if (error) {
    throw new Error(error.message);
  }

  return {
    customers: (data || []) as Customer[],
    total: count ?? 0,
    page,
    limit,
  };
}

export async function getCustomerById(customerId: string, matchmakerId: string) {
  const { data, error } = await supabase
    .from('customers')
    .select(DETAIL_COLUMNS)
    .eq('id', customerId)
    .eq('assigned_matchmaker_id', matchmakerId)
    .single();

  if (error || !data) {
    return null;
  }
  return data as Customer;
}

export async function updateCustomer(
  customerId: string,
  matchmakerId: string,
  updates: Partial<Pick<Customer, 'status_tag' | 'notes'>>
) {
  const { data, error } = await supabase
    .from('customers')
    .update(updates)
    .eq('id', customerId)
    .eq('assigned_matchmaker_id', matchmakerId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data as Customer;
}

export interface PoolQueryParams {
  gender: Gender;
  limit?: number;
}

export async function getMatchingPool(params: PoolQueryParams) {
  const oppositeGender = params.gender === 'male' ? 'female' : 'male';

  const { data, error } = await supabase
    .from('customers')
    .select(DETAIL_COLUMNS)
    .eq('gender', oppositeGender)
    .eq('is_dummy', true)
    .eq('status_tag', 'active')
    .limit(params.limit ?? 200);

  if (error) {
    throw new Error(error.message);
  }
  return (data || []) as Customer[];
}
