import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '@/modules/auth/context/AuthContext';
import { apiClient } from '@/shared/api/client';
import { Button } from './Button';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
    }
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'MM';

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-brand-surface/80 backdrop-blur-xl border-b border-brand-border px-4 sm:px-8 flex items-center justify-between">
      <Link to="/dashboard" className="flex items-center gap-2.5 group">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-pink via-brand-purple to-brand-violet flex items-center justify-center shadow-md shadow-brand-pink/20 group-hover:scale-105 transition-transform">
          <Sparkles size={18} className="text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-brand-pink via-brand-purple to-brand-violet bg-clip-text text-transparent">
            TDC Matchmaker
          </span>
          <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
            Internal Staff Portal
          </span>
        </div>
      </Link>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5 pl-3 py-1 pr-1.5 rounded-lg bg-white/[0.04] border border-brand-border">
          <div className="flex flex-col text-right">
            <span className="text-xs font-semibold text-slate-100 leading-tight">
              {user?.name}
            </span>
            <span className="text-[10px] text-slate-400 leading-tight">
              {user?.email}
            </span>
          </div>
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-brand-pink to-brand-purple flex items-center justify-center text-xs font-bold text-white shadow-sm">
            {initials}
          </div>
        </div>

        <Button
          id="logout-btn"
          variant="secondary"
          size="sm"
          onClick={handleLogout}
          icon={<LogOut size={14} />}
          className="text-slate-300 hover:text-white"
        >
          Sign Out
        </Button>
      </div>
    </header>
  );
}
