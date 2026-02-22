'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Building2,
  MapPin,
  DollarSign,
  Users,
  Star,
  Award,
  MessageCircle,
  Share2,
  ExternalLink,
  Bookmark,
  Target,
  FileText,
  Briefcase,
  ChevronRight,
  Calendar,
  Clock,
  CheckCircle2,
  Lightbulb,
  Globe,
  Linkedin,
  Twitter,
  CheckCircle,
  Pencil,
  Eye,
  Bell,
} from 'lucide-react';
import { SendConnectionRequestDialog } from '@/components/connection/send-connection-request-dialog';
import { InvestorProfileEditDialog } from '@/components/investor/investor-profile-edit-dialog';
import { getInvestorById, getSimilarInvestors, getPeopleAlsoViewedInvestors, type Investor } from '@/lib/mock-investors';
import { getMyInvestorFromStorage, setMyInvestorInStorage } from '@/lib/investor-me';
import { cn, formatCount } from '@/lib/utils';
import { MobileDetailActionBar } from '@/components/network/mobile-detail-action-bar';

export default function InvestorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === 'string' ? params.id : '';
  const [myInvestor, setMyInvestor] = useState<Investor | null | undefined>(undefined);
  const sourceInvestor = useMemo(() => {
    if (id === 'me') return myInvestor ?? null;
    return id ? getInvestorById(id) : undefined;
  }, [id, myInvestor]);
  const [editedData, setEditedData] = useState<Partial<Investor> | null>(null);
  const investor = useMemo<Investor | undefined>(() => {
    if (!sourceInvestor) return undefined;
    if (!editedData) return sourceInvestor;
    return { ...sourceInvestor, ...editedData } as Investor;
  }, [sourceInvestor, editedData]);
  const similar = investor && investor.id !== 'me' ? getSimilarInvestors(investor) : [];
  const peopleAlsoViewed = id && id !== 'me' ? getPeopleAlsoViewedInvestors(id) : [];

  useEffect(() => {
    if (id === 'me') setMyInvestor(getMyInvestorFromStorage());
  }, [id]);

  useEffect(() => {
    if (id === 'me' && myInvestor === null) router.replace('/investors/create');
  }, [id, myInvestor, router]);
  const [saved, setSaved] = useState(false);
  const [connectionRequested, setConnectionRequested] = useState(false);
  const [connectionDialogOpen, setConnectionDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [gettingUpdates, setGettingUpdates] = useState(false);

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
              <Building2 className="h-7 w-7" />
            </div>
            <h2 className="text-lg font-semibold text-growthlab-slate mb-2">Investor not found</h2>
            <p className="text-sm text-muted mb-6">The profile may have been removed or the link is incorrect.</p>
            <Link href="/investors">
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

  if (id === 'me' && myInvestor === undefined) {
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

  if (!investor) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <Card className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20">
          <CardContent className="p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-muted mb-4">
              <Building2 className="h-7 w-7" />
            </div>
            <h2 className="text-lg font-semibold text-growthlab-slate mb-2">Investor not found</h2>
            <p className="text-sm text-muted mb-6">The profile may have been removed or the link is incorrect.</p>
            <Link href="/investors">
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
        <Link href="/investors" className="hover:text-primary transition-colors">
          Investor directory
        </Link>
        <span className="text-slate-300 dark:text-slate-600">/</span>
        <span className="font-medium text-growthlab-slate truncate">{investor.name}</span>
      </nav>

      {/* Hero banner – real image if uploaded */}
      <section className="relative overflow-hidden rounded-t-2xl shadow-sm" aria-hidden>
        {investor.banner ? (
          <div className="aspect-[3/1] min-h-[140px] max-h-[200px] w-full">
            <img src={investor.banner} alt="" className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="aspect-[3/1] min-h-[140px] max-h-[200px] w-full gs-gradient rounded-t-2xl" />
        )}
      </section>

      {/* Profile pic / logo – real image if uploaded */}
      <div className="relative -mt-16 sm:-mt-20 px-4 sm:px-6">
        <div className="flex h-24 w-24 sm:h-28 sm:w-28 rounded-2xl border-4 border-white dark:border-slate-900 bg-white dark:bg-slate-900 shadow-lg overflow-hidden ring-1 ring-slate-200/50 dark:ring-slate-700/50 items-center justify-center">
          {investor.logo ? (
            <img src={investor.logo} alt={`${investor.name} logo`} className="h-full w-full object-cover" />
          ) : (
            <Building2 className="h-12 w-12 sm:h-14 sm:w-14 text-primary" />
          )}
        </div>
      </div>

      <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden -mt-2">
        <CardContent className="p-6 sm:p-8 pt-10 sm:pt-12">
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-growthlab-slate">{investor.name}</h1>
                  {investor.tagline && <p className="text-muted text-sm sm:text-base mt-1">{investor.tagline}</p>}
                </div>
                <Button size="sm" variant="outline" className="rounded-lg border-slate-300 dark:border-slate-600 shrink-0" onClick={() => setEditOpen(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit profile
                </Button>
              </div>
              <p className="text-muted mt-2 max-w-2xl">{investor.description}</p>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {investor.verified && (
                  <span className="inline-flex items-center rounded-md bg-primary/12 text-primary dark:bg-primary/20 dark:text-primary text-xs font-medium px-2 py-0.5 border border-primary/25 dark:border-primary/30">
                    <Award className="h-3 w-3 mr-1" />
                    Verified
                  </span>
                )}
                {investor.featured && (
                  <span className="inline-flex items-center rounded-md bg-primary/12 text-primary text-xs font-medium px-2 py-0.5 border border-primary/25">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Featured
                  </span>
                )}
                <span className="flex items-center gap-1 text-sm text-muted">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {investor.rating} rating
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 text-sm text-muted">
                <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-medium text-growthlab-slate">
                  {investor.type}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  {investor.location}
                </span>
                {investor.foundedYear && (
                  <>
                    <span aria-hidden>·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 shrink-0" />
                      Since {investor.foundedYear}
                    </span>
                  </>
                )}
                <span aria-hidden>·</span>
                <span>{investor.portfolioCount} portfolio companies</span>
              </div>
              {investor.contactPrivate && (
                <p className="text-xs text-muted mt-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 p-3 border border-slate-200 dark:border-slate-600 max-w-2xl">
                  This investor prefers to be contacted via in-app message. Send a connection request; once they accept, you can message them here — no need to share email.
                </p>
              )}
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              className="btn-primary rounded-lg"
              onClick={() => !connectionRequested && setConnectionDialogOpen(true)}
              disabled={connectionRequested}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              {connectionRequested ? 'Request sent — message in-app once they accept' : 'Request to connect'}
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
            {!investor.contactPrivate && investor.website && (
              <a
                href={investor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-growthlab-slate hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Website
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            )}
            {(investor.linkedIn || investor.twitter) && (
              <div className="flex items-center gap-2">
                {investor.linkedIn && (
                  <a href={investor.linkedIn} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-slate-300 dark:border-slate-600 p-2 text-growthlab-slate hover:bg-slate-50 dark:hover:bg-slate-800" aria-label="LinkedIn">
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
                {investor.twitter && (
                  <a href={investor.twitter.startsWith('http') ? investor.twitter : `https://twitter.com/${investor.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-slate-300 dark:border-slate-600 p-2 text-growthlab-slate hover:bg-slate-50 dark:hover:bg-slate-800" aria-label="Twitter">
                    <Twitter className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* As seen in – credibility strip */}
      {investor.recognition && investor.recognition.length > 0 && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/20 px-6 py-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted mb-2">As seen in</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm font-medium text-growthlab-slate">
            {investor.recognition.map((name) => (
              <span key={name}>{name}</span>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
        <div className="lg:col-span-2 space-y-6">
          {/* Overview / Key metrics */}
          <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
            <CardContent className="p-6 sm:p-8">
              <p className="text-xs font-medium uppercase tracking-wider text-muted mb-1">Overview</p>
              <h2 className="text-lg font-semibold text-growthlab-slate mb-5">Key metrics</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-xl bg-primary/10 dark:bg-primary/15 border border-primary/20 p-4 text-center">
                  <p className="text-xl font-bold text-primary">{investor.investmentRange}</p>
                  <p className="text-xs text-muted mt-0.5">Check size</p>
                </div>
                <div className="rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-600 p-4 text-center">
                  <p className="text-xl font-bold text-growthlab-slate">{investor.portfolioCount}</p>
                  <p className="text-xs text-muted mt-0.5">Portfolio companies</p>
                </div>
                {investor.responseTime && (
                  <div className="rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-600 p-4 text-center">
                    <p className="text-sm font-bold text-growthlab-slate">{investor.responseTime}</p>
                    <p className="text-xs text-muted mt-0.5">Response time</p>
                  </div>
                )}
                {investor.activeDeals && (
                  <div className="rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 p-4 text-center">
                    <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{investor.activeDeals}</p>
                    <p className="text-xs text-muted mt-0.5">Status</p>
                  </div>
                )}
                {investor.dealsLast12Months != null && (
                  <div className="rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 p-4 text-center">
                    <p className="text-xl font-bold text-amber-700 dark:text-amber-400">{investor.dealsLast12Months}</p>
                    <p className="text-xs text-muted mt-0.5">Deals (last 12 mo)</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Investment criteria */}
          <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 border-l-4 border-l-primary/50 overflow-hidden">
            <CardContent className="p-6 sm:p-8">
              <p className="text-xs font-medium uppercase tracking-wider text-muted mb-1">For founders</p>
              <h2 className="text-lg font-semibold text-growthlab-slate mb-5 flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Investment criteria
              </h2>
              <dl className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-muted font-medium mb-1">Check size</dt>
                  <dd className="text-growthlab-slate font-semibold">{investor.investmentRange}</dd>
                </div>
                {investor.stages && investor.stages.length > 0 && (
                  <div>
                    <dt className="text-muted font-medium mb-1">Stages</dt>
                    <dd className="flex flex-wrap gap-1.5">
                      {investor.stages.map((s) => (
                        <span key={s} className="rounded-md bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-growthlab-slate">
                          {s}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
                <div className="sm:col-span-2">
                  <dt className="text-muted font-medium mb-1">Focus</dt>
                  <dd className="text-growthlab-slate">{investor.focus}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-muted font-medium mb-2">Industries</dt>
                  <dd className="flex flex-wrap gap-2">
                    {investor.industries.map((ind) => (
                      <span
                        key={ind}
                        className="rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 px-3 py-1.5 text-xs font-medium text-growthlab-slate"
                      >
                        {ind}
                      </span>
                    ))}
                  </dd>
                </div>
                {investor.preferredIntro && (
                  <div>
                    <dt className="text-muted font-medium mb-1">Preferred intro</dt>
                    <dd className="text-growthlab-slate capitalize">{investor.preferredIntro}</dd>
                  </div>
                )}
                {investor.leadOrFollow && (
                  <div>
                    <dt className="text-muted font-medium mb-1">Lead or follow</dt>
                    <dd className="text-growthlab-slate font-medium">{investor.leadOrFollow}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          {investor.investmentThesis && (
            <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <p className="text-xs font-medium uppercase tracking-wider text-muted mb-1">Thesis</p>
                <h2 className="text-lg font-semibold text-growthlab-slate mb-3 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Why we invest
                </h2>
                <p className="text-muted text-sm leading-relaxed">{investor.investmentThesis}</p>
              </CardContent>
            </Card>
          )}

          {investor.companyStory && (
            <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <p className="text-xs font-medium uppercase tracking-wider text-muted mb-1">Company</p>
                <h2 className="text-lg font-semibold text-growthlab-slate mb-4">Our story</h2>
                <p className="text-muted text-sm leading-relaxed whitespace-pre-line">{investor.companyStory}</p>
              </CardContent>
            </Card>
          )}

          {investor.about && (
            <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <p className="text-xs font-medium uppercase tracking-wider text-muted mb-1">Background</p>
                <h2 className="text-lg font-semibold text-growthlab-slate mb-4">About</h2>
                <p className="text-muted text-sm leading-relaxed whitespace-pre-line">{investor.about}</p>
              </CardContent>
            </Card>
          )}

          {investor.keyFacts && investor.keyFacts.length > 0 && (
            <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <p className="text-xs font-medium uppercase tracking-wider text-muted mb-1">Highlights</p>
                <h2 className="text-lg font-semibold text-growthlab-slate mb-4">Key facts</h2>
                <ul className="space-y-2">
                  {investor.keyFacts.map((fact, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-growthlab-slate">
                      <CheckCircle className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {investor.geographies && investor.geographies.length > 0 && (
            <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <p className="text-xs font-medium uppercase tracking-wider text-muted mb-1">Coverage</p>
                <h2 className="text-lg font-semibold text-growthlab-slate mb-4 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Geographies
                </h2>
                <div className="flex flex-wrap gap-2">
                  {investor.geographies.map((g) => (
                    <span key={g} className="rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 px-3 py-1.5 text-sm font-medium text-growthlab-slate">
                      {g}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {investor.howToApply && (
            <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <p className="text-xs font-medium uppercase tracking-wider text-muted mb-1">Process</p>
                <h2 className="text-lg font-semibold text-growthlab-slate mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  How to apply
                </h2>
                <p className="text-muted text-sm leading-relaxed whitespace-pre-line mb-4">{investor.howToApply}</p>
                <div className="flex items-start gap-2 rounded-lg bg-primary/5 dark:bg-primary/10 border border-primary/20 p-3 text-sm text-growthlab-slate">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                  <span>Send a connection request above to start the conversation. Once accepted, you can share your deck and message in-app.</span>
                </div>
              </CardContent>
            </Card>
          )}

          {investor.faqs && investor.faqs.length > 0 && (
            <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <p className="text-xs font-medium uppercase tracking-wider text-muted mb-1">Common questions</p>
                <h2 className="text-lg font-semibold text-growthlab-slate mb-4">FAQ</h2>
                <dl className="space-y-4">
                  {investor.faqs.map((faq, i) => (
                    <div key={i}>
                      <dt className="text-sm font-medium text-growthlab-slate mb-1">{faq.question}</dt>
                      <dd className="text-sm text-muted pl-0">{faq.answer}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          )}

          {investor.portfolioHighlights && investor.portfolioHighlights.length > 0 && (
            <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <p className="text-xs font-medium uppercase tracking-wider text-muted mb-1">Track record</p>
                <h2 className="text-lg font-semibold text-growthlab-slate mb-4 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Notable portfolio
                </h2>
                <div className="flex flex-wrap gap-3">
                  {investor.portfolioHighlights.map((name) => (
                    <span
                      key={name}
                      className="rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 px-4 py-2.5 text-sm font-medium text-growthlab-slate"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {investor.views != null && (
            <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-sm text-muted mb-4">
                  <Eye className="h-4 w-4 text-primary" />
                  <span><strong className="font-semibold text-growthlab-slate">{formatCount(investor.views)}</strong> profile views</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full rounded-lg border-slate-300 dark:border-slate-600"
                  onClick={() => setGettingUpdates(!gettingUpdates)}
                >
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
                  <span className="text-growthlab-slate">{investor.location}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 shrink-0 text-muted" />
                  <span className="text-growthlab-slate">{investor.type}</span>
                </li>
                {investor.foundedYear && (
                  <li className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 shrink-0 text-muted" />
                    <span className="text-growthlab-slate">Since {investor.foundedYear}</span>
                  </li>
                )}
                {investor.responseTime && (
                  <li className="flex items-center gap-3">
                    <Clock className="h-4 w-4 shrink-0 text-muted" />
                    <span className="text-growthlab-slate">{investor.responseTime}</span>
                  </li>
                )}
                {investor.avgResponseDays != null && (
                  <li className="flex items-center gap-3 text-sm text-muted">
                    <span className="text-growthlab-slate font-medium">~{investor.avgResponseDays} days</span> avg response
                  </li>
                )}
                {investor.dealsLast12Months != null && (
                  <li className="flex items-center gap-3">
                    <Briefcase className="h-4 w-4 shrink-0 text-muted" />
                    <span className="text-growthlab-slate">{investor.dealsLast12Months} deals (12 mo)</span>
                  </li>
                )}
                {investor.views != null && (
                  <li className="flex items-center gap-3 text-sm text-muted">
                    <Eye className="h-4 w-4 shrink-0" />
                    <span><strong className="font-semibold text-growthlab-slate">{formatCount(investor.views)}</strong> profile views</span>
                  </li>
                )}
                {investor.teamSize && (
                  <li className="flex items-center gap-3">
                    <Users className="h-4 w-4 shrink-0 text-muted" />
                    <span className="text-growthlab-slate">{investor.teamSize}</span>
                  </li>
                )}
                {!investor.contactPrivate && investor.website && (
                  <li>
                    <a
                      href={investor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                    >
                      Visit website
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </li>
                )}
                {(investor.linkedIn || investor.twitter) && (
                  <li className="flex items-center gap-2 pt-1">
                    {investor.linkedIn && (
                      <a href={investor.linkedIn} target="_blank" rel="noopener noreferrer" className="rounded-lg p-2 border border-slate-200 dark:border-slate-600 text-growthlab-slate hover:bg-slate-50 dark:hover:bg-slate-800" aria-label="LinkedIn">
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                    {investor.twitter && (
                      <a href={investor.twitter.startsWith('http') ? investor.twitter : `https://twitter.com/${investor.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="rounded-lg p-2 border border-slate-200 dark:border-slate-600 text-growthlab-slate hover:bg-slate-50 dark:hover:bg-slate-800" aria-label="Twitter">
                        <Twitter className="h-4 w-4" />
                      </a>
                    )}
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50">
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold text-growthlab-slate mb-3">Focus areas</h3>
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
            </CardContent>
          </Card>

          {peopleAlsoViewed.length > 0 && (
            <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50">
              <CardContent className="p-6">
                <p className="text-xs font-medium uppercase tracking-wider text-muted mb-2">Activity</p>
                <h3 className="text-sm font-semibold text-growthlab-slate mb-3">People also viewed</h3>
                <ul className="space-y-2">
                  {peopleAlsoViewed.map((inv) => (
                    <li key={inv.id}>
                      <Link
                        href={`/investors/${inv.id}`}
                        className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-600 p-3 hover:border-primary/50 hover:bg-primary/[0.04] dark:hover:bg-primary/10 transition-colors"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          {inv.logo ? (
                            <img src={inv.logo} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <Building2 className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-growthlab-slate truncate">{inv.name}</p>
                          <p className="text-xs text-muted">{inv.type} · {inv.location}</p>
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
                <h3 className="text-sm font-semibold text-growthlab-slate mb-3">Similar investors</h3>
                <ul className="space-y-1">
                  {similar.map((inv) => (
                    <li key={inv.id}>
                      <Link
                        href={`/investors/${inv.id}`}
                        className="flex items-center justify-between gap-2 rounded-lg py-2.5 px-2 -mx-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-growthlab-slate group transition-colors"
                      >
                        <span className="font-medium text-sm truncate group-hover:text-primary">{inv.name}</span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted" />
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href="/investors" className="mt-3 inline-flex items-center text-sm font-medium text-primary hover:underline">
                  View all investors
                  <ChevronRight className="h-4 w-4 ml-0.5" />
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {investor && (
        <SendConnectionRequestDialog
          open={connectionDialogOpen}
          onOpenChange={setConnectionDialogOpen}
          targetName={investor.name}
          onSend={() => {
            setConnectionRequested(true);
            setConnectionDialogOpen(false);
          }}
        />
      )}

      {investor && (
        <InvestorProfileEditDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          investor={investor}
          onSave={(data) => {
            const next = { ...investor, ...data } as Investor;
            setEditedData((prev) => ({ ...prev, ...data }));
            if (id === 'me') setMyInvestorInStorage(next);
          }}
        />
      )}

      <MobileDetailActionBar>
        <div className="flex gap-3">
          <Button
            size="sm"
            className="flex-1 min-h-11 rounded-xl btn-primary"
            onClick={() => !connectionRequested && setConnectionDialogOpen(true)}
            disabled={connectionRequested}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            {connectionRequested ? 'Request sent' : 'Request to connect'}
          </Button>
          <Link href="/messages" className="flex-1 min-h-11">
            <Button size="sm" variant="outline" className="w-full min-h-11 rounded-xl border-slate-300 dark:border-slate-600">
              Message
            </Button>
          </Link>
        </div>
      </MobileDetailActionBar>
    </div>
  );
}
