'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BackgroundGradientProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
}

export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = true,
}: BackgroundGradientProps) => {
  const variants = {
    initial: { backgroundPosition: '0 50%' },
    animate: { backgroundPosition: ['0 50%', '100% 50%', '0 50%'] },
  };

  return (
    <div className={cn('relative p-[2px] group', containerClassName)}>
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? 'initial' : undefined}
        animate={animate ? 'animate' : undefined}
        transition={animate ? { duration: 6, repeat: Infinity, repeatType: 'reverse' } : undefined}
        style={{ backgroundSize: animate ? '400% 400%' : undefined }}
        className={cn(
          'absolute inset-0 rounded-2xl z-[1] opacity-50 group-hover:opacity-80 blur-xl transition duration-500 will-change-transform',
          'bg-[radial-gradient(circle_farthest-side_at_0_100%,#15803d,transparent),radial-gradient(circle_farthest-side_at_100%_0,#166534,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#22c55e,transparent),radial-gradient(circle_farthest-side_at_0_0,#14532d,#080d08)]',
        )}
      />
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? 'initial' : undefined}
        animate={animate ? 'animate' : undefined}
        transition={animate ? { duration: 6, repeat: Infinity, repeatType: 'reverse' } : undefined}
        style={{ backgroundSize: animate ? '400% 400%' : undefined }}
        className={cn(
          'absolute inset-0 rounded-2xl z-[1] will-change-transform',
          'bg-[radial-gradient(circle_farthest-side_at_0_100%,#15803d,transparent),radial-gradient(circle_farthest-side_at_100%_0,#166534,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#22c55e,transparent),radial-gradient(circle_farthest-side_at_0_0,#14532d,#080d08)]',
        )}
      />
      <div className={cn('relative z-10', className)}>{children}</div>
    </div>
  );
};
