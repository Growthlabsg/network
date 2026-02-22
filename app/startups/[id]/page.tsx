'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Building,
  Calendar,
  DollarSign,
  ExternalLink,
  MessageSquare,
  UserPlus,
  Share2,
  Bookmark,
  Briefcase,
  Rocket,
  ArrowLeft,
  Star,
  Award,
  TrendingUp,
  Users,
  Package,
  Handshake,
  Flag,
  Copy,
  Check,
  Bell,
  Eye,
  FileText,
  Presentation,
  Play,
  Mail,
  Linkedin,
} from 'lucide-react';
import { STARTUPS, getProductsForStartup, getPeopleAlsoViewed, STARTUP_TESTIMONIALS } from '@/lib/mock-startups';
import { cn, formatCount } from '@/lib/utils';
import { MobileDetailActionBar } from '@/components/network/mobile-detail-action-bar';

const MOCK_TEAM = [
  { name: 'Jane Doe', role: 'CEO & Co-founder', bio: 'Ex-Google, 10+ years in enterprise software.', linkedIn: '' },
  { name: 'John Smith', role: 'CTO', bio: 'Former principal engineer at a unicorn fintech.', linkedIn: '' },
];
const MOCK_INVESTORS = [
  { name: 'Singapore Ventures', type: 'VC', round: 'Series A' },
  { name: 'Angel Fund Asia', type: 'Angel syndicate', round: 'Seed' },
];

type MilestoneType = 'funding' | 'product' | 'partnership' | 'team' | 'award' | 'launch';
const MILESTONES: { date: string; type: MilestoneType; title: string; description: string }[] = [
  { date: '2020-06-01', type: 'launch', title: 'Company founded', description: 'Incorporated in Singapore with initial team of 3.' },
  { date: '2021-03-15', type: 'funding', title: 'Seed round closed', description: 'Raised $500K from Angel Fund Asia to build MVP.' },
  { date: '2021-09-01', type: 'product', title: 'Beta launch', description: 'First product release to 50 design partners.' },
  { date: '2022-06-01', type: 'funding', title: 'Series A closed', description: 'Closed $2.5M led by Singapore Ventures.' },
  { date: '2023-01-10', type: 'partnership', title: 'Enterprise partnership', description: 'Strategic partnership with regional enterprise leader.' },
  { date: '2024-01-15', type: 'product', title: 'APAC product launch', description: 'Launched new product line across Asia Pacific.' },
  { date: '2024-06-01', type: 'award', title: 'Industry recognition', description: 'Named top 10 AI startups in Southeast Asia.' },
];
const MILESTONE_LABELS: Record<MilestoneType, string> = {
  funding: 'Funding',
  product: 'Product',
  partnership: 'Partnership',
  team: 'Team',
  award: 'Award',
  launch: 'Launch',
};
function formatMilestoneDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric', day: 'numeric' });
}

const MOCK_TAGLINES: Record<string, string> = {
  '1': 'The LinkedIn for startups — from 0 to 1.',
  '2': 'Smart payments and cashflow for growing SMEs.',
  '3': 'Healthcare powered by AI and data.',
  '4': 'Sustainability and carbon tracking for modern supply chains.',
  '5': 'Deep learning infrastructure for vision and NLP.',
};
const MOCK_PRESS = ['Tech in Asia', 'e27', 'Forbes Asia', 'The Straits Times'];

export default function StartupDetailPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';
  const startup = id ? STARTUPS.find((s) => s.id === id) : undefined;
  const similar = startup ? STARTUPS.filter((s) => s.id !== id && (s.industry === startup.industry || s.stage === startup.stage)).slice(0, 4) : [];
  const peopleAlsoViewed = startup ? getPeopleAlsoViewed(startup.id) : [];
  const products = startup ? getProductsForStartup(startup.id) : [];
  const testimonials = startup ? (STARTUP_TESTIMONIALS[startup.id] ?? []) : [];
  const hasResources = startup && (startup.pitchDeckUrl || startup.onePagerUrl || startup.videoUrl);
  const [saved, setSaved] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [gettingUpdates, setGettingUpdates] = useState(false);
  const [connectionRequested, setConnectionRequested] = useState(false);
  const [introRequested, setIntroRequested] = useState(false);
  const tagline = startup ? MOCK_TAGLINES[startup.id] : undefined;

  const copyProfileLink = () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!id || !startup) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <Card className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20">
          <CardContent className="p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-muted mb-4">
              <Rocket className="h-7 w-7" />
            </div>
            <h2 className="text-lg font-semibold text-growthlab-slate mb-2">Startup not found</h2>
            <p className="text-sm text-muted mb-6">The profile may have been removed or the link is incorrect.</p>
            <Link href="/startups">
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
        <Link href="/startups" className="text-muted hover:text-primary transition-colors">
          Startups
        </Link>
        <span className="text-slate-300 dark:text-slate-600">/</span>
        <span className="font-medium text-growthlab-slate truncate">{startup.name}</span>
      </nav>

      {/* 1. Banner – visual only, no content */}
      <section className="relative overflow-hidden rounded-t-2xl shadow-sm" aria-hidden>
        {startup.coverImage ? (
          <div className="aspect-[3/1] min-h-[140px] max-h-[240px] w-full">
            <img
              src={startup.coverImage}
              alt=""
              className="h-full w-full object-cover"
              role="presentation"
            />
          </div>
        ) : (
          <div className="aspect-[3/1] min-h-[140px] max-h-[240px] w-full gs-gradient rounded-t-2xl" />
        )}
      </section>

      {/* 2. Logo – overlaps banner, separate branding element */}
      <div className="relative -mt-16 sm:-mt-20 px-6 sm:px-8">
        <div className="flex h-24 w-24 sm:h-28 sm:w-28 rounded-2xl border-4 border-white dark:border-slate-900 bg-white dark:bg-slate-900 shadow-lg overflow-hidden ring-1 ring-slate-200/50 dark:ring-slate-700/50">
          {startup.logo ? (
            <img
              src={startup.logo}
              alt={`${startup.name} logo`}
              className="h-full w-full object-contain p-1.5"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-primary">
              <Rocket className="h-10 w-10 sm:h-12 sm:w-12" />
            </div>
          )}
        </div>
      </div>

      {/* Details card – identity, meta, actions */}
      <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden -mt-2">
        <CardContent className="p-6 sm:p-8 pt-8 sm:pt-10">
          <div className="flex flex-col gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-growthlab-slate">{startup.name}</h1>
              {tagline && (
                <p className="text-muted text-sm sm:text-base mt-1 max-w-2xl">{tagline}</p>
              )}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {startup.verified && (
                  <span className="inline-flex items-center rounded-md bg-primary/12 border border-primary/25 px-2 py-0.5 text-xs font-medium text-primary dark:text-primary">
                    <Award className="h-3 w-3 mr-1" />
                    Verified
                  </span>
                )}
                {startup.featured && (
                  <span className="inline-flex items-center rounded-md bg-amber-500/12 border border-amber-500/25 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Featured
                  </span>
                )}
                {startup.trending && (
                  <span className="inline-flex items-center rounded-md bg-violet-500/12 border border-violet-500/25 px-2 py-0.5 text-xs font-medium text-violet-700 dark:text-violet-400">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Trending
                  </span>
                )}
                {startup.hiring && startup.openPositions > 0 && (
                  <span className="inline-flex items-center rounded-md bg-primary/12 border border-primary/25 px-2 py-0.5 text-xs font-medium text-primary">
                    <Briefcase className="h-3 w-3 mr-1" />
                    Hiring · {startup.openPositions} open roles
                  </span>
                )}
              </div>
              <p className="text-muted text-sm sm:text-base leading-relaxed max-w-2xl mt-3">{startup.description}</p>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-3 text-sm text-muted">
                <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-medium text-growthlab-slate">
                  {startup.stage}
                </span>
                <span aria-hidden>·</span>
                <span>{startup.size} employees</span>
                <span aria-hidden>·</span>
                <span>{startup.region}</span>
                <span aria-hidden>·</span>
                <span>{startup.location}</span>
                <span aria-hidden>·</span>
                <span>Founded {startup.foundedYear}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-muted">
                <Eye className="h-3.5 w-3.5" />
                <span>{formatCount(startup.views)} profile views</span>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              className="btn-primary rounded-lg"
              onClick={() => setConnectionRequested(true)}
              disabled={connectionRequested}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              {connectionRequested ? 'Request sent' : 'Connect'}
            </Button>
            <Link
              href="/messages"
              className="inline-flex items-center justify-center gap-2 h-9 px-3 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent font-medium text-growthlab-slate hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <MessageSquare className="h-4 w-4" />
              Message
            </Link>
            {startup.contactEmail && (
              <a
                href={`mailto:${startup.contactEmail}`}
                className="inline-flex items-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-medium text-growthlab-slate hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Mail className="mr-2 h-4 w-4" />
                Contact
              </a>
            )}
            <Button
              size="sm"
              variant="outline"
              className={cn('rounded-lg border-slate-300 dark:border-slate-600', introRequested && 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400')}
              onClick={() => setIntroRequested(true)}
              disabled={introRequested}
            >
              <Handshake className="mr-2 h-4 w-4" />
              {introRequested ? 'Request sent' : 'Request intro'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="rounded-lg border-slate-300 dark:border-slate-600"
              onClick={copyProfileLink}
              aria-label={copied ? 'Link copied' : 'Copy profile link'}
            >
              {copied ? <Check className="mr-2 h-4 w-4 text-emerald-600" /> : <Share2 className="mr-2 h-4 w-4" />}
              {copied ? 'Copied' : 'Share'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className={cn('rounded-lg border-slate-300 dark:border-slate-600', saved && 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-400')}
              onClick={() => setSaved(!saved)}
            >
              <Bookmark className={cn('mr-2 h-4 w-4', saved && 'fill-current')} />
              {saved ? 'Saved' : 'Save'}
            </Button>
            {startup.website && (
              <a
                href={startup.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-medium text-growthlab-slate hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Website
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            )}
          </div>
        </CardContent>
      </Card>

      {/* As seen in – credibility strip (compact, below hero) */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/20 px-6 py-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted mb-2">As seen in</p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm font-medium text-growthlab-slate">
          {MOCK_PRESS.map((name) => (
            <span key={name}>{name}</span>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
        {/* ─── Main column (priority order) ─── */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Key metrics */}
          <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
            <CardContent className="p-6 sm:p-8">
              <p className="text-xs font-medium uppercase tracking-wider text-muted mb-1">Overview</p>
              <h2 className="text-base font-semibold text-growthlab-slate mb-5">Key metrics</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-xl bg-primary/10 dark:bg-primary/20 border border-primary/20 p-4 text-center">
                  <p className="text-2xl font-bold text-primary">{startup.funding}</p>
                  <p className="text-xs text-muted mt-0.5">Funding</p>
                </div>
                <div className="rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 p-4 text-center">
                  <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{startup.growthRate}</p>
                  <p className="text-xs text-muted mt-0.5">Growth</p>
                </div>
                <div className="rounded-xl bg-violet-500/10 dark:bg-violet-500/20 border border-violet-500/20 p-4 text-center">
                  <p className="text-2xl font-bold text-violet-700 dark:text-violet-400">{startup.employees}</p>
                  <p className="text-xs text-muted mt-0.5">Team</p>
                </div>
                <div className="rounded-xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/20 p-4 text-center">
                  <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">{startup.stage}</p>
                  <p className="text-xs text-muted mt-0.5">Stage</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. About */}
          <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 border-l-4 border-l-primary/50 overflow-hidden">
            <CardContent className="p-6 sm:p-8">
              <p className="text-xs font-medium uppercase tracking-wider text-muted mb-1">Company</p>
              <h2 className="text-base font-semibold text-growthlab-slate mb-5">About</h2>
              <p className="text-muted text-sm leading-relaxed mb-4">{startup.description}</p>
              <p className="text-muted text-sm leading-relaxed">
                We focus on scalable, user-centric solutions and work with enterprises across {startup.region}. Our mission is to drive measurable outcomes through technology and data.
              </p>
            </CardContent>
          </Card>

          {/* 3. Resources */}
          {hasResources && (
            <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 border-l-4 border-l-primary/50 overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <p className="text-xs font-medium uppercase tracking-wider text-muted mb-1">Resources</p>
                <h2 className="text-base font-semibold text-growthlab-slate mb-5">Pitch deck, one-pager & video</h2>
                <div className="flex flex-wrap gap-3 mb-4">
                  {startup.pitchDeckUrl && (
                    <a
                      href={startup.pitchDeckUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/30 px-4 py-3 text-sm font-medium text-growthlab-slate hover:border-primary/50 hover:bg-primary/5 transition-colors"
                    >
                      <Presentation className="h-4 w-4 text-primary" />
                      Pitch deck
                      <ExternalLink className="h-3.5 w-3.5 text-muted" />
                    </a>
                  )}
                  {startup.onePagerUrl && (
                    <a
                      href={startup.onePagerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/30 px-4 py-3 text-sm font-medium text-growthlab-slate hover:border-primary/50 hover:bg-primary/5 transition-colors"
                    >
                      <FileText className="h-4 w-4 text-primary" />
                      One-pager
                      <ExternalLink className="h-3.5 w-3.5 text-muted" />
                    </a>
                  )}
                </div>
                {startup.videoUrl && (
                  <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-600 bg-slate-900 aspect-video max-w-2xl">
                    <iframe
                      src={startup.videoUrl}
                      title="Pitch or product video"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* 4. Products */}
          <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 border-l-4 border-l-emerald-500/50 overflow-hidden">
            <CardContent className="p-6 sm:p-8">
              <p className="text-xs font-medium uppercase tracking-wider text-muted mb-1">Offerings</p>
              <h2 className="text-base font-semibold text-growthlab-slate mb-5 flex items-center gap-2">
                <Package className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Products
              </h2>
              {products.length > 0 ? (
                <ul className="space-y-4">
                  {products.map((product) => (
                    <li
                      key={product.id}
                      className="rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/30 p-4 transition-colors hover:border-emerald-500/30 dark:hover:border-emerald-500/30"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-growthlab-slate">{product.name}</p>
                          <p className="text-sm text-muted mt-1 leading-relaxed">{product.description}</p>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="text-xs bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-growthlab-slate font-normal">
                              {product.category}
                            </Badge>
                            <span
                              className={cn(
                                'text-xs font-medium',
                                product.status === 'Live' && 'text-emerald-600 dark:text-emerald-400',
                                product.status === 'Beta' && 'text-amber-600 dark:text-amber-400',
                                product.status === 'Coming soon' && 'text-slate-500 dark:text-slate-400'
                              )}
                            >
                              {product.status}
                            </span>
                          </div>
                        </div>
                        {product.url && (
                          <a
                            href={product.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-1.5 text-xs font-medium text-growthlab-slate hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-primary/50 transition-colors"
                          >
                            Learn more
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-600 bg-slate-50/30 dark:bg-slate-800/20 py-8 text-center">
                  <Package className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
                  <p className="mt-2 text-sm font-medium text-growthlab-slate">No products listed yet</p>
                  <p className="text-xs text-muted mt-0.5">Product lineup will appear here when added.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 5. Product & market */}
          <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 border-l-4 border-l-emerald-500/50 overflow-hidden">
            <CardContent className="p-6 sm:p-8">
              <p className="text-xs font-medium uppercase tracking-wider text-muted mb-1">Offerings</p>
              <h2 className="text-base font-semibold text-growthlab-slate mb-5">Product & market</h2>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-medium text-growthlab-slate mb-1">Problem</p>
                  <p className="text-muted leading-relaxed">Enterprises struggle with legacy workflows and fragmented tools in {startup.industry.toLowerCase()}.</p>
                </div>
                <div>
                  <p className="font-medium text-growthlab-slate mb-1">Solution</p>
                  <p className="text-muted leading-relaxed">We deliver integrated, scalable solutions with a focus on automation and user experience.</p>
                </div>
                <p className="text-muted leading-relaxed pt-1">We serve customers across {startup.region} and are expanding into new verticals.</p>
              </div>
            </CardContent>
          </Card>

          {/* 6. Team */}
          <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 border-l-4 border-l-violet-500/50 overflow-hidden">
            <CardContent className="p-6 sm:p-8">
              <p className="text-xs font-medium uppercase tracking-wider text-muted mb-1">People</p>
              <h2 className="text-base font-semibold text-growthlab-slate mb-5 flex items-center gap-2">
                <Users className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                Team & leadership
              </h2>
              <ul className="space-y-5">
                {MOCK_TEAM.map((m, i) => (
                  <li key={m.name} className="flex gap-4">
                    <div className={cn('h-12 w-12 shrink-0 rounded-xl flex items-center justify-center font-semibold text-lg', i === 0 ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'bg-violet-500/10 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400')}>
                      {m.name.slice(0, 1)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-growthlab-slate">{m.name}</p>
                      <p className="text-sm text-primary/90 dark:text-primary font-medium">{m.role}</p>
                      <p className="text-sm text-muted mt-1 leading-relaxed">{m.bio}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* 7. Investors */}
          <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 border-l-4 border-l-amber-500/50 overflow-hidden">
            <CardContent className="p-6 sm:p-8">
              <p className="text-xs font-medium uppercase tracking-wider text-muted mb-1">Funding</p>
              <h2 className="text-base font-semibold text-growthlab-slate mb-5 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                Investors
              </h2>
              <ul className="space-y-3">
                {MOCK_INVESTORS.map((inv) => (
                  <li key={inv.name} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/30 px-4 py-3">
                    <div>
                      <p className="font-medium text-growthlab-slate text-sm">{inv.name}</p>
                      <p className="text-xs text-muted">{inv.type}</p>
                    </div>
                    <Badge variant="outline" className="text-xs bg-amber-500/10 border-amber-500/25 text-amber-700 dark:text-amber-400">
                      {inv.round}
                    </Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* 8. Testimonials */}
          {testimonials.length > 0 && (
            <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 border-l-4 border-l-emerald-500/50 overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <p className="text-xs font-medium uppercase tracking-wider text-muted mb-1">Social proof</p>
                <h2 className="text-base font-semibold text-growthlab-slate mb-5">What others say</h2>
                <ul className="space-y-4">
                  {testimonials.map((t, i) => (
                    <li key={i} className="rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/30 dark:bg-slate-800/20 p-4">
                      <p className="text-sm text-growthlab-slate leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
                      <p className="mt-2 text-xs font-medium text-growthlab-slate">{t.author}</p>
                      <p className="text-xs text-muted">{t.role}{t.company ? ` · ${t.company}` : ''}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* 9. Culture */}
          <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 border-l-4 border-l-primary/50 overflow-hidden">
            <CardContent className="p-6 sm:p-8">
              <p className="text-xs font-medium uppercase tracking-wider text-muted mb-1">Workplace</p>
              <h2 className="text-base font-semibold text-growthlab-slate mb-5">Culture & values</h2>
              <p className="text-muted text-sm leading-relaxed mb-4">
                Remote-friendly, impact-driven team. We value transparency, ownership, and continuous learning.
              </p>
              <ul className="flex flex-wrap gap-2">
                {['Remote-first', 'Equity participation', 'Learning budget', 'Health & wellness'].map((v) => (
                  <li key={v}>
                    <Badge variant="outline" className="text-xs bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-growthlab-slate font-normal">
                      {v}
                    </Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* 10. Open positions */}
          {startup.hiring && startup.openPositions > 0 && (
            <Card id="open-positions" className="rounded-2xl border border-slate-200 dark:border-slate-700/50 border-l-4 border-l-violet-500/50 overflow-hidden scroll-mt-24">
              <CardContent className="p-6 sm:p-8">
                <p className="text-xs font-medium uppercase tracking-wider text-muted mb-1">Careers</p>
                <h2 className="text-base font-semibold text-growthlab-slate mb-5 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                  Open positions ({startup.openPositions})
                </h2>
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between items-center rounded-lg border-l-2 border-l-violet-500/50 border border-slate-200 dark:border-slate-600 p-3 bg-violet-500/5 dark:bg-violet-500/10">
                    <span className="font-medium text-growthlab-slate">Senior Engineer</span>
                    <span className="text-muted text-xs">Full-time · Singapore</span>
                  </li>
                  <li className="flex justify-between items-center rounded-lg border-l-2 border-l-violet-500/50 border border-slate-200 dark:border-slate-600 p-3 bg-violet-500/5 dark:bg-violet-500/10">
                    <span className="font-medium text-growthlab-slate">Product Manager</span>
                    <span className="text-muted text-xs">Full-time · Remote</span>
                  </li>
                </ul>
                <Link
                  href="#open-positions"
                  className="inline-flex items-center justify-center gap-2 h-9 px-3 text-xs rounded-lg mt-4 btn-primary font-medium"
                >
                  View all jobs
                </Link>
              </CardContent>
            </Card>
          )}

          {/* 11. Milestones */}
          <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 border-l-4 border-l-emerald-500/50 overflow-hidden">
            <CardContent className="p-6 sm:p-8">
              <p className="text-xs font-medium uppercase tracking-wider text-muted mb-1">Timeline</p>
              <h2 className="text-base font-semibold text-growthlab-slate mb-2">Milestones</h2>
              <p className="text-xs text-muted mb-6">Key achievements and company timeline</p>
              <div className="relative">
                {/* Vertical line */}
                <div
                  className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-emerald-500/40 via-primary/30 to-slate-200 dark:to-slate-600"
                  aria-hidden
                />
                <ul className="space-y-0">
                  {[...MILESTONES]
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((m, i) => (
                      <li key={`${m.date}-${m.title}`} className="relative flex gap-4 pb-8 last:pb-0">
                        {/* Node on the line */}
                        <div
                          className={cn(
                            'relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 bg-card',
                            m.type === 'funding' && 'border-amber-500/60 text-amber-600 dark:text-amber-400',
                            m.type === 'product' && 'border-emerald-500/60 text-emerald-600 dark:text-emerald-400',
                            m.type === 'partnership' && 'border-violet-500/60 text-violet-600 dark:text-violet-400',
                            m.type === 'team' && 'border-primary text-primary',
                            m.type === 'award' && 'border-amber-500/60 text-amber-600 dark:text-amber-400',
                            m.type === 'launch' && 'border-primary text-primary'
                          )}
                        >
                          {m.type === 'funding' && <DollarSign className="h-3 w-3" />}
                          {m.type === 'product' && <Package className="h-3 w-3" />}
                          {m.type === 'partnership' && <Handshake className="h-3 w-3" />}
                          {m.type === 'team' && <Users className="h-3 w-3" />}
                          {m.type === 'award' && <Award className="h-3 w-3" />}
                          {(m.type === 'launch' || !['funding', 'product', 'partnership', 'team', 'award'].includes(m.type)) && <Flag className="h-3 w-3" />}
                        </div>
                        <div className="min-w-0 flex-1 pt-0.5">
                          <p className="text-xs font-medium text-muted tabular-nums">{formatMilestoneDate(m.date)}</p>
                          <span
                            className={cn(
                              'inline-block mt-1 rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide',
                              m.type === 'funding' && 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
                              m.type === 'product' && 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
                              m.type === 'partnership' && 'bg-violet-500/15 text-violet-700 dark:text-violet-400',
                              m.type === 'team' && 'bg-primary/15 text-primary',
                              m.type === 'award' && 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
                              m.type === 'launch' && 'bg-primary/15 text-primary'
                            )}
                          >
                            {MILESTONE_LABELS[m.type]}
                          </span>
                          <p className="mt-1.5 text-sm font-medium text-growthlab-slate">{m.title}</p>
                          <p className="mt-0.5 text-xs text-muted leading-relaxed">{m.description}</p>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar – fixed order: activity, details, discovery */}
        <aside className="space-y-6 lg:sticky lg:top-28" aria-label="Profile sidebar">
          <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-2 text-sm text-muted mb-4">
                <Eye className="h-4 w-4 text-primary" />
                <span><strong className="font-semibold text-growthlab-slate">{formatCount(startup.views)}</strong> profile views</span>
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
          <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
            <CardContent className="p-6 sm:p-8">
              <p className="text-xs font-medium uppercase tracking-wider text-muted mb-1">Company info</p>
              <h2 className="text-base font-semibold text-growthlab-slate mb-5">Details</h2>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3 text-muted">
                  <Building className="h-4 w-4 shrink-0 text-primary" />
                  {startup.industry}
                </li>
                <li className="flex items-center gap-3 text-muted">
                  <MapPin className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  {startup.location}
                </li>
                <li className="flex items-center gap-3 text-muted">
                  <Calendar className="h-4 w-4 shrink-0 text-violet-600 dark:text-violet-400" />
                  Founded {startup.foundedYear}
                </li>
                <li className="flex items-center gap-3 text-muted">
                  <DollarSign className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  {startup.stage}
                </li>
              </ul>
              {(startup.linkedinUrl || startup.twitterUrl) && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted mb-2">Social</p>
                  <div className="flex flex-wrap gap-2">
                    {startup.linkedinUrl && (
                      <a
                        href={startup.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2 text-sm font-medium text-growthlab-slate hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="h-4 w-4" />
                        LinkedIn
                      </a>
                    )}
                    {startup.twitterUrl && (
                      <a
                        href={startup.twitterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2 text-sm font-medium text-growthlab-slate hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        aria-label="X (Twitter)"
                      >
                        <span className="text-sm font-bold">𝕏</span>
                        X
                      </a>
                    )}
                  </div>
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs font-medium uppercase tracking-wider text-muted mb-2">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {startup.tags.map((t, i) => (
                    <Badge
                      key={t}
                      variant="outline"
                      className={cn(
                        'text-xs border',
                        i % 4 === 0 && 'bg-primary/10 border-primary/25 text-primary',
                        i % 4 === 1 && 'bg-emerald-500/10 border-emerald-500/25 text-emerald-700 dark:text-emerald-400',
                        i % 4 === 2 && 'bg-violet-500/10 border-violet-500/25 text-violet-700 dark:text-violet-400',
                        i % 4 === 3 && 'bg-amber-500/10 border-amber-500/25 text-amber-700 dark:text-amber-400'
                      )}
                    >
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="mt-4 pt-3">
                <button
                  type="button"
                  onClick={() => setReportOpen(true)}
                  className="w-full text-left text-xs text-muted hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1.5 transition-colors"
                >
                  <Flag className="h-3.5 w-3.5" />
                  Report this profile
                </button>
                {reportOpen && (
                  <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">Thanks. This profile has been flagged for review.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {peopleAlsoViewed.length > 0 && (
            <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <p className="text-xs font-medium uppercase tracking-wider text-muted mb-1">Activity</p>
                <h2 className="text-base font-semibold text-growthlab-slate mb-5">People also viewed</h2>
                <ul className="space-y-3">
                  {peopleAlsoViewed.map((s, i) => (
                    <li key={s.id}>
                      <Link
                        href={`/startups/${s.id}`}
                        className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-600 p-3 hover:border-primary/50 hover:bg-primary/[0.04] dark:hover:bg-primary/10 transition-colors"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          {s.logo ? (
                            <img src={s.logo} alt="" className="h-full w-full object-contain p-0.5" />
                          ) : (
                            <Rocket className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-growthlab-slate truncate">{s.name}</p>
                          <p className="text-xs text-muted">{s.industry} · {s.stage}</p>
                        </div>
                        <ArrowLeft className="h-4 w-4 shrink-0 rotate-180 text-muted" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {similar.length > 0 && (
            <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <p className="text-xs font-medium uppercase tracking-wider text-muted mb-1">Discover</p>
                <h2 className="text-base font-semibold text-growthlab-slate mb-5">Similar startups</h2>
                <ul className="space-y-3">
                  {similar.map((s, i) => {
                    const accents = [
                      'bg-primary/10 border-primary/20 text-primary',
                      'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
                      'bg-violet-500/10 border-violet-500/20 text-violet-600 dark:text-violet-400',
                      'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400',
                    ];
                    const accent = accents[i % accents.length];
                    return (
                      <li key={s.id}>
                        <Link
                          href={`/startups/${s.id}`}
                          className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-600 p-3 hover:border-primary/50 hover:bg-primary/[0.04] dark:hover:bg-primary/10 transition-colors"
                        >
                          <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border', accent)}>
                            <Rocket className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-growthlab-slate truncate">{s.name}</p>
                            <p className="text-xs text-muted">{s.industry} · {s.stage}</p>
                          </div>
                          <ArrowLeft className="h-4 w-4 shrink-0 rotate-180 text-muted" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          )}
        </aside>
      </div>

      <MobileDetailActionBar>
        <div className="flex gap-3">
          <Button
            size="sm"
            className="flex-1 min-h-11 rounded-xl btn-primary"
            onClick={() => setConnectionRequested(true)}
            disabled={connectionRequested}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            {connectionRequested ? 'Request sent' : 'Connect'}
          </Button>
          <Link href="/messages" className="flex-1 min-h-11">
            <Button size="sm" variant="outline" className="w-full min-h-11 rounded-xl border-slate-300 dark:border-slate-600">
              <MessageSquare className="mr-2 h-4 w-4" />
              Message
            </Button>
          </Link>
        </div>
      </MobileDetailActionBar>
    </div>
  );
}
