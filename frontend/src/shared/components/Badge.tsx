import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | 'new'
    | 'active'
    | 'matched'
    | 'paused'
    | 'closed'
    | 'score'
    | 'neutral'
    | 'success'
    | 'warning'
    | 'error';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

const badgeVariants: Record<string, string> = {
  new: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  matched: 'bg-fuchsia-500/15 text-fuchsia-400 border-fuchsia-500/30',
  paused: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  closed: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  score:
    'bg-gradient-to-r from-pink-500/20 to-fuchsia-500/20 text-pink-300 border-pink-500/30 font-mono font-bold',
  neutral: 'bg-white/[0.06] text-slate-300 border-white/10',
  success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  error: 'bg-red-500/15 text-red-400 border-red-500/30',
};

const badgeSizes: Record<string, string> = {
  sm: 'text-xs px-2.5 py-0.5 gap-1',
  md: 'text-sm px-3.5 py-1 gap-1.5',
};

export function Badge({
  children,
  variant = 'neutral',
  size = 'sm',
  icon,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-semibold rounded-md border capitalize leading-tight ${badgeVariants[variant]} ${badgeSizes[size]} ${className}`}
    >
      {icon && <span className="inline-flex items-center">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
