import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/modules/auth/context/AuthContext';
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';
import { LoginPage } from '@/modules/auth/pages/LoginPage';
import { DashboardPage } from '@/modules/dashboard/pages/DashboardPage';
import { CustomerDetailPage } from '@/modules/customers/pages/CustomerDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--color-brand-surface, #12122a)',
              color: '#f8fafc',
              border: '1px solid var(--color-brand-border, rgba(255, 255, 255, 0.1))',
              borderRadius: '8px',
            },
          }}
        />
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/customers/:id" element={<CustomerDetailPage />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
