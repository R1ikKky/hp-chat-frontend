'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cn(
      'flex h-11 w-full rounded-lg border border-[#1e2e1e] bg-[#0d1410] px-4 py-2.5 text-sm text-[#e2fce4]',
      'placeholder:text-[#3a5a3a]',
      'focus:outline-none focus:ring-[1.5px] focus:ring-[#22c55e40] focus:border-[#22c55e40]',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'transition duration-150',
      className,
    )}
    {...props}
  />
));

Input.displayName = 'Input';
export { Input };
