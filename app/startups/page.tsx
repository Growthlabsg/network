'use client';

import { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  MapPin,
  Building,
  Users,
  TrendingUp,
  Rocket,
  Award,
  ArrowUpRight,
  Star,
  Calendar,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Filter,
  Globe,
  List,
  LayoutGrid,
  Heart,
  X,
  Sparkles,
} from 'lucide-react';
import { DirectoryLayout } from '@/components/network/directory-layout';
import { STARTUPS, REGIONS, type Startup } from '@/lib/mock-startups';
import { cn, formatCount } from '@/lib/utils';

const PAGE_SIZE = 12;
const INDUSTRIES = ['Artificial Intelligence', 'Financial Technology', 'Healthcare Technology', 'Clean Technology', 'Education Technology', 'Logistics & Transportation'];
const STAGES = ['Pre-seed', 'Seed', 'Series A', 'Series B'];
const SORT_OPTIONS = ['trending', 'name', 'funding', 'growth', 'newest'] as const;
type SortKey = (typeof SORT_OPTIONS)[number];

/* Elegant, muted palette: slate + soft accents (primary, emerald, sky, amber) */
const STAGE_PILL = 'bg-slate-100 text-slate-700 dark:bg-slate-700/60 dark:text-slate-300 border border-slate-200/80 dark:border-slate-600/80';
const STAGE_PILL_ACCENT = 'bg-primary/10 text-primary border-primary/20 dark:bg-primary/15 dark:border-primary/30';

const STAGE_COLOUR: Record<string, string> = {
  'Pre-seed': STAGE_PILL,
  'Seed': STAGE_PILL,
  'Series A': STAGE_PILL_ACCENT,
  'Series B': STAGE_PILL_ACCENT,
};

const REGION_COLOUR = 'text-muted';

/* Quick filter chip accents when active */
const QUICK_FILTER_ACCENT: Record<string, string> = {
  hiring: 'bg-sky-500/12 text-sky-700 border-sky-500/25 dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/30',
  verified: 'bg-primary/12 text-primary border-primary/25 dark:bg-primary/20 dark:text-primary dark:border-primary/30',
  trending: 'bg-amber-500/12 text-amber-700 border-amber-500/25 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30',
  featured: 'bg-primary/12 text-primary border-primary/25 dark:bg-primary/20 dark:border-primary/30',
};

const DEBOUNCE_MS = 300;

function useDebounced<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function StartupsPageInner() {
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [searchInput, setSearchInput] = useState(() => searchParams.get('q') ?? '');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(() => (searchParams.get('industry')?.split(',').filter(Boolean) ?? []));
  const [selectedStages, setSelectedStages] = useState<string[]>(() => (searchParams.get('stage')?.split(',').filter(Boolean) ?? []));
  const [selectedRegions, setSelectedRegions] = useState<string[]>(() => (searchParams.get('region')?.split(',').filter(Boolean) ?? []));
  const [verifiedOnly, setVerifiedOnly] = useState(() => searchParams.get('verified') === '1');
  const [hiringOnly, setHiringOnly] = useState(() => searchParams.get('hiring') === '1');
  const [partnershipsOnly, setPartnershipsOnly] = useState(() => searchParams.get('partnerships') === '1');
  const [featuredOnly, setFeaturedOnly] = useState(() => searchParams.get('featured') === '1');
  const [trendingOnly, setTrendingOnly] = useState(() => searchParams.get('trending') === '1');
  const [sortBy, setSortBy] = useState<SortKey>(() => (searchParams.get('sort') as SortKey) ?? 'trending');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(() => (searchParams.get('order') === 'asc' ? 'asc' : 'desc'));
  const [page, setPage] = useState(() => Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1));
  const [viewMode, setViewMode] = useState<'card' | 'badge'>(() => (searchParams.get('view') === 'badge' ? 'badge' : 'card'));
  const [savedIds, setSavedIds] = useState<Set<string>>(() => new Set());

  const searchQuery = useDebounced(searchInput, DEBOUNCE_MS);

  const toggleSaved = (id: string) => setSavedIds((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });

  const updateUrl = useCallback(
    (updates: Record<string, string | number | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v === undefined || v === '') params.delete(k);
        else if (k === 'page' && v === 1) params.delete(k);
        else params.set(k, String(v));
      });
      window.history.replaceState({}, '', `?${params.toString()}`);
    },
    [searchParams]
  );

  useEffect(() => {
    updateUrl({
      q: searchInput || undefined,
      industry: selectedIndustries.length ? selectedIndustries.join(',') : undefined,
      stage: selectedStages.length ? selectedStages.join(',') : undefined,
      region: selectedRegions.length ? selectedRegions.join(',') : undefined,
      verified: verifiedOnly ? '1' : undefined,
      hiring: hiringOnly ? '1' : undefined,
      partnerships: partnershipsOnly ? '1' : undefined,
      featured: featuredOnly ? '1' : undefined,
      trending: trendingOnly ? '1' : undefined,
      sort: sortBy,
      order: sortOrder,
      page: page > 1 ? page : undefined,
      view: viewMode === 'badge' ? 'badge' : undefined,
    });
  }, [searchInput, selectedIndustries, selectedStages, selectedRegions, verifiedOnly, hiringOnly, partnershipsOnly, featuredOnly, trendingOnly, sortBy, sortOrder, page, viewMode, updateUrl]);

  const toggle = (arr: string[], val: string) => (arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  const filtered = useMemo(() => {
    return STARTUPS.filter((s) => {
      const matchSearch =
        !searchQuery ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        s.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchIndustry = selectedIndustries.length === 0 || selectedIndustries.includes(s.industry);
      const matchStage = selectedStages.length === 0 || selectedStages.includes(s.stage);
      const matchRegion = selectedRegions.length === 0 || selectedRegions.includes(s.region);
      const matchVerified = !verifiedOnly || s.verified;
      const matchHiring = !hiringOnly || s.hiring;
      const matchPartnerships = !partnershipsOnly || s.partnerships;
      const matchFeatured = !featuredOnly || s.featured;
      const matchTrending = !trendingOnly || s.trending;
      return matchSearch && matchIndustry && matchStage && matchRegion && matchVerified && matchHiring && matchPartnerships && matchFeatured && matchTrending;
    });
  }, [searchQuery, selectedIndustries, selectedStages, selectedRegions, verifiedOnly, hiringOnly, partnershipsOnly, featuredOnly, trendingOnly]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    let aVal: string | number, bVal: string | number;
    list.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'funding':
          aVal = parseFloat(a.funding.replace(/[$,MK]/g, '')) || 0;
          bVal = parseFloat(b.funding.replace(/[$,MK]/g, '')) || 0;
          break;
        case 'growth':
          aVal = parseFloat(a.growthRate.replace('%', '')) || 0;
          bVal = parseFloat(b.growthRate.replace('%', '')) || 0;
          break;
        case 'newest':
          aVal = a.foundedYear;
          bVal = b.foundedYear;
          break;
        case 'trending':
        default:
          aVal = a.trending ? 1 : 0;
          bVal = b.trending ? 1 : 0;
          break;
      }
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortOrder === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [filtered, sortBy, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = useMemo(() => sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE), [sorted, safePage]);

  useEffect(() => {
    if (safePage !== page) setPage(safePage);
  }, [safePage, page]);

  const clearAll = () => {
    setSearchInput('');
    setSelectedIndustries([]);
    setSelectedStages([]);
    setSelectedRegions([]);
    setVerifiedOnly(false);
    setHiringOnly(false);
    setPartnershipsOnly(false);
    setFeaturedOnly(false);
    setTrendingOnly(false);
    setSortBy('trending');
    setSortOrder('desc');
    setPage(1);
  };

  const hasFilters =
    searchInput ||
    selectedIndustries.length > 0 ||
    selectedStages.length > 0 ||
    selectedRegions.length > 0 ||
    verifiedOnly ||
    hiringOnly ||
    partnershipsOnly ||
    featuredOnly ||
    trendingOnly;

  const totalCount = STARTUPS.length;
  const stats = useMemo(
    () => [
      { label: 'Listed', value: formatCount(totalCount), accent: 'primary' as const },
      { label: 'Hiring now', value: STARTUPS.filter((s) => s.hiring).length, accent: 'sky' as const },
      { label: 'Verified', value: STARTUPS.filter((s) => s.verified).length, accent: 'emerald' as const },
      { label: 'Open roles', value: STARTUPS.reduce((sum, s) => sum + s.openPositions, 0), accent: 'amber' as const },
    ],
    [totalCount]
  );

  const featuredStartups = useMemo(() => STARTUPS.filter((s) => s.featured).slice(0, 4), []);

  return (
    <DirectoryLayout
      title="Startup Directory"
      subtitle="Millions of startups worldwide"
      description="Discover and connect with innovative startups. Filter by region, industry, stage, and more."
      ctaHref="/startups/exhibit"
      ctaLabel="Exhibit your startup"
      stats={stats}
    >
      <div className="grid md:grid-cols-4 gap-4 md:gap-6 max-md:min-w-0 max-md:overflow-x-hidden">
        {/* Filters sidebar – collapsible on mobile */}
        <aside
          className={cn(
            'md:col-span-1 space-y-4',
            filtersOpen ? 'block' : 'hidden md:block'
          )}
        >
          <div className="rounded-xl border border-gray-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/30 p-4 md:sticky md:top-24 max-md:max-h-[85vh] max-md:overflow-y-auto max-md:pb-[env(safe-area-inset-bottom)]">
            <div className="flex items-center justify-between mb-4 gap-2">
              <h3 className="font-medium text-growthlab-slate flex items-center gap-2">
                <Filter className="h-4 w-4 text-primary" />
                Filters
              </h3>
              <div className="flex items-center gap-2">
                {hasFilters && (
                  <button type="button" onClick={clearAll} className="text-sm text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded touch-target py-2">
                    Clear all
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  className="md:hidden inline-flex items-center justify-center rounded-lg bg-primary text-white px-4 py-2.5 text-sm font-medium min-h-11 touch-target"
                >
                  Done
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted mb-2 flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-primary/80" />
                  Region
                </p>
                <div className="space-y-1.5">
                  {REGIONS.map((r) => (
                    <label key={r} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedRegions.includes(r)}
                        onChange={() => setSelectedRegions((p) => toggle(p, r))}
                        className="rounded border-slate-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-muted">{r}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted mb-2 flex items-center gap-1.5">
                  <Building className="h-3.5 w-3.5 text-sky-600/80 dark:text-sky-400/80" />
                  Industry
                </p>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {INDUSTRIES.map((ind) => (
                    <label key={ind} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedIndustries.includes(ind)}
                        onChange={() => setSelectedIndustries((p) => toggle(p, ind))}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-muted truncate">{ind}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted mb-2 flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-amber-600/80 dark:text-amber-400/80" />
                  Stage
                </p>
                <div className="space-y-1.5">
                  {STAGES.map((st) => (
                    <label key={st} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedStages.includes(st)}
                        onChange={() => setSelectedStages((p) => toggle(p, st))}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className={cn('text-sm rounded-md border px-1.5 py-0.5', STAGE_COLOUR[st] ?? STAGE_PILL)}>{st}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted mb-2 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600/80 dark:text-emerald-400/80" />
                  Quick filters
                </p>
                <div className="space-y-1.5">
                  {[
                    { key: 'verified', label: 'Verified', value: verifiedOnly, set: setVerifiedOnly },
                    { key: 'hiring', label: 'Hiring', value: hiringOnly, set: setHiringOnly },
                    { key: 'partnerships', label: 'Partnerships', value: partnershipsOnly, set: setPartnershipsOnly },
                    { key: 'featured', label: 'Featured', value: featuredOnly, set: setFeaturedOnly },
                    { key: 'trending', label: 'Trending', value: trendingOnly, set: setTrendingOnly },
                  ].map(({ key, label, value, set }) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={value} onChange={() => set((p: boolean) => !p)} className="rounded border-slate-300 text-primary focus:ring-primary" />
                      <span className="text-sm text-muted">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="md:col-span-3 space-y-4 min-w-0">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" aria-hidden />
                <Input
                  placeholder="Search by name, description, location, tags…"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10 rounded-xl border-gray-200 dark:border-slate-600 dark:bg-slate-800/50 min-h-11"
                  aria-label="Search startups"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin md:overflow-visible md:flex-wrap items-center min-h-11 max-md:overflow-y-hidden max-md:-mx-0">
                <span className="flex items-center rounded-xl border border-gray-200 dark:border-slate-600 p-0.5 shrink-0" role="group" aria-label="View mode">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setViewMode('card');
                      const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
                      params.delete('view');
                      if (typeof window !== 'undefined') window.history.replaceState({}, '', `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`);
                    }}
                    className={cn(
                      'inline-flex h-10 w-10 md:h-9 md:w-9 cursor-pointer items-center justify-center rounded-lg transition-colors touch-target',
                      viewMode === 'card' ? 'bg-primary text-white' : 'text-muted hover:bg-gray-100 dark:hover:bg-slate-800'
                    )}
                    title="Card view"
                    aria-label="Card view"
                    aria-pressed={viewMode === 'card'}
                  >
                    <List className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setViewMode('badge');
                      const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
                      params.set('view', 'badge');
                      if (typeof window !== 'undefined') window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
                    }}
                    className={cn(
                      'inline-flex h-10 w-10 md:h-9 md:w-9 cursor-pointer items-center justify-center rounded-lg transition-colors touch-target',
                      viewMode === 'badge' ? 'bg-primary text-white' : 'text-muted hover:bg-gray-100 dark:hover:bg-slate-800'
                    )}
                    title="Badge view"
                    aria-label="Badge view"
                    aria-pressed={viewMode === 'badge'}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                </span>
                <button
                  type="button"
                  onClick={() => setFiltersOpen((o) => !o)}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-slate-600 px-3 py-2.5 text-sm font-medium text-growthlab-slate min-h-11 touch-target shrink-0 md:hidden"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {hasFilters && <span className="rounded-full bg-primary text-white text-xs px-1.5">•</span>}
                </button>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortKey)}
                  className="rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-800/50 px-3 py-2.5 text-sm text-growthlab-slate focus:ring-2 focus:ring-primary min-h-11 min-w-[120px] shrink-0"
                  aria-label="Sort by"
                >
                  <option value="trending">Trending</option>
                  <option value="newest">Newest</option>
                  <option value="name">Name</option>
                  <option value="funding">Funding</option>
                  <option value="growth">Growth</option>
                </select>
                <Button variant="outline" size="sm" onClick={() => setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))} className="rounded-xl min-h-11 shrink-0 touch-target" aria-label={sortOrder === 'asc' ? 'Ascending' : 'Descending'}>
                  {sortOrder === 'asc' ? 'A–Z' : 'Z–A'}
                </Button>
              </div>
            </div>

            {/* Quick filter chips – horizontal scroll on mobile, wrap on desktop */}
            <div className="flex overflow-x-auto pb-2 scrollbar-thin md:overflow-visible md:flex-wrap items-center gap-2 max-md:overflow-y-hidden">
              {[
                { key: 'hiring', label: 'Hiring', on: hiringOnly, set: setHiringOnly },
                { key: 'verified', label: 'Verified', on: verifiedOnly, set: setVerifiedOnly },
                { key: 'trending', label: 'Trending', on: trendingOnly, set: setTrendingOnly },
                { key: 'featured', label: 'Featured', on: featuredOnly, set: setFeaturedOnly },
              ].map(({ key, label, on, set }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => set((p: boolean) => !p)}
                  className={cn(
                    'rounded-full px-3 py-2 md:py-1.5 text-xs font-medium transition-colors border shrink-0 touch-target',
                    on ? QUICK_FILTER_ACCENT[key] : 'bg-slate-100 text-muted border-transparent hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Active filters – subtle chips */}
            {hasFilters && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted">Active:</span>
                {searchInput && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 px-2.5 py-1 text-xs text-growthlab-slate">
                    “{searchInput}” <button type="button" onClick={() => setSearchInput('')} className="rounded-full p-0.5 hover:bg-slate-200 dark:hover:bg-slate-700" aria-label="Clear search"><X className="h-3 w-3" /></button>
                  </span>
                )}
                {selectedRegions.map((r) => (
                  <span key={r} className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 px-2.5 py-1 text-xs text-growthlab-slate">
                    {r} <button type="button" onClick={() => setSelectedRegions((p) => p.filter((x) => x !== r))} aria-label={`Remove ${r}`}><X className="h-3 w-3" /></button>
                  </span>
                ))}
                {selectedIndustries.slice(0, 2).map((i) => (
                  <span key={i} className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 px-2.5 py-1 text-xs text-growthlab-slate">
                    {i.length > 18 ? i.slice(0, 18) + '…' : i} <button type="button" onClick={() => setSelectedIndustries((p) => p.filter((x) => x !== i))} aria-label={`Remove ${i}`}><X className="h-3 w-3" /></button>
                  </span>
                ))}
                {selectedIndustries.length > 2 && <span className="text-xs text-muted">+{selectedIndustries.length - 2}</span>}
                <button type="button" onClick={clearAll} className="text-xs text-primary hover:underline font-medium">Clear all</button>
              </div>
            )}

            <p className="text-sm text-muted" aria-live="polite">
              Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, sorted.length)} of {sorted.length} {sorted.length === 1 ? 'startup' : 'startups'}
            </p>
          </div>

          {/* Featured strip – soft primary accent */}
          {featuredStartups.length > 0 && !hasFilters && paginated.length > 0 && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-gradient-to-br from-primary/[0.06] to-slate-50/80 dark:from-primary/10 dark:to-slate-800/30 p-4 border-l-4 border-l-primary/50">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-growthlab-slate">Featured startups</span>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin max-md:-mx-0">
                {featuredStartups.map((s) => (
                  <Link
                    key={s.id}
                    href={`/startups/${s.id}`}
                    className="flex shrink-0 items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900/50 px-3 py-2.5 min-w-[180px] sm:min-w-[200px] min-h-11 hover:border-primary/50 hover:bg-primary/[0.04] dark:hover:bg-primary/10 transition-colors touch-target"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/15">
                      <Rocket className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-growthlab-slate truncate">{s.name}</p>
                      <p className="text-xs text-muted">{s.stage} · {s.region}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-muted" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {paginated.length === 0 ? (
            <Card className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-gradient-to-b from-slate-50/80 to-white dark:from-slate-800/30 dark:to-slate-900/30">
              <CardContent className="p-6 sm:p-8 md:p-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 dark:bg-primary/15 text-primary mb-4">
                  <Search className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-semibold text-growthlab-slate mb-2">No startups found</h3>
                <p className="text-muted mb-6 max-w-sm mx-auto">Try different filters or search terms. The directory includes startups from all regions.</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Button variant="outline" onClick={clearAll} className="rounded-lg border-slate-300 dark:border-slate-600 text-growthlab-slate hover:bg-slate-100 dark:hover:bg-slate-800 min-h-11 touch-target">
                    Clear filters
                  </Button>
                  <Button variant="ghost" onClick={() => setFiltersOpen(true)} className="md:hidden rounded-lg text-muted min-h-11 touch-target">
                    Open filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : viewMode === 'badge' ? (
            <div key="badge-view" className="space-y-4">
              <div className="flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 px-4 py-2 w-fit">
                <LayoutGrid className="h-4 w-4 text-muted" aria-hidden />
                <span className="text-sm font-medium text-growthlab-slate">Badge view</span>
                <span className="text-xs text-muted">— compact grid</span>
              </div>
              <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 gap-y-3 sm:gap-y-4" role="list">
                {paginated.map((startup) => (
                  <StartupBadge key={startup.id} startup={startup} saved={savedIds.has(startup.id)} onToggleSaved={() => toggleSaved(startup.id)} stageColour={STAGE_COLOUR[startup.stage] ?? STAGE_PILL} regionColour={REGION_COLOUR} />
                ))}
              </ul>
              {totalPages > 1 && (
                <nav className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 pt-4 border-t border-gray-200 dark:border-slate-700 max-md:flex-col max-md:items-stretch" aria-label="Pagination">
                  <p className="text-sm text-muted order-2 md:order-1 text-center md:text-left">Page {safePage} of {totalPages}</p>
                  <div className="flex items-center justify-center gap-2 order-1 md:order-2">
                    <Button variant="outline" size="sm" className="rounded-lg min-h-11 min-w-11 touch-target" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage <= 1} aria-label="Previous page">
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
                            className={cn('h-10 min-w-[2.5rem] md:h-8 md:min-w-[2rem] rounded-lg text-sm font-medium touch-target', pageNum === safePage ? 'bg-primary text-white' : 'text-muted hover:bg-gray-100 dark:hover:bg-slate-800')}
                            aria-label={`Page ${pageNum}`}
                            aria-current={pageNum === safePage ? 'page' : undefined}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </span>
                    <Button variant="outline" size="sm" className="rounded-lg min-h-11 min-w-11 touch-target" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages} aria-label="Next page">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </nav>
              )}
            </div>
          ) : (
            <div key="card-view" className="contents">
              <ul className="space-y-3 md:space-y-4" role="list">
                {paginated.map((startup) => (
                  <StartupCard key={startup.id} startup={startup} saved={savedIds.has(startup.id)} onToggleSaved={() => toggleSaved(startup.id)} stageColour={STAGE_COLOUR[startup.stage] ?? STAGE_PILL} regionColour={REGION_COLOUR} />
                ))}
              </ul>

              {totalPages > 1 && (
                <nav className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 pt-4 border-t border-gray-200 dark:border-slate-700 max-md:flex-col max-md:items-stretch" aria-label="Pagination">
                  <p className="text-sm text-muted order-2 md:order-1 text-center md:text-left">
                    Page {safePage} of {totalPages}
                  </p>
                  <div className="flex items-center justify-center gap-2 order-1 md:order-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg min-h-11 min-w-11 touch-target"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={safePage <= 1}
                      aria-label="Previous page"
                    >
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
                            className={cn(
                              'h-10 min-w-[2.5rem] md:h-8 md:min-w-[2rem] rounded-lg text-sm font-medium touch-target',
                              pageNum === safePage ? 'bg-primary text-white' : 'text-muted hover:bg-gray-100 dark:hover:bg-slate-800'
                            )}
                            aria-label={`Page ${pageNum}`}
                            aria-current={pageNum === safePage ? 'page' : undefined}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg min-h-11 min-w-11 touch-target"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={safePage >= totalPages}
                      aria-label="Next page"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </nav>
              )}
            </div>
          )}
        </div>
      </div>
    </DirectoryLayout>
  );
}

function StartupsPageSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-10 max-w-md rounded-xl bg-gray-200 dark:bg-slate-700" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 rounded-xl bg-gray-200 dark:bg-slate-700" />
        ))}
      </div>
      <div className="grid md:grid-cols-4 gap-6">
        <div className="h-96 rounded-xl bg-gray-200 dark:bg-slate-700 md:col-span-1" />
        <div className="space-y-4 md:col-span-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-2xl bg-gray-200 dark:bg-slate-700" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function StartupsPage() {
  return (
    <Suspense fallback={<StartupsPageSkeleton />}>
      <StartupsPageInner />
    </Suspense>
  );
}

function StartupBadge({
  startup,
  saved,
  onToggleSaved,
  stageColour,
  regionColour,
}: {
  startup: Startup;
  saved: boolean;
  onToggleSaved: () => void;
  stageColour: string;
  regionColour: string;
}) {
  return (
    <li className="list-none">
      <div className="group relative flex flex-col rounded-2xl border border-gray-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/30 overflow-hidden transition-all duration-200 hover:border-primary hover:shadow-lg hover:shadow-primary/10 hover:bg-primary/[0.04] dark:hover:bg-primary/10">
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleSaved(); }}
          className="absolute right-2 top-2 z-10 rounded-full p-1.5 bg-white/90 dark:bg-slate-800/90 shadow-sm hover:bg-white dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-600"
          aria-label={saved ? 'Unsave' : 'Save'}
        >
          <Heart className={cn('h-4 w-4', saved ? 'fill-rose-500 text-rose-500' : 'text-muted')} />
        </button>
        <Link href={`/startups/${startup.id}`} className="flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset rounded-2xl">
          <div className="relative flex h-20 w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-800/80">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-gray-200/80 dark:border-slate-600 bg-white dark:bg-slate-900 shadow-sm">
              {startup.logo ? (
                <img src={startup.logo} alt="" className="h-full w-full rounded-2xl object-cover" />
              ) : (
                <Rocket className="h-7 w-7 text-primary" />
              )}
            </div>
            {startup.featured && (
              <span className="absolute left-2 top-2 rounded-full bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 p-1" aria-hidden>
                <Star className="h-3.5 w-3.5 text-primary fill-primary/80" />
              </span>
            )}
          </div>
          <div className="flex flex-1 flex-col gap-1.5 p-3 text-left">
            <p className="text-sm font-semibold text-growthlab-slate line-clamp-2 leading-tight group-hover:text-primary transition-colors pr-8">
              {startup.name}
            </p>
            <p className="text-xs">
              <span className={cn('rounded border px-1.5 py-0.5 font-medium', stageColour)}>{startup.stage}</span>
              <span className={cn('ml-1.5', regionColour)}>{startup.region}</span>
            </p>
            <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
              {startup.verified && (
                <span className="inline-flex items-center rounded-md bg-primary/12 dark:bg-primary/20 px-1.5 py-0.5 text-[10px] font-medium text-primary dark:text-primary">
                  <Award className="h-3 w-3 mr-0.5 shrink-0" />
                  Verified
                </span>
              )}
              {startup.trending && (
                <span className="inline-flex items-center rounded-md bg-amber-500/12 dark:bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:text-amber-300">
                  <TrendingUp className="h-3 w-3 mr-0.5 shrink-0" />
                  Trending
                </span>
              )}
              {startup.hiring && startup.openPositions > 0 && (
                <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-growthlab-slate dark:text-slate-200">
                  {startup.openPositions} roles
                </span>
              )}
            </div>
          </div>
        </Link>
      </div>
    </li>
  );
}

function StartupCard({
  startup,
  saved,
  onToggleSaved,
  stageColour,
  regionColour,
}: {
  startup: Startup;
  saved: boolean;
  onToggleSaved: () => void;
  stageColour: string;
  regionColour: string;
}) {
  return (
    <Card className={cn('gs-card-hover rounded-2xl overflow-hidden relative', startup.featured && 'ring-1 ring-primary/20')}>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); onToggleSaved(); }}
        className="absolute right-4 top-4 z-10 rounded-full p-2 bg-white/95 dark:bg-slate-800/95 shadow-sm border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
        aria-label={saved ? 'Unsave' : 'Save'}
      >
        <Heart className={cn('h-4 w-4', saved ? 'fill-rose-400 text-rose-500' : 'text-muted')} />
      </button>
      <CardContent className="p-4 sm:p-5 md:p-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-5">
          <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            {startup.logo ? (
              <img src={startup.logo} alt="" className="w-full h-full object-cover" />
            ) : (
              <Rocket className="h-8 w-8 text-primary" />
            )}
            {startup.featured && (
              <span className="absolute -top-0.5 -right-0.5 rounded-full bg-slate-100 dark:bg-slate-700 p-0.5 border border-slate-200 dark:border-slate-600" aria-hidden>
                <Star className="h-4 w-4 text-primary fill-primary/80" />
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0 pr-10 sm:pr-8">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h3 className="text-base sm:text-lg font-bold text-growthlab-slate break-words">{startup.name}</h3>
              <span className={cn('rounded-md border px-2 py-0.5 text-xs font-medium', stageColour)}>{startup.stage}</span>
              {startup.verified && (
                <Badge variant="secondary" className="text-xs bg-primary/12 text-primary border-0 dark:bg-primary/20 dark:text-primary">
                  <Award className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
              {startup.trending && (
                <Badge variant="outline" className="text-xs border-amber-500/30 bg-amber-500/10 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/15 dark:text-amber-300">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Trending
                </Badge>
              )}
            </div>
            <p className="text-muted text-sm mb-3 md:mb-4 line-clamp-2">{startup.description}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-3 md:mb-4">
              <div className="text-center p-2.5 rounded-xl bg-primary/8 dark:bg-primary/15 border border-primary/15">
                <div className="text-base font-bold text-primary">{startup.funding}</div>
                <div className="text-xs text-muted">Funding</div>
              </div>
              <div className="text-center p-2.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 dark:border-emerald-500/25">
                <div className="text-base font-bold text-emerald-700 dark:text-emerald-400">{startup.growthRate}</div>
                <div className="text-xs text-muted">Growth</div>
              </div>
              <div className="text-center p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-600/80">
                <div className="text-base font-bold text-growthlab-slate">{startup.employees}</div>
                <div className="text-xs text-muted">Team</div>
              </div>
              <div className="text-center p-2.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 dark:border-amber-500/25">
                <div className="text-base font-bold text-amber-700 dark:text-amber-400">{formatCount(startup.views)}</div>
                <div className="text-xs text-muted">Views</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted mb-3 min-w-0">
              <span className="flex items-center gap-1">
                <Building className="h-4 w-4 shrink-0" />
                <span className="break-words">{startup.industry}</span>
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="break-words">{startup.location}</span>
                <span className={regionColour}> · {startup.region}</span>
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4 shrink-0" />
                Founded {startup.foundedYear}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
              {startup.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-600 text-growthlab-slate">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 items-center justify-between gap-y-2">
              <div className="flex flex-wrap gap-2 min-w-0">
                {startup.hiring && (
                  <Badge variant="outline" className="text-xs bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-growthlab-slate dark:text-slate-200">
                    <Users className="h-3 w-3 mr-1" />
                    {startup.openPositions} positions
                  </Badge>
                )}
                {startup.partnerships && (
                  <Badge variant="outline" className="text-xs bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-600">
                    Partnerships
                  </Badge>
                )}
              </div>
              <Link href={`/startups/${startup.id}`} className="min-h-11 inline-flex items-center">
                <Button size="sm" className="btn-primary rounded-lg min-h-11 touch-target">
                  View profile
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
