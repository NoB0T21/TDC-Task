import React, { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const variantStyles: Record<string, string> = {
  primary:
    'bg-gradient-to-r from-brand-pink via-brand-purple to-brand-violet hover:brightness-110 text-white shadow-lg shadow-brand-pink/25 border border-transparent',
  secondary:
    'bg-brand-surface hover:bg-brand-surface-hover text-slate-100 border border-brand-border',
  outline:
    'bg-transparent hover:bg-white/[0.05] text-brand-pink border border-brand-pink/40 hover:border-brand-pink',
  ghost:
    'bg-transparent hover:bg-white/[0.06] text-slate-300 hover:text-white border border-transparent',
  danger:
    'bg-red-500/15 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30',
};

const sizeStyles: Record<string, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      icon,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 cursor-pointer select-none active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
        ) : (
          icon && <span className="inline-flex items-center justify-center shrink-0">{icon}</span>
        )}
        <span className="truncate">{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';
