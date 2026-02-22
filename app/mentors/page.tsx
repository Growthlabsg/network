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
  GraduationCap,
  Clock,
  DollarSign,
  Briefcase,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from 'lucide-react';
import { DirectoryLayout } from '@/components/network/directory-layout';
import { MentorProfileDrawer } from '@/components/mentor/mentor-profile-drawer';
import {
  MENTORS,
  MENTOR_EXPERTISE,
  MENTOR_INDUSTRIES,
  MENTOR_LOCATIONS,
  MENTOR_STATUSES,
  getRecommendedMentors,
  type Mentor,
} from '@/lib/mock-mentors';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 9;
const SORT_OPTIONS = ['rating', 'sessions', 'name', 'newest'] as const;
type SortKey = (typeof SORT_OPTIONS)[number];

export default function MentorsPage() {
  const [search, setSearch] = useState('');
  const [expertise, setExpertise] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState(MENTOR_LOCATIONS[0]);
  const [status, setStatus] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>('rating');
  const [page, setPage] = useState(1);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [drawerMentor, setDrawerMentor] = useState<Mentor | null>(null);
  const [bookRequestedIds, setBookRequestedIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return MENTORS.filter((m) => {
      const matchSearch =
        !search ||
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.description.toLowerCase().includes(search.toLowerCase()) ||
        m.expertise.some((e) => e.toLowerCase().includes(search.toLowerCase())) ||
        m.industries.some((i) => i.toLowerCase().includes(search.toLowerCase()));
      const matchExpertise = !expertise || m.expertise.includes(expertise);
      const matchIndustry = !industry || m.industries.includes(industry);
      const matchLocation = location === 'All Locations' || m.location === location;
      const matchStatus = !status || m.status === status;
      const matchVerified = !verifiedOnly || m.verified;
      const matchFeatured = !featuredOnly || m.featured;
      return matchSearch && matchExpertise && matchIndustry && matchLocation && matchStatus && matchVerified && matchFeatured;
    });
  }, [search, expertise, industry, location, status, verifiedOnly, featuredOnly]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sortBy === 'rating') arr.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'sessions') arr.sort((a, b) => b.sessions - a.sessions);
    else if (sortBy === 'name') arr.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'newest') arr.reverse();
    return arr;
  }, [filtered, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const paginated = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const recommendedMentors = useMemo(() => getRecommendedMentors(4), []);
  const featuredMentors = useMemo(() => MENTORS.filter((m) => m.featured).slice(0, 4), []);
  const hasFilters = search || expertise || industry || (location !== MENTOR_LOCATIONS[0]) || status || verifiedOnly || featuredOnly;

  const openDrawer = (m: Mentor) => setDrawerMentor(m);
  const closeDrawer = () => setDrawerMentor(null);
  const toggleSaved = (id: string) => setSavedIds((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const sendBookRequest = (id: string) => setBookRequestedIds((s) => new Set(s).add(id));

  const stats = useMemo(
    () => [
      { label: 'Mentors', value: MENTORS.length, accent: 'sky' as const },
      { label: 'Sessions', value: MENTORS.reduce((sum, m) => sum + m.sessions, 0).toLocaleString(), accent: 'emerald' as const },
      { label: 'Verified', value: MENTORS.filter((m) => m.verified).length, accent: 'violet' as const },
      { label: 'Available', value: MENTORS.filter((m) => m.status === 'Available').length, accent: 'amber' as const },
    ],
    []
  );

  return (
    <DirectoryLayout
      title="Mentor Directory"
      subtitle="Find mentors for advice and support"
      description="Connect with experienced mentors for 1:1 sessions, workshops, and guidance on scaling, fundraising, and product."
      ctaHref="/mentors/create"
      ctaLabel="Create mentor profile"
      stats={stats}
    >
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col gap-3">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" aria-hidden />
            <Input
              placeholder="Search mentors..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-10 rounded-xl border-gray-200 dark:border-slate-600 dark:bg-slate-800/50 min-h-11"
              aria-label="Search mentors"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 scrollbar-thin md:overflow-visible md:flex-wrap">
            <select
              value={location}
              onChange={(e) => { setLocation(e.target.value); setPage(1); }}
              className="rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-800/50 px-3 py-2.5 text-sm text-growthlab-slate focus:ring-2 focus:ring-primary min-h-11 min-w-[140px] shrink-0"
              aria-label="Location"
            >
              {MENTOR_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <select
              value={expertise}
              onChange={(e) => { setExpertise(e.target.value); setPage(1); }}
              className="rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-800/50 px-3 py-2.5 text-sm text-growthlab-slate focus:ring-2 focus:ring-primary min-h-11 min-w-[140px] shrink-0"
              aria-label="Expertise"
            >
              <option value="">All expertise</option>
              {MENTOR_EXPERTISE.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
            <select
              value={industry}
              onChange={(e) => { setIndustry(e.target.value); setPage(1); }}
              className="rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-800/50 px-3 py-2.5 text-sm text-growthlab-slate focus:ring-2 focus:ring-primary min-h-11 min-w-[140px] shrink-0"
              aria-label="Industry"
            >
              <option value="">All industries</option>
              {MENTOR_INDUSTRIES.map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-800/50 px-3 py-2.5 text-sm text-growthlab-slate focus:ring-2 focus:ring-primary min-h-11 min-w-[120px] shrink-0"
              aria-label="Status"
            >
              <option value="">All status</option>
              {MENTOR_STATUSES.filter((s) => s !== 'All').map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value as SortKey); setPage(1); }}
              className="rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-800/50 px-3 py-2 text-sm text-growthlab-slate focus:ring-2 focus:ring-primary min-w-[140px]"
              aria-label="Sort by"
            >
              <option value="rating">Rating</option>
              <option value="sessions">Sessions</option>
              <option value="name">Name</option>
              <option value="newest">Newest</option>
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

        {recommendedMentors.length > 0 && !hasFilters && (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50/80 dark:bg-slate-800/30 p-4 border-l-4 border-l-emerald-500/50">
            <div className="flex items-center gap-2 mb-3">
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              <span className="text-sm font-medium text-growthlab-slate">Recommended for you</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {recommendedMentors.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => openDrawer(m)}
                  className="flex shrink-0 items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900/50 px-3 py-2 min-w-[180px] hover:border-primary/50 hover:bg-primary/[0.04] dark:hover:bg-primary/10 transition-colors text-left"
                >
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                    {m.logo ? <img src={m.logo} alt="" className="h-full w-full object-cover" /> : <GraduationCap className="h-5 w-5 text-muted" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-growthlab-slate truncate">{m.name}</p>
                    <p className="text-xs text-muted">{m.hourlyRate || m.sessions + ' sessions'}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted" />
                </button>
              ))}
            </div>
          </div>
        )}

        {featuredMentors.length > 0 && !hasFilters && sorted.length > 0 && (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-gradient-to-br from-primary/[0.06] to-slate-50/80 dark:from-primary/10 dark:to-slate-800/30 p-4 border-l-4 border-l-primary/50">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-growthlab-slate">Featured mentors</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {featuredMentors.map((m) => (
                <Link
                  key={m.id}
                  href={`/mentors/${m.id}`}
                  className="flex shrink-0 items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900/50 px-3 py-2 min-w-[200px] hover:border-primary/50 hover:bg-primary/[0.04] dark:hover:bg-primary/10 transition-colors"
                >
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-primary/10 dark:bg-primary/15 flex items-center justify-center overflow-hidden">
                    {m.logo ? <img src={m.logo} alt="" className="h-full w-full object-cover" /> : <GraduationCap className="h-5 w-5 text-primary" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-growthlab-slate truncate">{m.name}</p>
                    <p className="text-xs text-muted">{m.tagline || m.role} · {m.location}</p>
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
              <h3 className="text-lg font-semibold text-growthlab-slate mb-2">No mentors found</h3>
              <p className="text-muted mb-6 max-w-sm mx-auto">Try different search terms or filters.</p>
              <Button variant="outline" className="rounded-lg border-slate-300 dark:border-slate-600" onClick={() => { setSearch(''); setExpertise(''); setIndustry(''); setLocation(MENTOR_LOCATIONS[0]); setStatus(''); setVerifiedOnly(false); setFeaturedOnly(false); setPage(1); }}>
                Clear filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <p className="text-sm text-muted">
              Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, sorted.length)} of {sorted.length} mentor{sorted.length !== 1 ? 's' : ''}
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginated.map((m) => (
                <MentorCard
                  key={m.id}
                  mentor={m}
                  saved={savedIds.has(m.id)}
                  onToggleSaved={() => toggleSaved(m.id)}
                  onOpenProfile={() => openDrawer(m)}
                  bookRequestSent={bookRequestedIds.has(m.id)}
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
                      const pageNum = totalPages <= 5 ? i + 1 : safePage <= 3 ? i + 1 : safePage >= totalPages - 2 ? totalPages - 4 + i : safePage - 2 + i;
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
          <h2 className="text-xl sm:text-2xl font-bold text-growthlab-slate mb-2">Ready to get mentored?</h2>
          <p className="text-muted max-w-2xl mx-auto mb-6">
            Book 1:1 sessions or join workshops. Create your mentor profile to offer your expertise to founders.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/mentors/create">
              <Button className="btn-primary rounded-lg px-5">Create mentor profile</Button>
            </Link>
            <Link href="/mentors">
              <Button variant="outline" className="rounded-lg border-primary text-primary bg-white dark:bg-slate-900/50 hover:bg-primary/5 dark:hover:bg-primary/10">
                Browse all mentors
              </Button>
            </Link>
          </div>
        </section>
      </div>

      <MentorProfileDrawer
        mentor={drawerMentor}
        open={!!drawerMentor}
        onClose={closeDrawer}
        onBookSession={() => drawerMentor && sendBookRequest(drawerMentor.id)}
        bookRequestSent={drawerMentor ? bookRequestedIds.has(drawerMentor.id) : false}
      />
    </DirectoryLayout>
  );
}

function MentorCard({
  mentor,
  saved,
  onToggleSaved,
  onOpenProfile,
  bookRequestSent,
}: {
  mentor: Mentor;
  saved: boolean;
  onToggleSaved: () => void;
  onOpenProfile: () => void;
  bookRequestSent: boolean;
}) {
  return (
    <Card className={cn('gs-card-hover rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/30', mentor.featured && 'ring-1 ring-primary/20')}>
      <CardContent className="p-5">
        <div
          role="button"
          tabIndex={0}
          onClick={onOpenProfile}
          onKeyDown={(e) => e.key === 'Enter' && onOpenProfile()}
          className="cursor-pointer -m-5 p-5 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
          aria-label={`View ${mentor.name} profile`}
        >
          <div className="relative flex items-start gap-3 mb-3">
            <div className="h-12 w-12 shrink-0 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200/80 dark:border-slate-600/80 overflow-hidden">
              {mentor.logo ? (
                <img src={mentor.logo} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-sm font-semibold text-muted">
                  {mentor.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1 pr-8">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-growthlab-slate truncate">{mentor.name}</h3>
                {mentor.verified && (
                  <span className="inline-flex items-center rounded-md bg-primary/12 text-primary dark:bg-primary/20 dark:text-primary text-[10px] font-medium px-1.5 py-0.5 border border-primary/25 dark:border-primary/30">
                    Verified
                  </span>
                )}
                {mentor.featured && (
                  <span className="inline-flex items-center rounded-md bg-primary/12 text-primary text-[10px] font-medium px-1.5 py-0.5 border border-primary/25">
                    Featured
                  </span>
                )}
                {mentor.status === 'Available' && (
                  <span className="inline-flex items-center rounded-md bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 text-[10px] font-medium px-1.5 py-0.5">
                    Available
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1 text-sm text-muted">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden />
                  {mentor.rating}
                </span>
                <span className="text-sm text-muted">·</span>
                <span className="text-sm text-muted truncate">{mentor.tagline || mentor.role || mentor.availability}</span>
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

          <p className="text-sm text-muted line-clamp-3 mb-4">{mentor.description}</p>

          <div className="space-y-2 text-sm text-muted mb-4">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 shrink-0 text-muted" />
              {mentor.location}
            </span>
            {mentor.experience && (
              <span className="flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 shrink-0 text-muted" />
                {mentor.experience}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 shrink-0 text-muted" />
              {mentor.sessions} sessions
            </span>
            {mentor.hourlyRate && (
              <span className="flex items-center gap-1.5">
                <DollarSign className="h-4 w-4 shrink-0 text-muted" />
                {mentor.hourlyRate}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {mentor.expertise.slice(0, 5).map((e) => (
              <span key={e} className="rounded-md border px-2 py-0.5 text-xs font-medium bg-slate-100 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-600/80 text-growthlab-slate dark:text-slate-200">
                {e}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 min-h-11" onClick={(e) => e.stopPropagation()}>
          <Button size="sm" className="flex-1 min-w-0 min-h-11 rounded-xl md:rounded-lg gap-1.5 btn-primary" onClick={onOpenProfile}>
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            {bookRequestSent ? 'Request sent' : 'Book session'}
          </Button>
          <button type="button" className="rounded-full p-2.5 min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 border border-primary/30 bg-white dark:bg-slate-800/50 text-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors flex items-center justify-center" aria-label="Share">
            <Share2 className="h-4 w-4" />
          </button>
          <Link href={`/mentors/${mentor.id}`} className="rounded-full p-2.5 min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 border border-primary/30 bg-white dark:bg-slate-800/50 text-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors flex items-center justify-center" aria-label="Open full profile">
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
