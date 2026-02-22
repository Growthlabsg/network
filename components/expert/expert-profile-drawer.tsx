'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Award, X, Clock, DollarSign, User, ExternalLink } from 'lucide-react';
import type { IndustryExpert } from '@/lib/mock-industry-experts';
import { cn } from '@/lib/utils';

interface ExpertProfileDrawerProps {
  expert: IndustryExpert | null;
  open: boolean;
  onClose: () => void;
}

export function ExpertProfileDrawer({ expert, open, onClose }: ExpertProfileDrawerProps) {
  if (!expert) return null;

  const subtitle = [expert.title, expert.company, expert.location].filter(Boolean).join(' • ');

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
        aria-label={`${expert.name} profile`}
      >
        <div className="flex items-center justify-between gap-4 p-4 border-b border-slate-200 dark:border-slate-700 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-12 w-12 shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-600 overflow-hidden">
              {expert.logo ? (
                <img src={expert.logo} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-sm font-semibold text-muted">
                  {expert.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <h2 className="font-semibold text-growthlab-slate truncate">{expert.name}</h2>
              <p className="text-sm text-muted truncate">{subtitle || expert.location}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-muted hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {expert.verified && (
              <span className="inline-flex items-center rounded-md bg-primary/12 text-primary dark:bg-primary/20 dark:text-primary text-xs font-medium px-2 py-0.5 border border-primary/25">
                <Award className="h-3 w-3 mr-1" /> Verified
              </span>
            )}
            {expert.featured && (
              <span className="inline-flex items-center rounded-md bg-primary/12 text-primary dark:bg-primary/20 dark:text-primary text-xs font-medium px-2 py-0.5 border border-primary/25 dark:border-primary/30">
                <Star className="h-3 w-3 mr-1 fill-current" /> Featured
              </span>
            )}
            {expert.rating > 0 && (
              <span className="flex items-center gap-1 text-sm text-muted">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {expert.rating}
                {expert.reviewCount != null && <span className="text-muted">({expert.reviewCount} reviews)</span>}
              </span>
            )}
          </div>

          <p className="text-sm text-muted">{expert.description}</p>

          {expert.expertise.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {expert.expertise.map((tag) => (
                <span key={tag} className="rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 px-2.5 py-1 text-xs font-medium text-growthlab-slate dark:text-slate-200">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Details</h3>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
              {expert.experience && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted flex items-center gap-1.5"><Clock className="h-4 w-4" /> Experience</span>
                  <span className="font-medium text-growthlab-slate">{expert.experience}</span>
                </div>
              )}
              {expert.hourlyRate && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted flex items-center gap-1.5"><DollarSign className="h-4 w-4" /> Rate</span>
                  <span className="font-medium text-growthlab-slate">{expert.hourlyRate}</span>
                </div>
              )}
              {expert.availability && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Availability</span>
                  <span className="font-medium text-growthlab-slate">{expert.availability}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted flex items-center gap-1.5"><MapPin className="h-4 w-4" /> Location</span>
                <span className="font-medium text-growthlab-slate">{expert.location}</span>
              </div>
            </div>
          </section>

          <Link
            href={`/industry-experts/${expert.id}`}
            className="inline-flex items-center justify-center gap-2 w-full rounded-lg btn-primary py-2.5"
          >
            View profile
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </aside>
    </>
  );
}
