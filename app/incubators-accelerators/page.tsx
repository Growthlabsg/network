'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Search,
  MapPin,
  Star,
  MessageCircle,
  Share2,
  ExternalLink,
  Bookmark,
  Rocket,
  Clock,
  DollarSign,
  Users,
  Calendar,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { DirectoryLayout } from '@/components/network/directory-layout';
import { IncubatorProfileDrawer } from '@/components/incubator/incubator-profile-drawer';
import {
  INCUBATORS,
  INCUBATOR_TYPES,
  INCUBATOR_INDUSTRIES,
  INCUBATOR_LOCATIONS,
  getRecommendedIncubators,
  type Incubator,
} from '@/lib/mock-incubators';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 9;
const SORT_OPTIONS = ['rating', 'alumni', 'name'] as const;
type SortKey = (typeof SORT_OPTIONS)[number];

export default function IncubatorsAcceleratorsPage() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState(INCUBATOR_TYPES[0]);
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState(INCUBATOR_LOCATIONS[0]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>('rating');
  const [page, setPage] = useState(1);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [drawerIncubator, setDrawerIncubator] = useState<Incubator | null>(null);

  const filtered = useMemo(() => {
    return INCUBATORS.filter((i) => {
      const matchSearch =
        !search ||
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.description.toLowerCase().includes(search.toLowerCase()) ||
        i.industries.some((ind) => ind.toLowerCase().includes(search.toLowerCase()));
      const matchType = type === 'All Types' || i.type === type;
      const matchIndustry = !industry || i.industries.includes(industry);
      const matchLocation = location === 'All Locations' || i.location === location;
      const matchVerified = !verifiedOnly || i.verified;
      const matchFeatured = !featuredOnly || i.featured;
      return matchSearch && matchType && matchIndustry && matchLocation && matchVerified && matchFeatured;
    });
  }, [search, type, industry, location, verifiedOnly, featuredOnly]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sortBy === 'rating') arr.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    else if (sortBy === 'alumni') arr.sort((a, b) => (b.alumniCount ?? 0) - (a.alumniCount ?? 0));
    else if (sortBy === 'name') arr.sort((a, b) => a.name.localeCompare(b.name));
    return arr;
  }, [filtered, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const paginated = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const recommendedIncubators = useMemo(() => getRecommendedIncubators(4), []);
  const featuredIncubators = useMemo(() => INCUBATORS.filter((i) => i.featured).slice(0, 4), []);
  const hasFilters = search || type !== INCUBATOR_TYPES[0] || industry || location !== INCUBATOR_LOCATIONS[0] || verifiedOnly || featuredOnly;

  const openDrawer = (i: Incubator) => setDrawerIncubator(i);
  const closeDrawer = () => setDrawerIncubator(null);
  const toggleSaved = (id: string) => setSavedIds((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });

  const stats = useMemo(
    () => [
      { label: 'Programs', value: INCUBATORS.length, accent: 'sky' as const },
      { label: 'Alumni', value: INCUBATORS.reduce((sum, i) => sum + (i.alumniCount ?? 0), 0).toLocaleString(), accent: 'emerald' as const },
      { label: 'Verified', value: INCUBATORS.filter((i) => i.verified).length, accent: 'violet' as const },
      { label: 'Accelerators', value: INCUBATORS.filter((i) => i.type === 'Accelerator').length, accent: 'amber' as const },
    ],
    []
  );

  return (
    <DirectoryLayout
      title="Incubators & Accelerators"
      subtitle="Discover programs and spaces"
      description="Find accelerators and incubators by type, location, and industry. Apply to programs that match your stage and focus."
      ctaHref="/incubators-accelerators/create"
      ctaLabel="Create program profile"
      stats={stats}
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" aria-hidden />
            <Input
              placeholder="Search programs by name, description, or industry..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-10 rounded-xl border-gray-200 dark:border-slate-600 dark:bg-slate-800/50"
              aria-label="Search programs"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              value={type}
              onChange={(e) => { setType(e.target.value as typeof type); setPage(1); }}
              className="rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-800/50 px-3 py-2 text-sm text-growthlab-slate focus:ring-2 focus:ring-primary min-w-[140px]"
              aria-label="Type"
            >
              {INCUBATOR_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <select
              value={location}
              onChange={(e) => { setLocation(e.target.value); setPage(1); }}
              className="rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-800/50 px-3 py-2 text-sm text-growthlab-slate focus:ring-2 focus:ring-primary min-w-[140px]"
              aria-label="Location"
            >
              {INCUBATOR_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <select
              value={industry}
              onChange={(e) => { setIndustry(e.target.value); setPage(1); }}
              className="rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-800/50 px-3 py-2 text-sm text-growthlab-slate focus:ring-2 focus:ring-primary min-w-[140px]"
              aria-label="Industry"
            >
              <option value="">All industries</option>
              {INCUBATOR_INDUSTRIES.map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value as SortKey); setPage(1); }}
              className="rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-800/50 px-3 py-2 text-sm text-growthlab-slate focus:ring-2 focus:ring-primary min-w-[140px]"
              aria-label="Sort by"
            >
              <option value="rating">Rating</option>
              <option value="alumni">Alumni</option>
              <option value="name">Name</option>
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

        {recommendedIncubators.length > 0 && !hasFilters && (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50/80 dark:bg-slate-800/30 p-4 border-l-4 border-l-emerald-500/50">
            <div className="flex items-center gap-2 mb-3">
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              <span className="text-sm font-medium text-growthlab-slate">Recommended</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {recommendedIncubators.map((i) => (
                <button
                  key={i.id}
                  type="button"
                  onClick={() => openDrawer(i)}
                  className="flex shrink-0 items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900/50 px-3 py-2 min-w-[180px] hover:border-primary/50 hover:bg-primary/[0.04] dark:hover:bg-primary/10 transition-colors text-left"
                >
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                    {i.logo ? <img src={i.logo} alt="" className="h-full w-full object-cover" /> : <Rocket className="h-5 w-5 text-muted" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-growthlab-slate truncate">{i.name}</p>
                    <p className="text-xs text-muted">{i.type} · {i.location}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted" />
                </button>
              ))}
            </div>
          </div>
        )}

        {featuredIncubators.length > 0 && !hasFilters && sorted.length > 0 && (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-gradient-to-br from-primary/[0.06] to-slate-50/80 dark:from-primary/10 dark:to-slate-800/30 p-4 border-l-4 border-l-primary/50">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-growthlab-slate">Featured programs</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {featuredIncubators.map((i) => (
                <Link
                  key={i.id}
                  href={`/incubators-accelerators/${i.id}`}
                  className="flex shrink-0 items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900/50 px-3 py-2 min-w-[200px] hover:border-primary/50 hover:bg-primary/[0.04] dark:hover:bg-primary/10 transition-colors"
                >
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-primary/10 dark:bg-primary/15 flex items-center justify-center overflow-hidden">
                    {i.logo ? <img src={i.logo} alt="" className="h-full w-full object-cover" /> : <Rocket className="h-5 w-5 text-primary" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-growthlab-slate truncate">{i.name}</p>
                    <p className="text-xs text-muted">{i.type} · {i.location}</p>
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
              <h3 className="text-lg font-semibold text-growthlab-slate mb-2">No programs found</h3>
              <p className="text-muted mb-6 max-w-sm mx-auto">Try different search terms or filters.</p>
              <Button variant="outline" className="rounded-lg border-slate-300 dark:border-slate-600" onClick={() => { setSearch(''); setType(INCUBATOR_TYPES[0]); setIndustry(''); setLocation(INCUBATOR_LOCATIONS[0]); setVerifiedOnly(false); setFeaturedOnly(false); setPage(1); }}>
                Clear filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <p className="text-sm text-muted">
              Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, sorted.length)} of {sorted.length} program{sorted.length !== 1 ? 's' : ''}
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginated.map((i) => (
                <IncubatorCard
                  key={i.id}
                  incubator={i}
                  saved={savedIds.has(i.id)}
                  onToggleSaved={() => toggleSaved(i.id)}
                  onOpenProfile={() => openDrawer(i)}
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
                    {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                      const pageNum = totalPages <= 5 ? idx + 1 : safePage <= 3 ? idx + 1 : safePage >= totalPages - 2 ? totalPages - 4 + idx : safePage - 2 + idx;
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

        <section className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50/80 dark:bg-slate-800/30 p-8 sm:p-10 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-growthlab-slate mb-2">Run an accelerator or incubator?</h2>
          <p className="text-muted max-w-2xl mx-auto mb-6">
            Create your program profile to attract startups and manage applications from one place.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/incubators-accelerators/create">
              <Button className="btn-primary rounded-lg px-5">Create program profile</Button>
            </Link>
            <Link href="/incubators-accelerators/dashboard">
              <Button variant="outline" className="rounded-lg border-primary text-primary bg-white dark:bg-slate-900/50 hover:bg-primary/5 dark:hover:bg-primary/10">
                Go to dashboard
              </Button>
            </Link>
          </div>
        </section>
      </div>

      <IncubatorProfileDrawer incubator={drawerIncubator} open={!!drawerIncubator} onClose={closeDrawer} />
    </DirectoryLayout>
  );
}

function IncubatorCard({
  incubator,
  saved,
  onToggleSaved,
  onOpenProfile,
}: {
  incubator: Incubator;
  saved: boolean;
  onToggleSaved: () => void;
  onOpenProfile: () => void;
}) {
  return (
    <Card className={cn('gs-card-hover rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/30', incubator.featured && 'ring-1 ring-primary/20')}>
      <CardContent className="p-5">
        <div
          role="button"
          tabIndex={0}
          onClick={onOpenProfile}
          onKeyDown={(e) => e.key === 'Enter' && onOpenProfile()}
          className="cursor-pointer -m-5 p-5 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
          aria-label={`View ${incubator.name} profile`}
        >
          <div className="relative flex items-start gap-3 mb-3">
            <div className="h-12 w-12 shrink-0 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200/80 dark:border-slate-600/80 overflow-hidden">
              {incubator.logo ? (
                <img src={incubator.logo} alt="" className="h-full w-full object-cover" />
              ) : (
                <Rocket className="h-6 w-6 text-muted" />
              )}
            </div>
            <div className="min-w-0 flex-1 pr-8">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-growthlab-slate truncate">{incubator.name}</h3>
                {incubator.verified && (
                  <span className="inline-flex items-center rounded-md bg-primary/12 text-primary dark:bg-primary/20 dark:text-primary text-[10px] font-medium px-1.5 py-0.5 border border-primary/25 dark:border-primary/30">
                    Verified
                  </span>
                )}
                {incubator.featured && (
                  <span className="inline-flex items-center rounded-md bg-primary/12 text-primary text-[10px] font-medium px-1.5 py-0.5 border border-primary/25">
                    Featured
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                {incubator.rating != null && (
                  <>
                    <span className="flex items-center gap-1 text-sm text-muted">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden />
                      {incubator.rating}
                    </span>
                    <span className="text-sm text-muted">·</span>
                  </>
                )}
                <span className="text-sm text-muted">{incubator.type}</span>
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

          <p className="text-sm text-muted line-clamp-3 mb-4">{incubator.description}</p>

          <div className="space-y-2 text-sm text-muted mb-4">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 shrink-0 text-muted" />
              {incubator.location}
            </span>
            {incubator.duration && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 shrink-0 text-muted" />
                {incubator.duration}
              </span>
            )}
            {incubator.funding && (
              <span className="flex items-center gap-1.5">
                <DollarSign className="h-4 w-4 shrink-0 text-muted" />
                {incubator.funding}
              </span>
            )}
            {incubator.cohortSize && (
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4 shrink-0 text-muted" />
                {incubator.cohortSize}
              </span>
            )}
            {incubator.nextIntake && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 shrink-0 text-muted" />
                {incubator.nextIntake}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {incubator.industries.slice(0, 5).map((ind) => (
              <span key={ind} className="rounded-md border px-2 py-0.5 text-xs font-medium bg-slate-100 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-600/80 text-growthlab-slate dark:text-slate-200">
                {ind}
              </span>
            ))}
          </div>

          {(incubator.successRate != null || incubator.alumniCount != null) && (
            <p className="text-xs text-muted">
              {incubator.successRate != null && `Success Rate: ${incubator.successRate}`}
              {incubator.successRate != null && incubator.alumniCount != null && ' · '}
              {incubator.alumniCount != null && `${incubator.alumniCount} alumni`}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Button size="sm" className="flex-1 min-w-0 rounded-lg gap-1.5 btn-primary" onClick={onOpenProfile}>
            View details
          </Button>
          <button type="button" className="rounded-full p-2 border border-primary/30 bg-white dark:bg-slate-800/50 text-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors" aria-label="Share">
            <Share2 className="h-4 w-4" />
          </button>
          <Link
            href={`/incubators-accelerators/${incubator.id}`}
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
