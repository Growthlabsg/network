'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Building2,
  MapPin,
  DollarSign,
  Users,
  Star,
  Award,
  Target,
  FileText,
  Briefcase,
  X,
  MessageCircle,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import type { Investor } from '@/lib/mock-investors';
import { cn } from '@/lib/utils';

interface InvestorProfileDrawerProps {
  investor: Investor | null;
  open: boolean;
  onClose: () => void;
  onSendConnectionRequest: () => void;
  connectionRequestSent: boolean;
  isConnected?: boolean;
}

export function InvestorProfileDrawer({
  investor,
  open,
  onClose,
  onSendConnectionRequest,
  connectionRequestSent,
  isConnected = false,
}: InvestorProfileDrawerProps) {
  if (!investor) return null;

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
        aria-label={`${investor.name} profile`}
      >
        <div className="flex items-center justify-between gap-4 p-4 border-b border-slate-200 dark:border-slate-700 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-12 w-12 shrink-0 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-600 overflow-hidden">
              {investor.logo ? (
                <img src={investor.logo} alt="" className="h-full w-full object-cover" />
              ) : (
                <Building2 className="h-6 w-6 text-muted" />
              )}
            </div>
            <div className="min-w-0">
              <h2 className="font-semibold text-growthlab-slate truncate">{investor.name}</h2>
              <p className="text-sm text-muted">{investor.type} · {investor.location}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-muted hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {investor.verified && (
              <span className="inline-flex items-center rounded-md bg-primary/12 text-primary dark:bg-primary/20 dark:text-primary text-xs font-medium px-2 py-0.5 border border-primary/25">
                <Award className="h-3 w-3 mr-1" /> Verified
              </span>
            )}
            {investor.featured && (
              <span className="inline-flex items-center rounded-md bg-primary/12 text-primary text-xs font-medium px-2 py-0.5">
                <Star className="h-3 w-3 mr-1 fill-current" /> Featured
              </span>
            )}
            <span className="flex items-center gap-1 text-sm text-muted">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {investor.rating}
            </span>
          </div>

          <p className="text-sm text-muted">{investor.description}</p>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Requirements & focus</h3>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Check size</span>
                <span className="font-medium text-growthlab-slate">{investor.investmentRange}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Portfolio companies</span>
                <span className="font-medium text-growthlab-slate">{investor.portfolioCount}</span>
              </div>
              {investor.responseTime && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Response time</span>
                  <span className="font-medium text-growthlab-slate">{investor.responseTime}</span>
                </div>
              )}
              {investor.stages && investor.stages.length > 0 && (
                <div>
                  <span className="text-muted text-sm">Stages</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {investor.stages.map((s) => (
                      <span key={s} className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-medium text-growthlab-slate">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <span className="text-muted text-sm">Focus</span>
                <p className="text-sm font-medium text-growthlab-slate mt-0.5">{investor.focus}</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Industries</h3>
            <div className="flex flex-wrap gap-2">
              {investor.industries.map((ind) => (
                <span
                  key={ind}
                  className="rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 px-2.5 py-1 text-xs font-medium text-growthlab-slate"
                >
                  {ind}
                </span>
              ))}
            </div>
          </section>

          {investor.portfolioHighlights && investor.portfolioHighlights.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2 flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5" /> Portfolio highlights
              </h3>
              <div className="flex flex-wrap gap-2">
                {investor.portfolioHighlights.map((name) => (
                  <span
                    key={name}
                    className="rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 px-3 py-1.5 text-sm text-growthlab-slate"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {investor.howToApply && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2 flex items-center gap-1">
                <FileText className="h-3.5 w-3.5" /> How to apply
              </h3>
              <p className="text-sm text-muted leading-relaxed whitespace-pre-line">{investor.howToApply}</p>
            </section>
          )}

          {investor.contactPrivate && (
            <p className="text-xs text-muted rounded-lg bg-slate-100 dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-600">
              This investor prefers to be contacted via in-app message after you connect. Send a connection request; once they accept, you can message them here.
            </p>
          )}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-2 shrink-0">
          {isConnected ? (
            <Link href="/messages" className="block">
              <Button size="sm" className="btn-primary w-full rounded-lg gap-2">
                <MessageCircle className="h-4 w-4" />
                Message
              </Button>
            </Link>
          ) : connectionRequestSent ? (
            <Button size="sm" className="w-full rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30" disabled>
              Request sent — you can message once they accept
            </Button>
          ) : (
            <Button size="sm" className="btn-primary w-full rounded-lg gap-2" onClick={onSendConnectionRequest}>
              <MessageCircle className="h-4 w-4" />
              Send connection request
            </Button>
          )}
          <p className="text-xs text-muted text-center">
            After they accept, all contact happens in-app — no need to share email.
          </p>
          <Link
            href={`/investors/${investor.id}`}
            onClick={onClose}
            className="flex items-center justify-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View full profile
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </aside>
    </>
  );
}
