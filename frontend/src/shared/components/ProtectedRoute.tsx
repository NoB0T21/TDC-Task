import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/modules/auth/context/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';

/**
 * Wraps protected routes. Redirects to /login if the user is not authenticated.
 * Shows a spinner while auth state is being rehydrated from localStorage.
 */
export function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner fullPage />;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}
