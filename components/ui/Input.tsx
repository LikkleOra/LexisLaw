import React, { InputHTMLAttributes } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="block font-mono text-xs uppercase tracking-widest text-lexis-grey">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full bg-card border-2 border-[#333333] text-white px-4 py-3 outline-none transition-all duration-200 font-mono text-sm',
            'focus:border-lexis-red focus:shadow-brutal-red',
            error && 'border-lexis-red',
            className
          )}
          style={{ borderRadius: 0 }}
          {...props}
        />
        {error && (
          <p className="font-mono text-[10px] text-lexis-red uppercase tracking-tight">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
