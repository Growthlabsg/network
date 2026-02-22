'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Search,
  Building2,
  MapPin,
  DollarSign,
  Users,
  Star,
  MessageCircle,
  Share2,
  ExternalLink,
  FileStack,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Bookmark,
} from 'lucide-react';
import { DirectoryLayout } from '@/components/network/directory-layout';
import { InvestorProfileDrawer } from '@/components/network/investor-profile-drawer';
import { SendConnectionRequestDialog } from '@/components/connection/send-connection-request-dialog';
import {
  INVESTORS,
  INVESTOR_CATEGORIES,
  INVESTOR_LOCATIONS,
  INVESTOR_INDUSTRIES,
  INVESTOR_STAGES,
  CHECK_SIZE_BANDS,
  investorMatchesCheckSize,
  getRecommendedInvestors,
  type Investor,
} from '@/lib/mock-investors';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 9;
const SORT_OPTIONS = ['rating', 'name', 'portfolio', 'newest', 'response'] as const;
type SortKey = (typeof SORT_OPTIONS)[number];

const avgInvestment = '$2.5M';
const totalPortfolio = INVESTORS.reduce((sum, i) => sum + i.portfolioCount, 0);
const successRate = '85%';

export default function InvestorsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(INVESTOR_CATEGORIES[0]);
  const [location, setLocation] = useState(INVESTOR_LOCATIONS[0]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [industry, setIndustry] = useState('');
  const [stage, setStage] = useState('');
  const [checkSizeBand, setCheckSizeBand] = useState('any');
  const [sortBy, setSortBy] = useState<SortKey>('rating');
  const [page, setPage] = useState(1);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [drawerInvestor, setDrawerInvestor] = useState<Investor | null>(null);
  const [connectionRequestedIds, setConnectionRequestedIds] = useState<Set<string>>(new Set());
  const [connectionDialogOpen, setConnectionDialogOpen] = useState(false);

  const filtered = useMemo(() => {
    return INVESTORS.filter((inv) => {
      const matchSearch =
        !search ||
        inv.name.toLowerCase().includes(search.toLowerCase()) ||
        inv.description.toLowerCase().includes(search.toLowerCase()) ||
        inv.focus.toLowerCase().includes(search.toLowerCase()) ||
        inv.industries.some((i) => i.toLowerCase().includes(search.toLowerCase()));
      const matchCategory = category === 'All Categories' || inv.categories.includes(category);
      const matchLocation = location === 'All Locations' || inv.location === location;
      const matchIndustry = !industry || inv.industries.includes(industry);
      const matchStage = !stage || (inv.stages && inv.stages.includes(stage));
      const matchCheckSize = investorMatchesCheckSize(inv, checkSizeBand);
      const matchVerified = !verifiedOnly || inv.verified;
      const matchFeatured = !featuredOnly || inv.featured;
      return matchSearch && matchCategory && matchLocation && matchIndustry && matchStage && matchCheckSize && matchVerified && matchFeatured;
    });
  }, [search, category, location, industry, stage, checkSizeBand, verifiedOnly, featuredOnly]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    list.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'portfolio':
          return b.portfolioCount - a.portfolioCount;
        case 'newest':
          return (b.foundedYear ?? 0) - (a.foundedYear ?? 0);
        case 'response':
          return (a.avgResponseDays ?? 999) - (b.avgResponseDays ?? 999);
        case 'rating':
        default:
          return b.rating - a.rating;
      }
    });
    return list;
  }, [filtered, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = useMemo(
    () => sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [sorted, safePage]
  );

  const featuredInvestors = useMemo(() => INVESTORS.filter((i) => i.featured).slice(0, 4), []);
  const recommendedInvestors = useMemo(() => getRecommendedInvestors(6), []);
  const hasFilters = search || category !== 'All Categories' || location !== 'All Locations' || industry || stage || checkSizeBand !== 'any' || verifiedOnly || featuredOnly;

  const toggleSaved = (id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openDrawer = (inv: Investor) => setDrawerInvestor(inv);
  const closeDrawer = () => setDrawerInvestor(null);

  const sendConnectionRequest = (investorId: string) => {
    setConnectionRequestedIds((prev) => new Set(prev).add(investorId));
    setConnectionDialogOpen(false);
  };

  const stats = useMemo(
    () => [
      { label: 'Total Investors', value: INVESTORS.length, accent: 'sky' as const, icon: FileStack },
      { label: 'Avg. Investment', value: avgInvestment, accent: 'emerald' as const, icon: DollarSign },
      { label: 'Portfolio Companies', value: `${totalPortfolio}+`, accent: 'violet' as const, icon: Users },
      { label: 'Success Rate', value: successRate, accent: 'amber' as const, icon: Star },
    ],
    []
  );

  return (
    <DirectoryLayout
      title="Investor Directory"
      subtitle="Connect with investors backing startups like yours"
      description="Find investors (angels, VCs, accelerators) by focus area, check size, and location."
      ctaHref="/investors/create"
      ctaLabel="Create investor profile"
      stats={stats}
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" aria-hidden />
            <Input
              placeholder="Search investors by name, focus area, or description..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-10 rounded-xl border-gray-200 dark:border-slate-600 dark:bg-slate-800/50"
              aria-label="Search investors"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-800/50 px-3 py-2 text-sm text-growthlab-slate focus:ring-2 focus:ring-primary min-w-[140px]"
              aria-label="Category"
            >
              {INVESTOR_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={location}
              onChange={(e) => { setLocation(e.target.value); setPage(1); }}
              className="rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-800/50 px-3 py-2 text-sm text-growthlab-slate focus:ring-2 focus:ring-primary min-w-[140px]"
              aria-label="Location"
            >
              {INVESTOR_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <select
              value={industry}
              onChange={(e) => { setIndustry(e.target.value); setPage(1); }}
              className="rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-800/50 px-3 py-2 text-sm text-growthlab-slate focus:ring-2 focus:ring-primary min-w-[140px]"
              aria-label="Industry"
            >
              <option value="">All industries</option>
              {INVESTOR_INDUSTRIES.map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
            <select
              value={stage}
              onChange={(e) => { setStage(e.target.value); setPage(1); }}
              className="rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-800/50 px-3 py-2 text-sm text-growthlab-slate focus:ring-2 focus:ring-primary min-w-[140px]"
              aria-label="Stage"
            >
              <option value="">All stages</option>
              {INVESTOR_STAGES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select
              value={checkSizeBand}
              onChange={(e) => { setCheckSizeBand(e.target.value); setPage(1); }}
              className="rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-800/50 px-3 py-2 text-sm text-growthlab-slate focus:ring-2 focus:ring-primary min-w-[140px]"
              aria-label="Check size"
            >
              {CHECK_SIZE_BANDS.map((b) => (
                <option key={b.id} value={b.id}>{b.label}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value as SortKey); setPage(1); }}
              className="rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-800/50 px-3 py-2 text-sm text-growthlab-slate focus:ring-2 focus:ring-primary min-w-[140px]"
              aria-label="Sort by"
            >
              <option value="rating">Rating</option>
              <option value="name">Name</option>
              <option value="portfolio">Portfolio size</option>
              <option value="newest">Newest</option>
              <option value="response">Fastest response</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => { setVerifiedOnly((o) => !o); setPage(1); }}
            className={cn(
              'rounded-full px-3 py-1.5 text-xs font-medium border transition-colors',
              verifiedOnly ? 'bg-primary/12 text-primary border-primary/25 dark:bg-primary/20 dark:text-primary dark:border-primary/30' : 'bg-slate-100 text-muted border-transparent hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700'
            )}
          >
            Verified
          </button>
          <button
            type="button"
            onClick={() => { setFeaturedOnly((o) => !o); setPage(1); }}
            className={cn(
              'rounded-full px-3 py-1.5 text-xs font-medium border transition-colors',
              featuredOnly ? 'bg-primary/12 text-primary border-primary/25 dark:bg-primary/20 dark:border-primary/30' : 'bg-slate-100 text-muted border-transparent hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700'
            )}
          >
            Featured
          </button>
        </div>

        {recommendedInvestors.length > 0 && !hasFilters && (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50/80 dark:bg-slate-800/30 p-4 border-l-4 border-l-emerald-500/50">
            <div className="flex items-center gap-2 mb-3">
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              <span className="text-sm font-medium text-growthlab-slate">Recommended for you</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {recommendedInvestors.map((inv) => (
                <button
                  key={inv.id}
                  type="button"
                  onClick={() => openDrawer(inv)}
                  className="flex shrink-0 items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900/50 px-3 py-2 min-w-[180px] hover:border-primary/50 hover:bg-primary/[0.04] dark:hover:bg-primary/10 transition-colors text-left"
                >
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                    {inv.logo ? (
                      <img src={inv.logo} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <Building2 className="h-5 w-5 text-muted" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-growthlab-slate truncate">{inv.name}</p>
                    <p className="text-xs text-muted">{inv.investmentRange}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted" />
                </button>
              ))}
            </div>
          </div>
        )}

        {featuredInvestors.length > 0 && !hasFilters && sorted.length > 0 && (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-gradient-to-br from-primary/[0.06] to-slate-50/80 dark:from-primary/10 dark:to-slate-800/30 p-4 border-l-4 border-l-primary/50">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-growthlab-slate">Featured investors</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {featuredInvestors.map((inv) => (
                <Link
                  key={inv.id}
                  href={`/investors/${inv.id}`}
                  className="flex shrink-0 items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900/50 px-3 py-2 min-w-[200px] hover:border-primary/50 hover:bg-primary/[0.04] dark:hover:bg-primary/10 transition-colors"
                >
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-primary/10 dark:bg-primary/15 flex items-center justify-center overflow-hidden">
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
                  <ExternalLink className="h-4 w-4 shrink-0 text-muted" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {filtered.length === 0 ? (
          <Card className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20">
            <CardContent className="p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 dark:bg-primary/15 text-primary mb-4">
                <Search className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-semibold text-growthlab-slate mb-2">No investors found</h3>
              <p className="text-muted mb-6 max-w-sm mx-auto">Try different search terms or filters.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearch('');
                  setCategory(INVESTOR_CATEGORIES[0]);
                  setLocation(INVESTOR_LOCATIONS[0]);
                }}
                className="rounded-lg border-slate-300 dark:border-slate-600"
              >
                Clear filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <p className="text-sm text-muted">
              Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, sorted.length)} of {sorted.length} investor{sorted.length !== 1 ? 's' : ''}
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginated.map((inv) => (
                <InvestorCard
                  key={inv.id}
                  investor={inv}
                  saved={savedIds.has(inv.id)}
                  onToggleSaved={() => toggleSaved(inv.id)}
                  onOpenProfile={() => openDrawer(inv)}
                  connectionRequestSent={connectionRequestedIds.has(inv.id)}
                />
              ))}
            </div>
            {totalPages > 1 && (
              <nav className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-700" aria-label="Pagination">
                <p className="text-sm text-muted">Page {safePage} of {totalPages}</p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="rounded-lg" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage <= 1} aria-label="Previous page">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="flex items-center gap-1 px-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) pageNum = i + 1;
                      else if (safePage <= 3) pageNum = i + 1;
                      else if (safePage >= totalPages - 2) pageNum = totalPages - 4 + i;
                      else pageNum = safePage - 2 + i;
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => setPage(pageNum)}
                          className={cn('h-8 min-w-[2rem] rounded-lg text-sm font-medium', pageNum === safePage ? 'bg-primary text-white' : 'text-muted hover:bg-slate-100 dark:hover:bg-slate-800')}
                          aria-label={`Page ${pageNum}`}
                          aria-current={pageNum === safePage ? 'page' : undefined}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </span>
                  <Button variant="outline" size="sm" className="rounded-lg" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages} aria-label="Next page">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </nav>
            )}
          </>
        )}

        <InvestorConnectCTA />
      </div>

      <InvestorProfileDrawer
        investor={drawerInvestor}
        open={!!drawerInvestor}
        onClose={closeDrawer}
        onSendConnectionRequest={() => drawerInvestor && setConnectionDialogOpen(true)}
        connectionRequestSent={drawerInvestor ? connectionRequestedIds.has(drawerInvestor.id) : false}
      />

      {drawerInvestor && (
        <SendConnectionRequestDialog
          open={connectionDialogOpen}
          onOpenChange={setConnectionDialogOpen}
          targetName={drawerInvestor.name}
          onSend={() => sendConnectionRequest(drawerInvestor.id)}
        />
      )}
    </DirectoryLayout>
  );
}

function InvestorConnectCTA() {
  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50/80 dark:bg-slate-800/30 p-8 sm:p-10 text-center">
      <h2 className="text-xl sm:text-2xl font-bold text-growthlab-slate mb-2">
        Ready to Connect with Investors?
      </h2>
      <p className="text-muted max-w-2xl mx-auto mb-6">
        Send connection requests to investors; once they accept, you can message them in-app — no need to share email. Many investors prefer to keep contact private and use our messaging.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/investors/create">
          <Button className="btn-primary rounded-lg px-5">
            Get Investor Introductions
          </Button>
        </Link>
        <Link href="/network/investors#process">
          <Button variant="outline" className="rounded-lg border-primary text-primary bg-white dark:bg-slate-900/50 hover:bg-primary/5 dark:hover:bg-primary/10">
            Learn About Our Process
          </Button>
        </Link>
      </div>
    </section>
  );
}

function InvestorCard({
  investor,
  saved,
  onToggleSaved,
  onOpenProfile,
  connectionRequestSent,
}: {
  investor: Investor;
  saved: boolean;
  onToggleSaved: () => void;
  onOpenProfile: () => void;
  connectionRequestSent: boolean;
}) {
  return (
    <Card className={cn('gs-card-hover rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/30', investor.featured && 'ring-1 ring-primary/20')}>
      <CardContent className="p-5">
        <div role="button" tabIndex={0} onClick={onOpenProfile} onKeyDown={(e) => e.key === 'Enter' && onOpenProfile()} className="cursor-pointer -m-5 p-5 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset" aria-label={`View ${investor.name} profile`}>
        <div className="relative flex items-start gap-3 mb-3">
          <div className="h-12 w-12 shrink-0 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200/80 dark:border-slate-600/80 overflow-hidden">
            {investor.logo ? (
              <img src={investor.logo} alt="" className="h-full w-full object-cover" />
            ) : (
              <Building2 className="h-6 w-6 text-muted" />
            )}
          </div>
          <div className="min-w-0 flex-1 pr-8">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-growthlab-slate truncate">{investor.name}</h3>
              {investor.verified && (
                <span className="inline-flex items-center rounded-md bg-primary/12 text-primary dark:bg-primary/20 dark:text-primary text-[10px] font-medium px-1.5 py-0.5 border border-primary/25 dark:border-primary/30">
                  Verified
                </span>
              )}
              {investor.featured && (
                <span className="inline-flex items-center rounded-md bg-primary/12 text-primary text-[10px] font-medium px-1.5 py-0.5 border border-primary/25">
                  Featured
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-1 text-sm text-muted">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden />
                {investor.rating}
              </span>
              <span className="text-sm text-muted">·</span>
              <span className="text-sm text-muted">{investor.type}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleSaved(); }}
            className="absolute right-4 top-4 z-10 rounded-full p-1.5 bg-white/90 dark:bg-slate-800/90 shadow-sm border border-slate-200 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-800"
            aria-label={saved ? 'Unsave' : 'Save'}
          >
            <Bookmark className={cn('h-4 w-4', saved ? 'fill-rose-500 text-rose-500' : 'text-muted')} />
          </button>
        </div>

        <p className="text-sm text-muted line-clamp-3 mb-4">{investor.description}</p>

        <div className="space-y-2 text-sm text-muted mb-4">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 shrink-0 text-muted" />
            {investor.location}
          </span>
          <span className="flex items-center gap-1.5">
            <DollarSign className="h-4 w-4 shrink-0 text-muted" />
            {investor.investmentRange}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4 shrink-0 text-muted" />
            {investor.portfolioCount} portfolio companies
          </span>
          {investor.responseTime && (
            <span className="flex items-center gap-1.5 text-xs text-muted">
              Response: {investor.responseTime}
            </span>
          )}
          {investor.activeDeals && investor.activeDeals.toLowerCase().includes('actively') && (
            <span className="inline-flex items-center rounded-md bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 text-[10px] font-medium px-1.5 py-0.5 border border-emerald-500/25">
              Actively investing
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {investor.industries.slice(0, 5).map((ind) => (
            <span
              key={ind}
              className={cn(
                'rounded-md border px-2 py-0.5 text-xs font-medium',
                'bg-slate-100 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-600/80 text-growthlab-slate dark:text-slate-200'
              )}
            >
              {ind}
            </span>
          ))}
        </div>
        </div>

        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Button size="sm" className="flex-1 min-w-0 rounded-lg gap-1.5 btn-primary" onClick={onOpenProfile}>
            <MessageCircle className="h-3.5 w-3.5 shrink-0" />
            {connectionRequestSent ? 'Request sent' : 'Request to connect'}
          </Button>
          <button
            type="button"
            className="rounded-full p-2 border border-primary/30 bg-white dark:bg-slate-800/50 text-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
            aria-label="Share"
          >
            <Share2 className="h-4 w-4" />
          </button>
          <Link
            href={`/investors/${investor.id}`}
            className="rounded-full p-2 border border-primary/30 bg-white dark:bg-slate-800/50 text-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
            aria-label="Open full profile"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
