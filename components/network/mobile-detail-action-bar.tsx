'use client';

import { cn } from '@/lib/utils';

/**
 * Fixed bottom action bar for directory detail pages on mobile only.
 * Renders children in a safe-area-aware bar so primary actions are always reachable.
 */
export function MobileDetailActionBar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'fixed left-0 right-0 bottom-0 z-40 md:hidden',
        'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-700',
        'px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]',
        'shadow-[0_-4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)]',
        className
      )}
    >
      {children}
    </div>
  );
}
