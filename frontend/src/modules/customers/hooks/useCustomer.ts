import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { apiClient } from '@/shared/api/client';
import type { Customer, ApiResponse } from '@/types';

export function useCustomer(id: string) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomer = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<ApiResponse<Customer>>(`/customers/${id}`);
      if (res.data.data) {
        setCustomer(res.data.data);
      } else {
        setError('Customer not found');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to load customer';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  const updateStatus = async (
    status_tag: Customer['status_tag'],
    notes?: string
  ): Promise<boolean> => {
    try {
      const payload: { status_tag?: Customer['status_tag']; notes?: string } = {};
      if (status_tag) payload.status_tag = status_tag;
      if (notes !== undefined) payload.notes = notes;

      const res = await apiClient.patch<ApiResponse<Customer>>(`/customers/${id}`, payload);
      if (res.data.data) {
        setCustomer(res.data.data);
        toast.success('Customer updated successfully');
        return true;
      }
      return false;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update customer';
      toast.error(msg);
      return false;
    }
  };

  return { customer, isLoading, error, refetch: fetchCustomer, updateStatus };
}
