import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps {
  variant?: 'default' | 'highlighted' | 'success' | 'error';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: boolean;
  className?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  shadow = false,
  className,
  children,
}) => {
  const baseStyles = 'bg-card border-2 border-border transition-all duration-300';
  
  const variants = {
    default: 'border-border',
    highlighted: 'border-l-4 border-l-lexis-red',
    success: 'border-l-4 border-l-lexis-green',
    error: 'border-l-4 border-l-lexis-red',
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={cn(
        baseStyles,
        variants[variant],
        paddings[padding],
        shadow && 'shadow-brutal-lg',
        className
      )}
      style={{ borderRadius: 0 }}
    >
      {children}
    </div>
  );
};

export default Card;
