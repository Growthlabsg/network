'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Search,
  Star,
  MessageCircle,
  Share2,
  ExternalLink,
  Building2,
  FileText,
  Phone,
  Award,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Lightbulb,
  Send,
} from 'lucide-react';
import { DirectoryLayout } from '@/components/network/directory-layout';
import { AgencyProfileDrawer } from '@/components/agency/agency-profile-drawer';
import {
  AGENCIES,
  AGENCY_CATEGORIES,
  getRecommendedAgencies,
  getTotalActivePrograms,
  type GovernmentAgency,
} from '@/lib/mock-government-agencies';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 9;
const SORT_OPTIONS = ['rating', 'name'] as const;
type SortKey = (typeof SORT_OPTIONS)[number];

export default function GovernmentPage() {
  const [search, setSearch] = useState('');
  const [categoryFilters, setCategoryFilters] = useState<Set<string>>(new Set());
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>('rating');
  const [page, setPage] = useState(1);
  const [drawerAgency, setDrawerAgency] = useState<GovernmentAgency | null>(null);

  const filtered = useMemo(() => {
    return AGENCIES.filter((a) => {
      const matchSearch =
        !search ||
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.description.toLowerCase().includes(search.toLowerCase()) ||
        a.programs.some((p) => p.toLowerCase().includes(search.toLowerCase())) ||
        a.category.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilters.size === 0 || categoryFilters.has(a.category);
      const matchVerified = !verifiedOnly || a.verified;
      const matchFeatured = !featuredOnly || a.featured;
      return matchSearch && matchCategory && matchVerified && matchFeatured;
    });
  }, [search, categoryFilters, verifiedOnly, featuredOnly]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sortBy === 'rating') arr.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'name') arr.sort((a, b) => a.name.localeCompare(b.name));
    return arr;
  }, [filtered, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const paginated = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const recommendedAgencies = useMemo(() => getRecommendedAgencies(4), []);
  const featuredAgencies = useMemo(() => AGENCIES.filter((a) => a.featured).slice(0, 4), []);
  const hasFilters = search || categoryFilters.size > 0 || verifiedOnly || featuredOnly;

  const toggleCategory = (cat: string) => {
    setCategoryFilters((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setCategoryFilters(new Set());
    setVerifiedOnly(false);
    setFeaturedOnly(false);
    setPage(1);
  };

  const openDrawer = (a: GovernmentAgency) => setDrawerAgency(a);
  const closeDrawer = () => setDrawerAgency(null);

  const avgRating = AGENCIES.length ? (AGENCIES.reduce((sum, a) => sum + a.rating, 0) / AGENCIES.length).toFixed(1) : '0';
  const totalPrograms = getTotalActivePrograms();
  const stats = useMemo(
    () => [
      { label: 'Total Agencies', value: AGENCIES.length, accent: 'sky' as const },
      { label: 'Verified', value: AGENCIES.filter((a) => a.verified).length, accent: 'violet' as const },
      { label: 'Active Programs', value: totalPrograms, accent: 'emerald' as const },
      { label: 'Avg Rating', value: avgRating, accent: 'amber' as const },
    ],
    [avgRating, totalPrograms]
  );

  return (
    <DirectoryLayout
      title="Government Agencies Directory"
      description="Connect with government agencies and access their programs, regulations, and insights to support your startup journey. Find official guidance, funding opportunities, and regulatory information from Singapore's government bodies."
      ctaHref="/government/create"
      ctaLabel="Register Agency"
      stats={stats}
    >
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-lg" onClick={clearFilters} disabled={!hasFilters}>
            Clear Filters
          </Button>
          <Button variant="outline" size="sm" className="rounded-lg" type="button" aria-label="Export" disabled title="Export coming soon">
            Export
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" aria-hidden />
            <Input
              placeholder="Search agencies by name, programs, or description..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-10 rounded-xl border-gray-200 dark:border-slate-600 dark:bg-slate-800/50"
              aria-label="Search agencies"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value as SortKey); setPage(1); }}
            className="rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-800/50 px-3 py-2 text-sm text-growthlab-slate focus:ring-2 focus:ring-primary min-w-[160px]"
            aria-label="Sort by"
          >
            <option value="rating">Sort by Rating</option>
            <option value="name">Sort by Name</option>
          </select>
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
      </div>

      <div className="flex gap-8">
        <aside className="hidden lg:block w-56 shrink-0">
          <h3 className="text-sm font-semibold text-growthlab-slate mb-3">Filters</h3>
          <p className="text-xs font-medium text-muted mb-2">Agency Category</p>
          <div className="space-y-2">
            {AGENCY_CATEGORIES.map((cat) => (
              <label key={cat} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={categoryFilters.has(cat)}
                  onChange={() => toggleCategory(cat)}
                  className="rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary"
                />
                <span className="text-sm text-growthlab-slate">{cat}</span>
              </label>
            ))}
          </div>
        </aside>

        <div className="flex-1 min-w-0 space-y-6">
          {recommendedAgencies.length > 0 && !hasFilters && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50/80 dark:bg-slate-800/30 p-4 border-l-4 border-l-emerald-500/50">
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span className="text-sm font-medium text-growthlab-slate">Recommended</span>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {recommendedAgencies.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => openDrawer(a)}
                    className="flex shrink-0 items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900/50 px-3 py-2 min-w-[180px] hover:border-primary/50 hover:bg-primary/[0.04] dark:hover:bg-primary/10 transition-colors text-left"
                  >
                    <div className="h-10 w-10 shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                      {a.logo ? <img src={a.logo} alt="" className="h-full w-full object-cover" /> : <Building2 className="h-5 w-5 text-muted" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-growthlab-slate truncate">{a.name}</p>
                      <p className="text-xs text-muted truncate">{a.category} · {a.location}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {featuredAgencies.length > 0 && !hasFilters && sorted.length > 0 && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-gradient-to-br from-primary/[0.06] to-slate-50/80 dark:from-primary/10 dark:to-slate-800/30 p-4 border-l-4 border-l-primary/50">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-growthlab-slate">Featured agencies</span>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {featuredAgencies.map((a) => (
                  <Link
                    key={a.id}
                    href={`/government/${a.id}`}
                    className="flex shrink-0 items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900/50 px-3 py-2 min-w-[200px] hover:border-primary/50 hover:bg-primary/[0.04] dark:hover:bg-primary/10 transition-colors"
                  >
                    <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 dark:bg-primary/15 flex items-center justify-center overflow-hidden">
                      {a.logo ? <img src={a.logo} alt="" className="h-full w-full object-cover" /> : <Building2 className="h-5 w-5 text-primary" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-growthlab-slate truncate">{a.name}</p>
                      <p className="text-xs text-muted truncate">{a.category} · {a.location}</p>
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
                <h3 className="text-lg font-semibold text-growthlab-slate mb-2">No agencies found</h3>
                <p className="text-muted mb-6 max-w-sm mx-auto">Try different search terms or filters.</p>
                <Button variant="outline" className="rounded-lg border-slate-300 dark:border-slate-600" onClick={clearFilters}>
                  Clear filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <p className="text-sm text-muted">
                Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, sorted.length)} of {sorted.length} agenc{sorted.length !== 1 ? 'ies' : 'y'}
              </p>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {paginated.map((a) => (
                  <AgencyCard key={a.id} agency={a} onOpenProfile={() => openDrawer(a)} />
                ))}
              </div>
              {totalPages > 1 && (
                <nav className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-700" aria-label="Pagination">
                  <p className="text-sm text-muted">Page {safePage} of {totalPages}</p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="rounded-lg" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage <= 1} aria-label="Previous page">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="flex items-center gap-1 px-2 text-sm text-muted">
                      {safePage} / {totalPages}
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
            <h2 className="text-xl sm:text-2xl font-bold text-growthlab-slate mb-2">Represent a government agency?</h2>
            <p className="text-muted max-w-2xl mx-auto mb-6">
              Register your agency to list programs, regulations, and contact information for startups.
            </p>
            <Link href="/government/create">
              <Button className="btn-primary rounded-lg px-5">Register Agency</Button>
            </Link>
          </section>
        </div>
      </div>

      <AgencyProfileDrawer agency={drawerAgency} open={!!drawerAgency} onClose={closeDrawer} />
    </DirectoryLayout>
  );
}

function AgencyCard({ agency, onOpenProfile }: { agency: GovernmentAgency; onOpenProfile: () => void }) {
  const showMorePrograms = agency.programs.length > 2;
  const displayPrograms = agency.programs.slice(0, 2);
  return (
    <Card className={cn('gs-card-hover rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/30', agency.featured && 'ring-1 ring-primary/20')}>
      <CardContent className="p-5">
        <div
          role="button"
          tabIndex={0}
          onClick={onOpenProfile}
          onKeyDown={(e) => e.key === 'Enter' && onOpenProfile()}
          className="cursor-pointer -m-5 p-5 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
          aria-label={`View ${agency.name} profile`}
        >
          <div className="relative flex items-start gap-3 mb-3">
            <div className="h-12 w-12 shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200/80 dark:border-slate-600/80 overflow-hidden">
              {agency.logo ? (
                <img src={agency.logo} alt="" className="h-full w-full object-cover" />
              ) : (
                <Building2 className="h-6 w-6 text-muted" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-growthlab-slate truncate">{agency.name}</h3>
                {agency.verified && (
                  <span className="inline-flex items-center rounded-md bg-primary/12 text-primary dark:bg-primary/20 dark:text-primary text-[10px] font-medium px-1.5 py-0.5 border border-primary/25">
                    <Award className="h-3 w-3 mr-0.5" /> Verified
                  </span>
                )}
                {agency.featured && (
                  <span className="inline-flex items-center rounded-md bg-primary/12 text-primary dark:bg-primary/20 dark:text-primary text-[10px] font-medium px-1.5 py-0.5 border border-primary/25 dark:border-primary/30">
                    Featured
                  </span>
                )}
              </div>
              <p className="text-sm text-muted truncate mt-0.5">{agency.category} · {agency.location}</p>
            </div>
          </div>

          <p className="text-sm text-muted line-clamp-2 mb-4">{agency.description}</p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {displayPrograms.map((p) => (
              <span key={p} className="rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 px-2.5 py-0.5 text-xs font-medium text-growthlab-slate dark:text-slate-200">
                {p}
              </span>
            ))}
            {showMorePrograms && (
              <span className="rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 px-2.5 py-0.5 text-xs font-medium text-muted">
                +{agency.programs.length - 2} more
              </span>
            )}
          </div>

          <div className="space-y-1.5 text-sm text-muted mb-4">
            <span className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400 shrink-0" />
              {agency.rating} {agency.reviewCount != null && `(${agency.reviewCount} reviews)`}
            </span>
            <span className="flex items-center gap-1.5">
              <FileText className="h-4 w-4 shrink-0 text-muted" />
              {agency.programs.length} programs
            </span>
            {agency.regulationsCount != null && (
              <span className="flex items-center gap-1.5">
                <FileText className="h-4 w-4 shrink-0 text-muted" />
                {agency.regulationsCount} regulations
              </span>
            )}
            {agency.phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="h-4 w-4 shrink-0 text-muted" />
                {agency.phone}
              </span>
            )}
          </div>

          {agency.keyInsights && agency.keyInsights.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-growthlab-slate mb-1.5">Key Insights:</p>
              <ul className="space-y-1">
                {agency.keyInsights.slice(0, 2).map((insight, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-muted">
                    <Lightbulb className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary" />
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto overflow-y-hidden pt-3 mt-1 border-t border-slate-200 dark:border-slate-700 min-w-0" onClick={(e) => e.stopPropagation()}>
          <Button size="sm" variant="outline" className="rounded-lg gap-1.5 shrink-0">
            <MessageCircle className="h-4 w-4" /> Connect
          </Button>
          <Button size="sm" variant="outline" className="rounded-lg gap-1.5 shrink-0" asChild>
            <Link href="/messages">
              <Send className="h-4 w-4" /> Message
            </Link>
          </Button>
          <Button size="sm" className="rounded-lg gap-1.5 btn-primary shrink-0 min-w-[7.5rem]" asChild>
            <Link href={`/government/${agency.id}`} className="inline-flex items-center justify-center">View Details</Link>
          </Button>
          <button type="button" className="rounded-full p-2 shrink-0 border border-primary/30 bg-white dark:bg-slate-800/50 text-primary hover:bg-primary/5" aria-label="Share">
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
