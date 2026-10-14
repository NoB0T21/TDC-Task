import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { apiClient } from '@/shared/api/client';
import { useAuth } from '../context/AuthContext';
import type { AuthUser, ApiResponse } from '@/types';

interface LoginData {
  matchmaker: Omit<AuthUser, 'token'>;
  token: string;
}

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await apiClient.post<ApiResponse<LoginData>>('/auth/login', {
        email,
        password,
      });

      if (!res.data.data) {
        throw new Error(res.data.message || 'Login failed');
      }

      const { matchmaker, token } = res.data.data;
      login({ ...matchmaker, token });
      toast.success(`Welcome back, ${matchmaker.name}!`);
      navigate('/dashboard');
    } catch (err: any) {
      const msg =
        err.response?.data?.message || err.message || 'Login failed. Please check your credentials.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, isLoading };
}
