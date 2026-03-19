import React, { ButtonHTMLAttributes } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-display uppercase tracking-widest transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none active:translate-x-0 active:translate-y-0 active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lexis-red focus-visible:ring-offset-2 focus-visible:ring-offset-lexis-black';
    
    const variants = {
      primary: 'bg-lexis-red text-black border-2 border-lexis-red hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal-red',
      secondary: 'bg-transparent text-black border-2 border-black hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal',
      ghost: 'bg-transparent text-black hover:bg-lexis-black/10 border-2 border-transparent',
      danger: 'bg-lexis-red border-2 border-lexis-red text-black hover:brightness-110',
    };

    const sizes = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-6 py-3 text-sm font-bold',
      lg: 'px-8 py-4 text-base font-bold',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export default Button;
