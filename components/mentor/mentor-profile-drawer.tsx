'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Award, X, MessageCircle, ExternalLink, Calendar, Briefcase, Clock, DollarSign } from 'lucide-react';
import type { Mentor } from '@/lib/mock-mentors';
import { cn } from '@/lib/utils';

interface MentorProfileDrawerProps {
  mentor: Mentor | null;
  open: boolean;
  onClose: () => void;
  onBookSession: () => void;
  bookRequestSent?: boolean;
}

export function MentorProfileDrawer({
  mentor,
  open,
  onClose,
  onBookSession,
  bookRequestSent = false,
}: MentorProfileDrawerProps) {
  if (!mentor) return null;

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
        aria-label={`${mentor.name} profile`}
      >
        <div className="flex items-center justify-between gap-4 p-4 border-b border-slate-200 dark:border-slate-700 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-12 w-12 shrink-0 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-600 overflow-hidden">
              {mentor.logo ? (
                <img src={mentor.logo} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-lg font-semibold text-muted">
                  {mentor.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <h2 className="font-semibold text-growthlab-slate truncate">{mentor.name}</h2>
              <p className="text-sm text-muted">{mentor.tagline || mentor.role} · {mentor.location}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-muted hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {mentor.verified && (
              <span className="inline-flex items-center rounded-md bg-primary/12 text-primary dark:bg-primary/20 dark:text-primary text-xs font-medium px-2 py-0.5 border border-primary/25">
                <Award className="h-3 w-3 mr-1" /> Verified
              </span>
            )}
            {mentor.featured && (
              <span className="inline-flex items-center rounded-md bg-primary/12 text-primary text-xs font-medium px-2 py-0.5">
                <Star className="h-3 w-3 mr-1 fill-current" /> Featured
              </span>
            )}
            {mentor.status === 'Available' && (
              <span className="inline-flex items-center rounded-md bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 text-xs font-medium px-2 py-0.5">
                Available
              </span>
            )}
            <span className="flex items-center gap-1 text-sm text-muted">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {mentor.rating}
            </span>
          </div>

          <p className="text-sm text-muted">{mentor.description}</p>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Details</h3>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
              {mentor.sessions != null && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted flex items-center gap-1.5"><Clock className="h-4 w-4" /> Sessions</span>
                  <span className="font-medium text-growthlab-slate">{mentor.sessions}</span>
                </div>
              )}
              {mentor.hourlyRate && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted flex items-center gap-1.5"><DollarSign className="h-4 w-4" /> Rate</span>
                  <span className="font-medium text-growthlab-slate">{mentor.hourlyRate}</span>
                </div>
              )}
              {mentor.experience && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted flex items-center gap-1.5"><Briefcase className="h-4 w-4" /> Experience</span>
                  <span className="font-medium text-growthlab-slate">{mentor.experience}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted flex items-center gap-1.5"><MapPin className="h-4 w-4" /> Location</span>
                <span className="font-medium text-growthlab-slate">{mentor.location}</span>
              </div>
            </div>
          </section>

          {mentor.expertise.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {mentor.expertise.map((e) => (
                <span key={e} className="rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 px-2.5 py-1 text-xs font-medium text-growthlab-slate">
                  {e}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-2 pt-2">
            <Button size="sm" className="w-full rounded-lg btn-primary gap-2" onClick={onBookSession} disabled={bookRequestSent}>
              <Calendar className="h-4 w-4" />
              {bookRequestSent ? 'Request sent' : 'Book session'}
            </Button>
            <Link href={`/mentors/${mentor.id}`} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-growthlab-slate hover:bg-slate-50 dark:hover:bg-slate-800">
              View full profile
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
