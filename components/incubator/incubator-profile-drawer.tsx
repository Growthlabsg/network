'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Award, X, Clock, DollarSign, Users, Calendar, ExternalLink, Rocket } from 'lucide-react';
import type { Incubator } from '@/lib/mock-incubators';
import { cn } from '@/lib/utils';

interface IncubatorProfileDrawerProps {
  incubator: Incubator | null;
  open: boolean;
  onClose: () => void;
}

export function IncubatorProfileDrawer({ incubator, open, onClose }: IncubatorProfileDrawerProps) {
  if (!incubator) return null;

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity',
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onClose}
        aria-hidden
      />
      <aside
        className={cn(
          'fixed right-0 top-0 z-50 h-full w-full max-w-lg bg-white dark:bg-slate-900 shadow-xl border-l border-slate-200 dark:border-slate-700 flex flex-col transition-transform duration-200 ease-out',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
        aria-modal="true"
        aria-label={`${incubator.name} profile`}
      >
        <div className="flex items-center justify-between gap-4 p-4 border-b border-slate-200 dark:border-slate-700 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-12 w-12 shrink-0 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-600 overflow-hidden">
              {incubator.logo ? (
                <img src={incubator.logo} alt="" className="h-full w-full object-cover" />
              ) : (
                <Rocket className="h-6 w-6 text-muted" />
              )}
            </div>
            <div className="min-w-0">
              <h2 className="font-semibold text-growthlab-slate truncate">{incubator.name}</h2>
              <p className="text-sm text-muted">{incubator.type} · {incubator.location}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-muted hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {incubator.verified && (
              <span className="inline-flex items-center rounded-md bg-primary/12 text-primary dark:bg-primary/20 dark:text-primary text-xs font-medium px-2 py-0.5 border border-primary/25">
                <Award className="h-3 w-3 mr-1" /> Verified
              </span>
            )}
            {incubator.featured && (
              <span className="inline-flex items-center rounded-md bg-primary/12 text-primary text-xs font-medium px-2 py-0.5">
                <Star className="h-3 w-3 mr-1 fill-current" /> Featured
              </span>
            )}
            {incubator.rating != null && (
              <span className="flex items-center gap-1 text-sm text-muted">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {incubator.rating}
              </span>
            )}
          </div>

          <p className="text-sm text-muted">{incubator.description}</p>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Program details</h3>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
              {incubator.duration && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted flex items-center gap-1.5"><Clock className="h-4 w-4" /> Duration</span>
                  <span className="font-medium text-growthlab-slate">{incubator.duration}</span>
                </div>
              )}
              {incubator.funding && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted flex items-center gap-1.5"><DollarSign className="h-4 w-4" /> Funding</span>
                  <span className="font-medium text-growthlab-slate">{incubator.funding}</span>
                </div>
              )}
              {incubator.cohortSize && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted flex items-center gap-1.5"><Users className="h-4 w-4" /> Cohort</span>
                  <span className="font-medium text-growthlab-slate">{incubator.cohortSize}</span>
                </div>
              )}
              {incubator.nextIntake && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Next intake</span>
                  <span className="font-medium text-growthlab-slate">{incubator.nextIntake}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted flex items-center gap-1.5"><MapPin className="h-4 w-4" /> Location</span>
                <span className="font-medium text-growthlab-slate">{incubator.location}</span>
              </div>
            </div>
          </section>

          {incubator.industries.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {incubator.industries.map((ind) => (
                <span key={ind} className="rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 px-2.5 py-1 text-xs font-medium text-growthlab-slate">
                  {ind}
                </span>
              ))}
            </div>
          )}

          <Link
            href={`/incubators-accelerators/${incubator.id}`}
            className="inline-flex items-center justify-center gap-2 w-full rounded-lg btn-primary py-2.5"
          >
            View details
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </aside>
    </>
  );
}
