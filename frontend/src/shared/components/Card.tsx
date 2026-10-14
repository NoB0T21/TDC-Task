import React, { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
  glow?: boolean;
  className?: string;
}

export const Card = ({
  children,
  hoverable = false,
  glow = false,
  className = '',
  ...props
}: CardProps) => {
  return (
    <div
      className={`bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-lg p-6 shadow-xl transition-all duration-200 ${
        hoverable ? 'hover:bg-white/[0.06] hover:border-white/20 hover:-translate-y-0.5 hover:shadow-2xl cursor-pointer' : ''
      } ${
        glow ? 'hover:border-pink-500/30 hover:shadow-pink-500/20' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
