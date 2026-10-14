import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/modules/auth/context/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';

export function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner fullPage />;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}
