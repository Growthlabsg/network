'use client';

import Link from 'next/link';
import { MapPin, Star, Award, X, FileText, Phone, ExternalLink, Building2 } from 'lucide-react';
import type { GovernmentAgency } from '@/lib/mock-government-agencies';
import { cn } from '@/lib/utils';

interface AgencyProfileDrawerProps {
  agency: GovernmentAgency | null;
  open: boolean;
  onClose: () => void;
}

export function AgencyProfileDrawer({ agency, open, onClose }: AgencyProfileDrawerProps) {
  if (!agency) return null;

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
        aria-label={`${agency.name} profile`}
      >
        <div className="flex items-center justify-between gap-4 p-4 border-b border-slate-200 dark:border-slate-700 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-12 w-12 shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-600 overflow-hidden">
              {agency.logo ? (
                <img src={agency.logo} alt="" className="h-full w-full object-cover" />
              ) : (
                <Building2 className="h-6 w-6 text-muted" />
              )}
            </div>
            <div className="min-w-0">
              <h2 className="font-semibold text-growthlab-slate truncate">{agency.name}</h2>
              <p className="text-sm text-muted truncate">{agency.category} · {agency.location}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-muted hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {agency.verified && (
              <span className="inline-flex items-center rounded-md bg-primary/12 text-primary dark:bg-primary/20 dark:text-primary text-xs font-medium px-2 py-0.5 border border-primary/25">
                <Award className="h-3 w-3 mr-1" /> Verified
              </span>
            )}
            {agency.featured && (
              <span className="inline-flex items-center rounded-md bg-primary/12 text-primary dark:bg-primary/20 dark:text-primary text-xs font-medium px-2 py-0.5 border border-primary/25 dark:border-primary/30">
                <Star className="h-3 w-3 mr-1 fill-current" /> Featured
              </span>
            )}
            {agency.rating > 0 && (
              <span className="flex items-center gap-1 text-sm text-muted">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {agency.rating}
                {agency.reviewCount != null && <span className="text-muted">({agency.reviewCount} reviews)</span>}
              </span>
            )}
          </div>

          <p className="text-sm text-muted">{agency.description}</p>

          {agency.programs.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {agency.programs.slice(0, 4).map((p) => (
                <span key={p} className="rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 px-2.5 py-1 text-xs font-medium text-growthlab-slate dark:text-slate-200">
                  {p}
                </span>
              ))}
            </div>
          )}

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Details</h3>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted flex items-center gap-1.5"><FileText className="h-4 w-4" /> Programs</span>
                <span className="font-medium text-growthlab-slate">{agency.programs.length} programs</span>
              </div>
              {agency.regulationsCount != null && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Regulations</span>
                  <span className="font-medium text-growthlab-slate">{agency.regulationsCount}</span>
                </div>
              )}
              {agency.phone && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted flex items-center gap-1.5"><Phone className="h-4 w-4" /> Contact</span>
                  <span className="font-medium text-growthlab-slate">{agency.phone}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted flex items-center gap-1.5"><MapPin className="h-4 w-4" /> Location</span>
                <span className="font-medium text-growthlab-slate">{agency.location}</span>
              </div>
            </div>
          </section>

          <Link
            href={`/government/${agency.id}`}
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
