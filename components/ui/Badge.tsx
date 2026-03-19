import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BadgeProps {
  variant?: 'pending' | 'progress' | 'verified' | 'warning' | 'error';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'pending',
  size = 'md',
  children,
}) => {
  const baseStyles = 'inline-flex items-center font-mono uppercase tracking-widest transition-all duration-200';
  
  const variants = {
    pending: 'bg-lexis-grey/20 text-[#333333]',
    progress: 'bg-yellow-500/20 text-yellow-500',
    verified: 'bg-lexis-green/20 text-lexis-green',
    warning: 'bg-orange-500/20 text-orange-500',
    error: 'bg-lexis-red/20 text-lexis-red',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-3 py-1',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size])}>
      {children}
    </span>
  );
};

export default Badge;
