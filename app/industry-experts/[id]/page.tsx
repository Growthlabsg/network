'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  MapPin,
  Star,
  Award,
  MessageCircle,
  Share2,
  ExternalLink,
  Bookmark,
  FileText,
  Lightbulb,
  ChevronRight,
  Clock,
  DollarSign,
  CheckCircle,
  Pencil,
  Eye,
  User,
} from 'lucide-react';
import { ExpertProfileEditDialog } from '@/components/expert/expert-profile-edit-dialog';
import { getExpertById, getSimilarExperts, getPeopleAlsoViewedExperts, type IndustryExpert } from '@/lib/mock-industry-experts';
import { getMyExpertFromStorage, setMyExpertInStorage } from '@/lib/expert-me';
import { cn, formatCount } from '@/lib/utils';
import { MobileDetailActionBar } from '@/components/network/mobile-detail-action-bar';

export default function IndustryExpertDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === 'string' ? params.id : '';
  const [myExpert, setMyExpert] = useState<IndustryExpert | null | undefined>(undefined);
  const sourceExpert = useMemo(() => {
    if (id === 'me') return myExpert ?? null;
    return id ? getExpertById(id) : undefined;
  }, [id, myExpert]);
  const [editedData, setEditedData] = useState<Partial<IndustryExpert> | null>(null);
  const expert = useMemo<IndustryExpert | undefined>(() => {
    if (!sourceExpert) return undefined;
    if (!editedData) return sourceExpert;
    return { ...sourceExpert, ...editedData } as IndustryExpert;
  }, [sourceExpert, editedData]);
  const similar = expert && expert.id !== 'me' ? getSimilarExperts(expert) : [];
  const peopleAlsoViewed = id && id !== 'me' ? getPeopleAlsoViewedExperts(id) : [];

  useEffect(() => {
    if (id === 'me') setMyExpert(getMyExpertFromStorage());
  }, [id]);

  useEffect(() => {
    if (id === 'me' && myExpert === null) router.replace('/industry-experts/create');
  }, [id, myExpert, router]);

  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

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
              <User className="h-7 w-7" />
            </div>
            <h2 className="text-lg font-semibold text-growthlab-slate mb-2">Expert not found</h2>
            <p className="text-sm text-muted mb-6">The profile may have been removed or the link is incorrect.</p>
            <Link href="/industry-experts">
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

  if (id === 'me' && myExpert === undefined) {
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

  if (!expert) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <Card className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20">
          <CardContent className="p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-muted mb-4">
              <User className="h-7 w-7" />
            </div>
            <h2 className="text-lg font-semibold text-growthlab-slate mb-2">Expert not found</h2>
            <p className="text-sm text-muted mb-6">The profile may have been removed or the link is incorrect.</p>
            <Link href="/industry-experts">
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

  const subtitle = [expert.title, expert.company, expert.location].filter(Boolean).join(' • ');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8 pb-24 md:pb-0">
      <nav className="flex items-center gap-2 text-sm text-muted" aria-label="Breadcrumb">
        <Link href="/industry-experts" className="hover:text-primary transition-colors">
          Industry Experts
        </Link>
        <span className="text-slate-300 dark:text-slate-600">/</span>
        <span className="font-medium text-growthlab-slate truncate">{expert.name}</span>
      </nav>

      <section className="relative overflow-hidden rounded-t-2xl shadow-sm" aria-hidden>
        {expert.banner ? (
          <div className="aspect-[3/1] min-h-[140px] max-h-[200px] w-full">
            <img src={expert.banner} alt="" className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="aspect-[3/1] min-h-[140px] max-h-[200px] w-full gs-gradient rounded-t-2xl" />
        )}
      </section>

      <div className="relative -mt-16 sm:-mt-20 px-4 sm:px-6">
        <div className="flex h-24 w-24 sm:h-28 sm:w-28 rounded-full border-4 border-white dark:border-slate-900 bg-white dark:bg-slate-900 shadow-lg overflow-hidden ring-1 ring-slate-200/50 dark:ring-slate-700/50 items-center justify-center">
          {expert.logo ? (
            <img src={expert.logo} alt={`${expert.name}`} className="h-full w-full object-cover" />
          ) : (
            <span className="text-2xl font-semibold text-muted">
              {expert.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </span>
          )}
        </div>
      </div>

      <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden -mt-2">
        <CardContent className="p-6 sm:p-8 pt-10 sm:pt-12">
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-growthlab-slate">{expert.name}</h1>
                  {subtitle && <p className="text-muted text-sm sm:text-base mt-1">{subtitle}</p>}
                </div>
                {id === 'me' && (
                  <Button size="sm" variant="outline" className="rounded-lg border-slate-300 dark:border-slate-600 shrink-0" onClick={() => setEditOpen(true)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit profile
                  </Button>
                )}
              </div>
              <p className="text-muted mt-2 max-w-2xl">{expert.description}</p>
              <div className="flex flex-wrap items-center gap-2 mt-3">
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
                <span className="flex items-center gap-1 text-sm text-muted">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {expert.rating}
                  {expert.reviewCount != null && ` (${expert.reviewCount} reviews)`}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-2">
            <Button size="sm" className="btn-primary rounded-lg">
              <MessageCircle className="mr-2 h-4 w-4" /> Connect
            </Button>
            <Button size="sm" variant="outline" className="rounded-lg border-slate-300 dark:border-slate-600" asChild>
              <Link href="/messages">
                <MessageCircle className="mr-2 h-4 w-4" /> Message
              </Link>
            </Button>
            <Button size="sm" variant="outline" className="rounded-lg border-slate-300 dark:border-slate-600" onClick={copyLink} aria-label={copied ? 'Link copied' : 'Copy profile link'}>
              {copied ? <CheckCircle className="mr-2 h-4 w-4 text-primary" /> : <Share2 className="mr-2 h-4 w-4" />}
              {copied ? 'Copied' : 'Share'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className={cn('rounded-lg border-slate-300 dark:border-slate-600', saved && 'bg-rose-500/10 border-rose-500/30 text-rose-700')}
              onClick={() => setSaved(!saved)}
            >
              <Bookmark className={cn('mr-2 h-4 w-4', saved && 'fill-current')} />
              {saved ? 'Saved' : 'Save'}
            </Button>
            {expert.website && (
              <a
                href={expert.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-growthlab-slate hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Website
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            )}
          </div>
        </CardContent>
      </Card>

      {expert.recognition && expert.recognition.length > 0 && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/20 px-6 py-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted mb-2">As seen in</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm font-medium text-growthlab-slate">
            {expert.recognition.map((name) => (
              <span key={name}>{name}</span>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
        <div className="lg:col-span-2 space-y-6">
          {expert.about && (
            <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <p className="text-xs font-medium uppercase tracking-wider text-muted mb-1">Background</p>
                <h2 className="text-lg font-semibold text-growthlab-slate mb-4">About</h2>
                <p className="text-muted text-sm leading-relaxed whitespace-pre-line">{expert.about}</p>
              </CardContent>
            </Card>
          )}

          {expert.expertise.length > 0 && (
            <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <p className="text-xs font-medium uppercase tracking-wider text-muted mb-1">Focus</p>
                <h2 className="text-lg font-semibold text-growthlab-slate mb-4">Expertise</h2>
                <div className="flex flex-wrap gap-2">
                  {expert.expertise.map((tag) => (
                    <span key={tag} className="rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 px-3 py-1.5 text-sm font-medium text-growthlab-slate dark:text-slate-200">
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {expert.keyInsights && expert.keyInsights.length > 0 && (
            <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 border-l-4 border-l-primary/50 overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <p className="text-xs font-medium uppercase tracking-wider text-muted mb-1">Advice</p>
                <h2 className="text-lg font-semibold text-growthlab-slate mb-4 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Key insights
                </h2>
                <ul className="space-y-2">
                  {expert.keyInsights.map((insight, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-growthlab-slate">
                      <CheckCircle className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {expert.howToApply && (
            <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <p className="text-xs font-medium uppercase tracking-wider text-muted mb-1">Process</p>
                <h2 className="text-lg font-semibold text-growthlab-slate mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  How to connect
                </h2>
                <p className="text-muted text-sm leading-relaxed whitespace-pre-line">{expert.howToApply}</p>
              </CardContent>
            </Card>
          )}

          {expert.faqs && expert.faqs.length > 0 && (
            <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <p className="text-xs font-medium uppercase tracking-wider text-muted mb-1">Common questions</p>
                <h2 className="text-lg font-semibold text-growthlab-slate mb-4">FAQ</h2>
                <dl className="space-y-4">
                  {expert.faqs.map((faq, i) => (
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
          {expert.views != null && expert.views > 0 && (
            <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Eye className="h-4 w-4 text-primary" />
                  <span><strong className="font-semibold text-growthlab-slate">{formatCount(expert.views)}</strong> profile views</span>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 lg:sticky lg:top-24">
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold text-growthlab-slate mb-4">Quick info</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 shrink-0 text-muted" />
                  <span className="text-growthlab-slate">{expert.location}</span>
                </li>
                {expert.experience && (
                  <li className="flex items-center gap-3">
                    <Clock className="h-4 w-4 shrink-0 text-muted" />
                    <span className="text-growthlab-slate">{expert.experience}</span>
                  </li>
                )}
                {expert.hourlyRate && (
                  <li className="flex items-center gap-3">
                    <DollarSign className="h-4 w-4 shrink-0 text-muted" />
                    <span className="text-growthlab-slate">{expert.hourlyRate}</span>
                  </li>
                )}
                {expert.availability && (
                  <li className="text-growthlab-slate font-medium">{expert.availability}</li>
                )}
                {expert.website && (
                  <li>
                    <a href={expert.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:underline font-medium">
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
                  {peopleAlsoViewed.map((e) => (
                    <li key={e.id}>
                      <Link
                        href={`/industry-experts/${e.id}`}
                        className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-600 p-3 hover:border-primary/50 hover:bg-primary/[0.04] dark:hover:bg-primary/10 transition-colors"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          {e.logo ? <img src={e.logo} alt="" className="h-full w-full object-cover" /> : <User className="h-5 w-5 text-muted" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-growthlab-slate truncate">{e.name}</p>
                          <p className="text-xs text-muted">{e.title ?? ''} · {e.location}</p>
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
                <h3 className="text-sm font-semibold text-growthlab-slate mb-3">Similar experts</h3>
                <ul className="space-y-1">
                  {similar.map((e) => (
                    <li key={e.id}>
                      <Link
                        href={`/industry-experts/${e.id}`}
                        className="flex items-center justify-between gap-2 rounded-lg py-2.5 px-2 -mx-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-growthlab-slate group transition-colors"
                      >
                        <span className="font-medium text-sm truncate group-hover:text-primary">{e.name}</span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted" />
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href="/industry-experts" className="mt-3 inline-flex items-center text-sm font-medium text-primary hover:underline">
                  View all experts
                  <ChevronRight className="h-4 w-4 ml-0.5" />
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {expert && (
        <ExpertProfileEditDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          expert={expert}
          onSave={(data) => {
            const next = { ...expert, ...data } as IndustryExpert;
            setEditedData((prev) => ({ ...prev, ...data }));
            if (id === 'me') setMyExpertInStorage(next);
          }}
        />
      )}

      <MobileDetailActionBar>
        <div className="flex gap-3">
          <Button size="sm" className="flex-1 min-h-11 rounded-xl btn-primary" asChild>
            <Link href="/messages">Connect</Link>
          </Button>
          <Link href="/messages" className="flex-1 min-h-11">
            <Button size="sm" variant="outline" className="w-full min-h-11 rounded-xl border-slate-300 dark:border-slate-600">
              <MessageCircle className="mr-2 h-4 w-4" />
              Message
            </Button>
          </Link>
        </div>
      </MobileDetailActionBar>
    </div>
  );
}
