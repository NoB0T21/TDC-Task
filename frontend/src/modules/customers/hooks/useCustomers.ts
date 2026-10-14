import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/shared/api/client';
import type { Customer, ApiResponse } from '@/types';

interface UseCustomersParams {
  page?: number;
  limit?: number;
  search?: string;
  statusTag?: string;
  gender?: string;
}

interface CustomersResult {
  customers: Customer[];
  total: number;
  page: number;
  limit: number;
}

export function useCustomers(params: UseCustomersParams = {}) {
  const [data, setData] = useState<CustomersResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.set('page', String(params.page));
      if (params.limit) queryParams.set('limit', String(params.limit));
      if (params.search && params.search.trim()) queryParams.set('search', params.search.trim());
      if (params.statusTag) queryParams.set('status_tag', params.statusTag);
      if (params.gender) queryParams.set('gender', params.gender);

      const res = await apiClient.get<ApiResponse<CustomersResult>>(`/customers?${queryParams}`);
      if (res.data.data) {
        setData(res.data.data);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to load customers';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [params.page, params.limit, params.search, params.statusTag, params.gender]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return {
    customers: data?.customers ?? [],
    total: data?.total ?? 0,
    page: data?.page ?? 1,
    limit: data?.limit ?? 20,
    isLoading,
    error,
    refetch: fetchCustomers,
  };
}
