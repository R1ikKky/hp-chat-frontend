'use client';
import * as React from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  const radius = 120;
  const [visible, setVisible] = React.useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  }

  return (
    <motion.div
      style={{
        background: useMotionTemplate`radial-gradient(${
          visible ? `${radius}px` : '0px'
        } circle at ${mouseX}px ${mouseY}px, #22c55e40, transparent 80%)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className="p-[1.5px] rounded-xl transition duration-300 group/input"
    >
      <input
        type={type}
        ref={ref}
        className={cn(
          'flex h-11 w-full border-none bg-[#111a12] text-[#e2fce4] shadow-input rounded-xl px-4 py-2 text-sm',
          'placeholder:text-[#4ade8066] focus-visible:outline-none',
          'focus-visible:ring-[1.5px] focus-visible:ring-[#22c55e60]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'transition duration-300',
          className,
        )}
        {...props}
      />
    </motion.div>
  );
});

Input.displayName = 'Input';
export { Input };
