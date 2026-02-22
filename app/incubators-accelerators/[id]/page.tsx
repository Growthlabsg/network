'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Rocket,
  MapPin,
  Star,
  Award,
  MessageCircle,
  Share2,
  ExternalLink,
  Bookmark,
  ChevronRight,
  Clock,
  DollarSign,
  Users,
  Calendar,
  FileText,
  CheckCircle2,
  Eye,
  Bell,
  Pencil,
} from 'lucide-react';
import { IncubatorProfileEditDialog } from '@/components/incubator/incubator-profile-edit-dialog';
import { getIncubatorById, getSimilarIncubators, getPeopleAlsoViewedIncubators, type Incubator } from '@/lib/mock-incubators';
import { getMyIncubatorFromStorage, setMyIncubatorInStorage } from '@/lib/incubator-me';
import { cn, formatCount } from '@/lib/utils';
import { MobileDetailActionBar } from '@/components/network/mobile-detail-action-bar';

export default function IncubatorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === 'string' ? params.id : '';
  const [myIncubator, setMyIncubator] = useState<Incubator | null | undefined>(undefined);
  const sourceIncubator = useMemo(() => {
    if (id === 'me') return myIncubator ?? null;
    return id ? getIncubatorById(id) : undefined;
  }, [id, myIncubator]);
  const [editedData, setEditedData] = useState<Partial<Incubator> | null>(null);
  const incubator = useMemo<Incubator | undefined>(() => {
    if (!sourceIncubator) return undefined;
    if (!editedData) return sourceIncubator;
    return { ...sourceIncubator, ...editedData } as Incubator;
  }, [sourceIncubator, editedData]);
  const similar = incubator && incubator.id !== 'me' ? getSimilarIncubators(incubator) : [];
  const peopleAlsoViewed = id && id !== 'me' ? getPeopleAlsoViewedIncubators(id) : [];
  const [saved, setSaved] = useState(false);
  const [applyRequested, setApplyRequested] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [gettingUpdates, setGettingUpdates] = useState(false);

  useEffect(() => {
    if (id === 'me') setMyIncubator(getMyIncubatorFromStorage());
  }, [id]);

  useEffect(() => {
    if (id === 'me' && myIncubator === null) router.replace('/incubators-accelerators/create');
  }, [id, myIncubator, router]);

  const copyLink = () => {
    if (typeof window === 'undefined') return;
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!id) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <Card className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20">
          <CardContent className="p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-muted mb-4">
              <Rocket className="h-7 w-7" />
            </div>
            <h2 className="text-lg font-semibold text-growthlab-slate mb-2">Program not found</h2>
            <p className="text-sm text-muted mb-6">The profile may have been removed or the link is incorrect.</p>
            <Link href="/incubators-accelerators">
              <Button variant="outline" className="rounded-lg border-slate-300 dark:border-slate-600">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to directory
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (id === 'me' && myIncubator === undefined) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <div className="animate-pulse rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20 p-10">
          <div className="h-14 w-14 rounded-2xl bg-slate-200 dark:bg-slate-700 mx-auto mb-4" />
          <div className="h-5 w-48 bg-slate-200 dark:bg-slate-700 rounded mx-auto mb-2" />
          <div className="h-4 w-64 bg-slate-200 dark:bg-slate-700 rounded mx-auto" />
        </div>
      </div>
    );
  }

  if (!incubator) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <Card className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20">
          <CardContent className="p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-muted mb-4">
              <Rocket className="h-7 w-7" />
            </div>
            <h2 className="text-lg font-semibold text-growthlab-slate mb-2">Program not found</h2>
            <p className="text-sm text-muted mb-6">The profile may have been removed or the link is incorrect.</p>
            <Link href="/incubators-accelerators">
              <Button variant="outline" className="rounded-lg border-slate-300 dark:border-slate-600">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to directory
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8 pb-24 md:pb-0">
      <nav className="flex items-center gap-2 text-sm text-muted" aria-label="Breadcrumb">
        <Link href="/incubators-accelerators" className="hover:text-primary transition-colors">
          Incubators & Accelerators
        </Link>
        <span className="text-slate-300 dark:text-slate-600">/</span>
        <span className="font-medium text-growthlab-slate truncate">{incubator.name}</span>
      </nav>

      <section className="relative overflow-hidden rounded-t-2xl shadow-sm" aria-hidden>
        {incubator.banner ? (
          <div className="aspect-[3/1] min-h-[140px] max-h-[200px] w-full">
            <img src={incubator.banner} alt="" className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="aspect-[3/1] min-h-[140px] max-h-[200px] w-full gs-gradient rounded-t-2xl" />
        )}
      </section>

      <div className="relative -mt-16 sm:-mt-20 px-4 sm:px-6">
        <div className="flex h-24 w-24 sm:h-28 sm:w-28 rounded-2xl border-4 border-white dark:border-slate-900 bg-white dark:bg-slate-900 shadow-lg overflow-hidden ring-1 ring-slate-200/50 dark:ring-slate-700/50 items-center justify-center">
          {incubator.logo ? (
            <img src={incubator.logo} alt={`${incubator.name}`} className="h-full w-full object-cover" />
          ) : (
            <Rocket className="h-12 w-12 sm:h-14 sm:w-14 text-primary" />
          )}
        </div>
      </div>

      <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden -mt-2">
        <CardContent className="p-6 sm:p-8 pt-10 sm:pt-12">
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-growthlab-slate">{incubator.name}</h1>
                  {incubator.tagline && <p className="text-muted text-sm sm:text-base mt-1">{incubator.tagline}</p>}
                </div>
                <Button size="sm" variant="outline" className="rounded-lg border-slate-300 dark:border-slate-600 shrink-0" onClick={() => setEditOpen(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit profile
                </Button>
              </div>
              <p className="text-muted mt-2 max-w-2xl">{incubator.description}</p>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {incubator.verified && (
                  <span className="inline-flex items-center rounded-md bg-primary/12 text-primary dark:bg-primary/20 dark:text-primary text-xs font-medium px-2 py-0.5 border border-primary/25 dark:border-primary/30">
                    <Award className="h-3 w-3 mr-1" />
                    Verified
                  </span>
                )}
                {incubator.featured && (
                  <span className="inline-flex items-center rounded-md bg-primary/12 text-primary text-xs font-medium px-2 py-0.5 border border-primary/25">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Featured
                  </span>
                )}
                {incubator.rating != null && (
                  <span className="flex items-center gap-1 text-sm text-muted">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {incubator.rating} rating
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 text-sm text-muted">
                <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-medium text-growthlab-slate">
                  {incubator.type}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  {incubator.location}
                </span>
                {incubator.duration && (
                  <>
                    <span aria-hidden>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 shrink-0" />
                      {incubator.duration}
                    </span>
                  </>
                )}
                {incubator.views != null && (
                  <span className="flex items-center gap-1.5 text-sm text-muted ml-auto">
                    <Eye className="h-3.5 w-3.5" />
                    <strong className="font-semibold text-growthlab-slate">{formatCount(incubator.views)}</strong> profile views
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-2">
            <Button size="sm" className="btn-primary rounded-lg" onClick={() => setApplyRequested(true)} disabled={applyRequested}>
              {applyRequested ? 'Application sent' : 'Apply'}
            </Button>
            <Link href="/messages" className="inline-flex items-center justify-center gap-2 h-9 px-3 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent font-medium text-growthlab-slate hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <MessageCircle className="h-4 w-4" />
              Message
            </Link>
            <Button size="sm" variant="outline" className="rounded-lg border-slate-300 dark:border-slate-600" onClick={copyLink} aria-label={copied ? 'Link copied' : 'Copy profile link'}>
              {copied ? <CheckCircle2 className="mr-2 h-4 w-4 text-primary" /> : <Share2 className="mr-2 h-4 w-4" />}
              {copied ? 'Copied' : 'Share'}
            </Button>
            <Button size="sm" variant="outline" className={cn('rounded-lg border-slate-300 dark:border-slate-600', saved && 'bg-rose-500/10 border-rose-500/30 text-rose-700')} onClick={() => setSaved(!saved)}>
              <Bookmark className={cn('mr-2 h-4 w-4', saved && 'fill-current')} />
              {saved ? 'Saved' : 'Save'}
            </Button>
            {incubator.website && (
              <a href={incubator.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-growthlab-slate hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                Website
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            )}
          </div>
        </CardContent>
      </Card>

      {incubator.recognition && incubator.recognition.length > 0 && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/20 px-6 py-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted mb-2">As seen in</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm font-medium text-growthlab-slate">
            {incubator.recognition.map((name) => (
              <span key={name}>{name}</span>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
            <CardContent className="p-6 sm:p-8">
              <p className="text-xs font-medium uppercase tracking-wider text-muted mb-1">Overview</p>
              <h2 className="text-lg font-semibold text-growthlab-slate mb-5">Key metrics</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {incubator.duration && (
                  <div className="rounded-xl bg-primary/10 dark:bg-primary/15 border border-primary/20 p-4 text-center">
                    <p className="text-sm font-bold text-primary">{incubator.duration}</p>
                    <p className="text-xs text-muted mt-0.5">Duration</p>
                  </div>
                )}
                {incubator.funding && (
                  <div className="rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-600 p-4 text-center">
                    <p className="text-sm font-bold text-growthlab-slate">{incubator.funding}</p>
                    <p className="text-xs text-muted mt-0.5">Funding</p>
                  </div>
                )}
                {incubator.cohortSize && (
                  <div className="rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-600 p-4 text-center">
                    <p className="text-sm font-bold text-growthlab-slate">{incubator.cohortSize}</p>
                    <p className="text-xs text-muted mt-0.5">Cohort</p>
                  </div>
                )}
                {incubator.successRate && (
                  <div className="rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-600 p-4 text-center">
                    <p className="text-sm font-bold text-growthlab-slate">{incubator.successRate}</p>
                    <p className="text-xs text-muted mt-0.5">Success rate</p>
                  </div>
                )}
                {incubator.alumniCount != null && (
                  <div className="rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-600 p-4 text-center">
                    <p className="text-xl font-bold text-growthlab-slate">{incubator.alumniCount}</p>
                    <p className="text-xs text-muted mt-0.5">Alumni</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {incubator.about && (
            <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 border-l-4 border-l-primary/50 overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <p className="text-xs font-medium uppercase tracking-wider text-muted mb-1">Background</p>
                <h2 className="text-lg font-semibold text-growthlab-slate mb-4">About</h2>
                <p className="text-muted text-sm leading-relaxed whitespace-pre-line">{incubator.about}</p>
              </CardContent>
            </Card>
          )}

          {incubator.industries.length > 0 && (
            <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <p className="text-xs font-medium uppercase tracking-wider text-muted mb-1">Focus</p>
                <h2 className="text-lg font-semibold text-growthlab-slate mb-4">Industries</h2>
                <div className="flex flex-wrap gap-2">
                  {incubator.industries.map((ind) => (
                    <span key={ind} className="rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 px-3 py-1.5 text-sm font-medium text-growthlab-slate">
                      {ind}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {incubator.howToApply && (
            <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 border-l-4 border-l-primary/50 overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <p className="text-xs font-medium uppercase tracking-wider text-muted mb-1">Process</p>
                <h2 className="text-lg font-semibold text-growthlab-slate mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  How to apply
                </h2>
                <p className="text-muted text-sm leading-relaxed whitespace-pre-line mb-4">{incubator.howToApply}</p>
                <div className="flex items-start gap-2 rounded-lg bg-primary/5 dark:bg-primary/10 border border-primary/20 p-3 text-sm text-growthlab-slate">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                  <span>Use the Apply button above to submit your application. The program team will review and get in touch.</span>
                </div>
              </CardContent>
            </Card>
          )}

          {incubator.faqs && incubator.faqs.length > 0 && (
            <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <p className="text-xs font-medium uppercase tracking-wider text-muted mb-1">Common questions</p>
                <h2 className="text-lg font-semibold text-growthlab-slate mb-4">FAQ</h2>
                <dl className="space-y-4">
                  {incubator.faqs.map((faq, i) => (
                    <div key={i}>
                      <dt className="text-sm font-medium text-growthlab-slate mb-1">{faq.question}</dt>
                      <dd className="text-sm text-muted pl-0">{faq.answer}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {incubator.views != null && (
            <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-sm text-muted mb-4">
                  <Eye className="h-4 w-4 text-primary" />
                  <span><strong className="font-semibold text-growthlab-slate">{formatCount(incubator.views)}</strong> profile views</span>
                </div>
                <Button size="sm" variant="outline" className="w-full rounded-lg border-slate-300 dark:border-slate-600" onClick={() => setGettingUpdates(!gettingUpdates)}>
                  <Bell className={cn('mr-2 h-4 w-4', gettingUpdates && 'fill-current text-primary')} />
                  {gettingUpdates ? 'Getting updates' : 'Get updates'}
                </Button>
              </CardContent>
            </Card>
          )}
          <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 lg:sticky lg:top-24">
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold text-growthlab-slate mb-4">Quick info</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 shrink-0 text-muted" />
                  <span className="text-growthlab-slate">{incubator.location}</span>
                </li>
                {incubator.duration && (
                  <li className="flex items-center gap-3">
                    <Clock className="h-4 w-4 shrink-0 text-muted" />
                    <span className="text-growthlab-slate">{incubator.duration}</span>
                  </li>
                )}
                {incubator.nextIntake && (
                  <li className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 shrink-0 text-muted" />
                    <span className="text-growthlab-slate">{incubator.nextIntake}</span>
                  </li>
                )}
                {incubator.website && (
                  <li>
                    <a href={incubator.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:underline font-medium">
                      Visit website
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>

          {peopleAlsoViewed.length > 0 && (
            <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50">
              <CardContent className="p-6">
                <p className="text-xs font-medium uppercase tracking-wider text-muted mb-2">Activity</p>
                <h3 className="text-sm font-semibold text-growthlab-slate mb-3">People also viewed</h3>
                <ul className="space-y-2">
                  {peopleAlsoViewed.map((i) => (
                    <li key={i.id}>
                      <Link
                        href={`/incubators-accelerators/${i.id}`}
                        className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-600 p-3 hover:border-primary/50 hover:bg-primary/[0.04] dark:hover:bg-primary/10 transition-colors"
                      >
                        <div className="h-10 w-10 shrink-0 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center">
                          {i.logo ? <img src={i.logo} alt="" className="h-full w-full object-cover" /> : <Rocket className="h-5 w-5 text-primary" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-growthlab-slate truncate">{i.name}</p>
                          <p className="text-xs text-muted">{i.type} · {i.location}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {similar.length > 0 && (
            <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50">
              <CardContent className="p-6">
                <p className="text-xs font-medium uppercase tracking-wider text-muted mb-2">Discover</p>
                <h3 className="text-sm font-semibold text-growthlab-slate mb-3">Similar programs</h3>
                <ul className="space-y-1">
                  {similar.map((i) => (
                    <li key={i.id}>
                      <Link href={`/incubators-accelerators/${i.id}`} className="flex items-center justify-between gap-2 rounded-lg py-2.5 px-2 -mx-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-growthlab-slate group transition-colors">
                        <span className="font-medium text-sm truncate group-hover:text-primary">{i.name}</span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted" />
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href="/incubators-accelerators" className="mt-3 inline-flex items-center text-sm font-medium text-primary hover:underline">
                  View all programs
                  <ChevronRight className="h-4 w-4 ml-0.5" />
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <MobileDetailActionBar>
        <Link href="/messages" className="block">
          <Button size="sm" className="w-full min-h-11 rounded-xl btn-primary">
            <MessageCircle className="mr-2 h-4 w-4" />
            Message
          </Button>
        </Link>
      </MobileDetailActionBar>

      {incubator && (
        <IncubatorProfileEditDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          incubator={incubator}
          onSave={(data) => {
            const next = { ...incubator, ...data } as Incubator;
            setEditedData((prev) => ({ ...prev, ...data }));
            if (id === 'me') setMyIncubatorInStorage(next);
          }}
        />
      )}
    </div>
  );
}
