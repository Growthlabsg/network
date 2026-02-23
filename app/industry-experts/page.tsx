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
  Bookmark,
  User,
  Clock,
  DollarSign,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Award,
  Lightbulb,
  Send,
} from 'lucide-react';
import { DirectoryLayout } from '@/components/network/directory-layout';
import { ExpertProfileDrawer } from '@/components/expert/expert-profile-drawer';
import {
  EXPERTS,
  EXPERT_INDUSTRIES,
  getRecommendedExperts,
  type IndustryExpert,
} from '@/lib/mock-industry-experts';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 9;
const SORT_OPTIONS = ['rating', 'experience', 'name'] as const;
type SortKey = (typeof SORT_OPTIONS)[number];

export default function IndustryExpertsPage() {
  const [search, setSearch] = useState('');
  const [industryFilters, setIndustryFilters] = useState<Set<string>>(new Set());
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>('rating');
  const [page, setPage] = useState(1);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [drawerExpert, setDrawerExpert] = useState<IndustryExpert | null>(null);

  const filtered = useMemo(() => {
    return EXPERTS.filter((e) => {
      const matchSearch =
        !search ||
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.description.toLowerCase().includes(search.toLowerCase()) ||
        e.expertise.some((x) => x.toLowerCase().includes(search.toLowerCase())) ||
        (e.company && e.company.toLowerCase().includes(search.toLowerCase()));
      const matchIndustry = industryFilters.size === 0 || e.expertise.some((ex) => industryFilters.has(ex));
      const matchVerified = !verifiedOnly || e.verified;
      const matchFeatured = !featuredOnly || e.featured;
      return matchSearch && matchIndustry && matchVerified && matchFeatured;
    });
  }, [search, industryFilters, verifiedOnly, featuredOnly]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sortBy === 'rating') arr.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'name') arr.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'experience') {
      const parse = (s: string | undefined) => (s ? parseInt(s.replace(/\D/g, ''), 10) || 0 : 0);
      arr.sort((a, b) => parse(b.experience) - parse(a.experience));
    }
    return arr;
  }, [filtered, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const paginated = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const recommendedExperts = useMemo(() => getRecommendedExperts(4), []);
  const featuredExperts = useMemo(() => EXPERTS.filter((e) => e.featured).slice(0, 4), []);
  const hasFilters = search || industryFilters.size > 0 || verifiedOnly || featuredOnly;

  const toggleIndustry = (ind: string) => {
    setIndustryFilters((prev) => {
      const next = new Set(prev);
      if (next.has(ind)) next.delete(ind);
      else next.add(ind);
      return next;
    });
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setIndustryFilters(new Set());
    setVerifiedOnly(false);
    setFeaturedOnly(false);
    setPage(1);
  };

  const openDrawer = (e: IndustryExpert) => setDrawerExpert(e);
  const closeDrawer = () => setDrawerExpert(null);
  const toggleSaved = (id: string) => setSavedIds((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });

  const avgRating = EXPERTS.length ? (EXPERTS.reduce((sum, e) => sum + e.rating, 0) / EXPERTS.length).toFixed(1) : '0';
  const stats = useMemo(
    () => [
      { label: 'Total Experts', value: EXPERTS.length, accent: 'sky' as const },
      { label: 'Verified', value: EXPERTS.filter((e) => e.verified).length, accent: 'violet' as const },
      { label: 'Featured', value: EXPERTS.filter((e) => e.featured).length, accent: 'amber' as const },
      { label: 'Avg Rating', value: avgRating, accent: 'amber' as const },
    ],
    [avgRating]
  );

  return (
    <DirectoryLayout
      title="Industry Experts Directory"
      description="Connect with experienced industry professionals who can guide your startup journey. Find mentors, advisors, and consultants across various sectors to accelerate your growth."
      ctaHref="/industry-experts/create"
      ctaLabel="Become an Expert"
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
              placeholder="Search experts by name, expertise, or company..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-10 rounded-xl border-gray-200 dark:border-slate-600 dark:bg-slate-800/50"
              aria-label="Search experts"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value as SortKey); setPage(1); }}
            className="rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-800/50 px-3 py-2 text-sm text-growthlab-slate focus:ring-2 focus:ring-primary min-w-[160px]"
            aria-label="Sort by"
          >
            <option value="rating">Sort by Rating</option>
            <option value="experience">Sort by Experience</option>
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
          <p className="text-xs font-medium text-muted mb-2">Industry</p>
          <div className="space-y-2">
            {EXPERT_INDUSTRIES.map((ind) => (
              <label key={ind} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={industryFilters.has(ind)}
                  onChange={() => toggleIndustry(ind)}
                  className="rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary"
                />
                <span className="text-sm text-growthlab-slate">{ind}</span>
              </label>
            ))}
          </div>
        </aside>

        <div className="flex-1 min-w-0 space-y-6">
          {recommendedExperts.length > 0 && !hasFilters && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50/80 dark:bg-slate-800/30 p-4 border-l-4 border-l-emerald-500/50">
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span className="text-sm font-medium text-growthlab-slate">Recommended</span>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {recommendedExperts.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => openDrawer(e)}
                    className="flex shrink-0 items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900/50 px-3 py-2 min-w-[180px] hover:border-primary/50 hover:bg-primary/[0.04] dark:hover:bg-primary/10 transition-colors text-left"
                  >
                    <div className="h-10 w-10 shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                      {e.logo ? <img src={e.logo} alt="" className="h-full w-full object-cover" /> : <User className="h-5 w-5 text-muted" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-growthlab-slate truncate">{e.name}</p>
                      <p className="text-xs text-muted">{e.title ?? ''} · {e.location}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {featuredExperts.length > 0 && !hasFilters && sorted.length > 0 && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-gradient-to-br from-primary/[0.06] to-slate-50/80 dark:from-primary/10 dark:to-slate-800/30 p-4 border-l-4 border-l-primary/50">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-growthlab-slate">Featured experts</span>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {featuredExperts.map((e) => (
                  <Link
                    key={e.id}
                    href={`/industry-experts/${e.id}`}
                    className="flex shrink-0 items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900/50 px-3 py-2 min-w-[200px] hover:border-primary/50 hover:bg-primary/[0.04] dark:hover:bg-primary/10 transition-colors"
                  >
                    <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 dark:bg-primary/15 flex items-center justify-center overflow-hidden">
                      {e.logo ? <img src={e.logo} alt="" className="h-full w-full object-cover" /> : <User className="h-5 w-5 text-primary" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-growthlab-slate truncate">{e.name}</p>
                      <p className="text-xs text-muted">{e.title ?? ''} · {e.location}</p>
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
                <h3 className="text-lg font-semibold text-growthlab-slate mb-2">No experts found</h3>
                <p className="text-muted mb-6 max-w-sm mx-auto">Try different search terms or filters.</p>
                <Button variant="outline" className="rounded-lg border-slate-300 dark:border-slate-600" onClick={clearFilters}>
                  Clear filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <p className="text-sm text-muted">
                Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, sorted.length)} of {sorted.length} expert{sorted.length !== 1 ? 's' : ''}
              </p>
              <div className="grid gap-6 sm:grid-cols-2">
                {paginated.map((e) => (
                  <ExpertCard
                    key={e.id}
                    expert={e}
                    saved={savedIds.has(e.id)}
                    onToggleSaved={() => toggleSaved(e.id)}
                    onOpenProfile={() => openDrawer(e)}
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
            <h2 className="text-xl sm:text-2xl font-bold text-growthlab-slate mb-2">Share your expertise</h2>
            <p className="text-muted max-w-2xl mx-auto mb-6">
              Join the Industry Experts directory to connect with startups and grow your advisory practice.
            </p>
            <Link href="/industry-experts/create">
              <Button className="btn-primary rounded-lg px-5">Become an Expert</Button>
            </Link>
          </section>
        </div>
      </div>

      <ExpertProfileDrawer expert={drawerExpert} open={!!drawerExpert} onClose={closeDrawer} />
    </DirectoryLayout>
  );
}

function ExpertCard({
  expert,
  saved,
  onToggleSaved,
  onOpenProfile,
}: {
  expert: IndustryExpert;
  saved: boolean;
  onToggleSaved: () => void;
  onOpenProfile: () => void;
}) {
  const subtitle = [expert.title, expert.company, expert.location].filter(Boolean).join(' • ');
  return (
    <Card className={cn('gs-card-hover rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/30', expert.featured && 'ring-1 ring-primary/20')}>
      <CardContent className="p-5">
        <div
          role="button"
          tabIndex={0}
          onClick={onOpenProfile}
          onKeyDown={(e) => e.key === 'Enter' && onOpenProfile()}
          className="cursor-pointer -m-5 p-5 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
          aria-label={`View ${expert.name} profile`}
        >
          <div className="relative flex items-start gap-3 mb-3">
            <div className="h-12 w-12 shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200/80 dark:border-slate-600/80 overflow-hidden">
              {expert.logo ? (
                <img src={expert.logo} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-sm font-semibold text-muted">
                  {expert.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1 pr-8">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-growthlab-slate truncate">{expert.name}</h3>
                {expert.verified && (
                  <span className="inline-flex items-center rounded-md bg-primary/12 text-primary dark:bg-primary/20 dark:text-primary text-[10px] font-medium px-1.5 py-0.5 border border-primary/25">
                    Verified
                  </span>
                )}
                {expert.featured && (
                  <span className="inline-flex items-center rounded-md bg-primary/12 text-primary dark:bg-primary/20 dark:text-primary text-[10px] font-medium px-1.5 py-0.5 border border-primary/25 dark:border-primary/30">
                    Featured
                  </span>
                )}
              </div>
              {subtitle && <p className="text-sm text-muted truncate mt-0.5">{subtitle}</p>}
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

          <p className="text-sm text-muted line-clamp-3 mb-4">{expert.description}</p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {expert.expertise.slice(0, 5).map((tag) => (
              <span key={tag} className="rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 px-2.5 py-0.5 text-xs font-medium text-growthlab-slate dark:text-slate-200">
                {tag}
              </span>
            ))}
          </div>

          <div className="space-y-1.5 text-sm text-muted mb-4">
            <span className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400 shrink-0" />
              {expert.rating} {expert.reviewCount != null && `(${expert.reviewCount} reviews)`}
            </span>
            {expert.experience && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 shrink-0 text-muted" />
                {expert.experience}
              </span>
            )}
            {expert.hourlyRate && (
              <span className="flex items-center gap-1.5">
                <DollarSign className="h-4 w-4 shrink-0 text-muted" />
                {expert.hourlyRate}
              </span>
            )}
            {expert.availability && <p className="text-xs text-muted">{expert.availability}</p>}
          </div>

          {expert.keyInsights && expert.keyInsights.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-growthlab-slate mb-1.5">Key Insights:</p>
              <ul className="space-y-1">
                {expert.keyInsights.slice(0, 2).map((insight, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-muted">
                    <Lightbulb className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-500" />
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="pt-3 mt-1 border-t border-slate-200 dark:border-slate-700 space-y-2" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2 flex-wrap">
            <Button size="sm" variant="outline" className="rounded-lg gap-1.5 shrink-0">
              <MessageCircle className="h-4 w-4" /> Connect
            </Button>
            <Button size="sm" variant="outline" className="rounded-lg gap-1.5 shrink-0" asChild>
              <Link href="/messages">
                <Send className="h-4 w-4" /> Message
              </Link>
            </Button>
            <button type="button" className="rounded-full p-2 shrink-0 border border-primary/30 bg-white dark:bg-slate-800/50 text-primary hover:bg-primary/5" aria-label="Share">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
          <Button size="sm" className="w-full rounded-lg gap-1.5 btn-primary justify-center" asChild>
            <Link href={`/industry-experts/${expert.id}`} className="inline-flex items-center justify-center w-full">View Profile</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
