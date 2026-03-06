import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

export function Alert({
  className,
  variant = 'default',
  children,
}: {
  className?: string;
  variant?: 'default' | 'destructive';
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        'relative w-full rounded-lg border p-4 text-sm',
        variant === 'destructive' ? 'border-red-300 bg-red-50 text-red-700' : 'border-slate-300 bg-white text-slate-800',
        className
      )}
    >
      {children}
    </div>
  );
}
