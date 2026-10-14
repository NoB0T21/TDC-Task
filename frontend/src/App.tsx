import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from '@/modules/auth/context/AuthContext';
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';
import { LoginPage } from '@/modules/auth/pages/LoginPage';
import { Button } from '@/shared/components';

function DashboardPlaceholder() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-brand-dark text-slate-100 flex flex-col">
      <header className="h-16 border-b border-brand-border px-6 flex items-center justify-between bg-brand-surface/70 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <span className="text-xl">💕</span>
          <span className="font-bold text-lg bg-gradient-to-r from-brand-pink via-brand-purple to-brand-violet bg-clip-text text-transparent">
            TDC Matchmaker
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-300 font-medium">{user?.name}</span>
          <Button variant="outline" size="sm" onClick={logout}>
            Sign Out
          </Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-brand-pink/10 border border-brand-pink/20 text-brand-pink mb-6 flex items-center justify-center text-3xl shadow-lg shadow-brand-pink/10">
          ✨
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-3">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-slate-400 text-base leading-relaxed mb-6">
          Task 01 through Task 05 are completed with Supabase connection pooling, Redis sessions, JWT auth, customer management APIs, and Tailwind CSS.
        </p>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#12122a',
              color: '#f8fafc',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
            },
          }}
        />
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPlaceholder />} />
          </Route>

          {/* Fallbacks */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
