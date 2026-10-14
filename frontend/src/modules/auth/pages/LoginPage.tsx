import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Sparkles, UserCheck } from 'lucide-react';
import { useLogin } from '../hooks/useLogin';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Card } from '@/shared/components';

export function LoginPage() {
  const { user } = useAuth();
  const { handleLogin, isLoading } = useLogin();
  const [email, setEmail] = useState('demo@thedatecrew.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  const setCredentials = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark relative overflow-hidden p-4">
      <Card
        className="relative z-10 w-full max-w-md bg-brand-surface/85 backdrop-blur-2xl border border-brand-border rounded-3xl p-8 sm:p-10 shadow-2xl"
        glow
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-brand-pink via-brand-purple to-brand-violet flex items-center justify-center shadow-lg shadow-brand-pink/30">
            <Sparkles size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-brand-pink via-brand-purple to-brand-violet bg-clip-text text-transparent">
            TDC Matchmaker
          </h1>
          <p className="text-slate-400 text-sm mt-1.5 font-medium">
            Internal Matchmaking Intelligence Platform
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <Input
            id="email"
            type="email"
            label="Matchmaker Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@thedatecrew.com"
            required
            autoComplete="email"
            leftIcon={<Mail size={16} />}
          />

          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
            leftIcon={<Lock size={16} />}
            rightIcon={
              <button
                type="button"
                className="text-slate-400 hover:text-white transition-colors cursor-pointer p-0.5 flex items-center justify-center"
                onClick={() => setShowPassword((p) => !p)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />

          <Button
            id="login-submit"
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full mt-2"
          >
            Sign In to Dashboard
          </Button>
        </form>

        {/* Demo Credentials Section (Male & Female Matchmakers) */}
        <div className="mt-8 pt-6 border-t border-brand-border/60">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck size={14} className="text-brand-pink" />
              Quick Demo Access
            </span>
            <span className="text-[11px] text-slate-400">Password: <code className="text-pink-400">password123</code></span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Female Matchmaker: Priya Sharma */}
            <button
              type="button"
              onClick={() => setCredentials('demo@thedatecrew.com')}
              className={`p-2.5 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
                email === 'demo@thedatecrew.com'
                  ? 'bg-pink-500/15 border-pink-500/50 text-white shadow-sm'
                  : 'bg-white/[0.02] border-brand-border hover:bg-white/[0.05] text-slate-300'
              }`}
            >
              <div className="text-xs font-semibold text-slate-100 flex items-center justify-between">
                <span>Priya Sharma</span>
                <span className="text-[10px] text-pink-400 font-medium">Female</span>
              </div>
              <div className="text-[11px] text-slate-400 truncate mt-0.5">
                demo@thedatecrew.com
              </div>
            </button>

            {/* Male Matchmaker: Arjun Kapoor */}
            <button
              type="button"
              onClick={() => setCredentials('arjun@thedatecrew.com')}
              className={`p-2.5 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
                email === 'arjun@thedatecrew.com'
                  ? 'bg-fuchsia-500/15 border-fuchsia-500/50 text-white shadow-sm'
                  : 'bg-white/[0.02] border-brand-border hover:bg-white/[0.05] text-slate-300'
              }`}
            >
              <div className="text-xs font-semibold text-slate-100 flex items-center justify-between">
                <span>Arjun Kapoor</span>
                <span className="text-[10px] text-blue-400 font-medium">Male</span>
              </div>
              <div className="text-[11px] text-slate-400 truncate mt-0.5">
                arjun@thedatecrew.com
              </div>
            </button>
          </div>
        </div>
      </Card>

      {/* Ambient background decoration */}
      <div className="absolute w-[500px] h-[500px] bg-brand-pink/10 top-[-100px] right-[-100px] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute w-[600px] h-[600px] bg-brand-purple/10 bottom-[-150px] left-[-150px] rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
