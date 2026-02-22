'use client';

import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type StatAccent = 'primary' | 'emerald' | 'sky' | 'amber' | 'violet';

export interface StatItem {
  label: string;
  value: string | number;
  /** Optional soft accent for left edge and value */
  accent?: StatAccent;
  /** Optional icon shown with accent color */
  icon?: LucideIcon;
}

const STAT_ACCENT_CLASSES: Record<StatAccent, { border: string; value: string; icon: string }> = {
  primary: { border: 'border-l-primary/50', value: 'text-primary', icon: 'text-primary' },
  emerald: { border: 'border-l-emerald-500/40', value: 'text-emerald-700 dark:text-emerald-400', icon: 'text-emerald-600 dark:text-emerald-400' },
  sky: { border: 'border-l-sky-500/40', value: 'text-sky-700 dark:text-sky-400', icon: 'text-sky-600 dark:text-sky-400' },
  amber: { border: 'border-l-amber-500/40', value: 'text-amber-700 dark:text-amber-400', icon: 'text-amber-600 dark:text-amber-400' },
  violet: { border: 'border-l-violet-500/40', value: 'text-violet-700 dark:text-violet-400', icon: 'text-violet-600 dark:text-violet-400' },
};

interface DirectoryLayoutProps {
  title: string;
  description: string;
  /** Optional subtitle, e.g. "Millions of startups worldwide" */
  subtitle?: string;
  ctaHref?: string;
  ctaLabel?: string;
  stats?: StatItem[];
  children: React.ReactNode;
}

export function DirectoryLayout({
  title,
  description,
  subtitle,
  ctaHref,
  ctaLabel = 'Join directory',
  stats,
  children,
}: DirectoryLayoutProps) {
  return (
    <div className="md:mb-0">
      {/* Header: stacked on mobile, row on desktop; CTA full-width on mobile */}
      <div className="mb-4 md:mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-growthlab-slate sm:text-3xl mb-1">{title}</h1>
          {subtitle && <p className="text-sm font-medium text-primary mb-1 md:mb-2">{subtitle}</p>}
          <p className="text-muted max-w-3xl text-sm sm:text-base leading-snug">{description}</p>
        </div>
        {ctaHref && (
          <Link href={ctaHref} className="w-full sm:w-auto sm:shrink-0">
            <Button className="btn-primary w-full sm:w-auto rounded-xl md:rounded-lg min-h-11 touch-target py-3 text-sm font-medium">
              {ctaLabel}
            </Button>
          </Link>
        )}
      </div>
      {stats && stats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-6 md:mb-8">
          {stats.map((s) => {
            const accent = s.accent ? STAT_ACCENT_CLASSES[s.accent] : { border: 'border-l-primary/40', value: 'text-growthlab-slate', icon: 'text-muted' };
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className={cn(
                  'rounded-xl border border-gray-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/30 border-l-[3px] p-3 md:p-4',
                  accent.border
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs md:text-sm text-muted truncate">{s.label}</p>
                  {Icon && <Icon className={cn('h-4 w-4 md:h-5 md:w-5 shrink-0', accent.icon)} aria-hidden />}
                </div>
                <p className={cn('text-lg md:text-xl font-bold tabular-nums mt-0.5', accent.value)}>{s.value}</p>
              </div>
            );
          })}
        </div>
      )}
      {children}
    </div>
  );
}
