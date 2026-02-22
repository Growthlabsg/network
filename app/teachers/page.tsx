'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Search,
  Star,
  MessageCircle,
  Share2,
  ExternalLink,
  User,
  Clock,
  DollarSign,
  MapPin,
  Calendar,
  BookOpen,
  ChevronRight,
  Award,
  Eye,
  Send,
} from 'lucide-react';
import { DirectoryLayout } from '@/components/network/directory-layout';
import { TeacherProfileDrawer } from '@/components/teacher/teacher-profile-drawer';
import {
  TEACHERS,
  getRecommendedTeachers,
  type Teacher,
} from '@/lib/mock-teachers';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 9;
const SORT_OPTIONS = ['rating', 'sessions', 'name'] as const;
type SortKey = (typeof SORT_OPTIONS)[number];

const MOCK_RESOURCES = [
  { title: 'Startup fundamentals', type: 'Guide', link: '#' },
  { title: 'Pitch deck template', type: 'Template', link: '#' },
];

const MOCK_FORUM = [
  { title: 'Best practices for first fundraising', author: 'Prof. Lee', replies: 5 },
];

export default function TeachersPage() {
  const [search, setSearch] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [premiumOnly, setPremiumOnly] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>('rating');
  const [page, setPage] = useState(1);
  const [drawerTeacher, setDrawerTeacher] = useState<Teacher | null>(null);

  const filtered = useMemo(() => {
    return TEACHERS.filter((t) => {
      const matchSearch =
        !search ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.expertise.some((x) => x.toLowerCase().includes(search.toLowerCase())) ||
        (t.company && t.company.toLowerCase().includes(search.toLowerCase()));
      const matchVerified = !verifiedOnly || t.verified;
      const matchPremium = !premiumOnly || t.premium;
      const matchAvailable = !availableOnly || t.available;
      return matchSearch && matchVerified && matchPremium && matchAvailable;
    });
  }, [search, verifiedOnly, premiumOnly, availableOnly]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sortBy === 'rating') arr.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'name') arr.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'sessions') arr.sort((a, b) => (b.sessionsCompleted ?? 0) - (a.sessionsCompleted ?? 0));
    return arr;
  }, [filtered, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const paginated = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const recommendedTeachers = useMemo(() => getRecommendedTeachers(4), []);
  const hasFilters = search || verifiedOnly || premiumOnly || availableOnly;

  const clearFilters = () => {
    setSearch('');
    setVerifiedOnly(false);
    setPremiumOnly(false);
    setAvailableOnly(false);
    setPage(1);
  };

  const openDrawer = (t: Teacher) => setDrawerTeacher(t);
  const closeDrawer = () => setDrawerTeacher(null);

  const availableCount = TEACHERS.filter((t) => t.available).length;
  const avgRating = TEACHERS.length ? (TEACHERS.reduce((sum, t) => sum + t.rating, 0) / TEACHERS.length).toFixed(1) : '0';
  const totalSessions = TEACHERS.reduce((sum, t) => sum + (t.sessionsCompleted ?? 0), 0);
  const stats = useMemo(
    () => [
      { label: 'Available Teachers', value: availableCount, accent: 'emerald' as const },
      { label: 'Average Rating', value: avgRating, accent: 'amber' as const },
      { label: 'Sessions Completed', value: totalSessions.toLocaleString(), accent: 'sky' as const },
      { label: 'Success Rate', value: '98%', accent: 'violet' as const },
    ],
    [availableCount, avgRating, totalSessions]
  );

  return (
    <DirectoryLayout
      title="Teachers Directory"
      description="Connect with expert teachers who volunteer to educate startup founders."
      ctaHref="/teachers/create"
      ctaLabel="Join as Teacher"
      stats={stats}
    >
      <Tabs defaultValue="directory" className="space-y-4">
        <TabsList className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <TabsTrigger value="directory" className="data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-slate-900 rounded-md">
            Teachers Directory
          </TabsTrigger>
          <TabsTrigger value="resources" className="data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-slate-900 rounded-md">
            Resources
          </TabsTrigger>
          <TabsTrigger value="forum" className="data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-slate-900 rounded-md">
            Forum
          </TabsTrigger>
        </TabsList>

        <TabsContent value="directory" className="space-y-6 mt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" aria-hidden />
              <Input
                placeholder="Search teachers by name, expertise, or company..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-10 rounded-xl border-gray-200 dark:border-slate-600 dark:bg-slate-800/50"
                aria-label="Search teachers"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value as SortKey); setPage(1); }}
              className="rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-800/50 px-3 py-2 text-sm text-growthlab-slate focus:ring-2 focus:ring-primary min-w-[160px]"
              aria-label="Sort by"
            >
              <option value="rating">Sort by Rating</option>
              <option value="sessions">Sort by Sessions</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => { setAvailableOnly((o) => !o); setPage(1); }}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-medium border transition-colors',
                availableOnly ? 'bg-primary/12 text-primary border-primary/25 dark:bg-primary/20 dark:text-primary dark:border-primary/30' : 'bg-slate-100 text-muted border-transparent hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700'
              )}
            >
              Available
            </button>
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
              onClick={() => { setPremiumOnly((o) => !o); setPage(1); }}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-medium border transition-colors',
                premiumOnly ? 'bg-primary/12 text-primary border-primary/25 dark:bg-primary/20 dark:text-primary dark:border-primary/30' : 'bg-slate-100 text-muted border-transparent hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700'
              )}
            >
              Premium
            </button>
            {hasFilters && (
              <Button variant="outline" size="sm" className="rounded-lg" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>

          {recommendedTeachers.length > 0 && !hasFilters && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50/80 dark:bg-slate-800/30 p-4 border-l-4 border-l-emerald-500/50">
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span className="text-sm font-medium text-growthlab-slate">Recommended</span>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {recommendedTeachers.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => openDrawer(t)}
                    className="flex shrink-0 items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900/50 px-3 py-2 min-w-[180px] hover:border-primary/50 hover:bg-primary/[0.04] dark:hover:bg-primary/10 transition-colors text-left"
                  >
                    <div className="h-10 w-10 shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                      {t.logo ? <img src={t.logo} alt="" className="h-full w-full object-cover" /> : <User className="h-5 w-5 text-muted" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-growthlab-slate truncate">{t.name}</p>
                      <p className="text-xs text-muted truncate">{t.title ?? ''} · {t.location}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted" />
                  </button>
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
                <h3 className="text-lg font-semibold text-growthlab-slate mb-2">No teachers found</h3>
                <p className="text-muted mb-6 max-w-sm mx-auto">Try different search terms or filters.</p>
                <Button variant="outline" className="rounded-lg border-slate-300 dark:border-slate-600" onClick={clearFilters}>
                  Clear filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <p className="text-sm text-muted">
                Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, sorted.length)} of {sorted.length} teacher{sorted.length !== 1 ? 's' : ''}
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {paginated.map((t) => (
                  <TeacherCard key={t.id} teacher={t} onOpenProfile={() => openDrawer(t)} />
                ))}
              </div>
              {totalPages > 1 && (
                <nav className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-700" aria-label="Pagination">
                  <p className="text-sm text-muted">Page {safePage} of {totalPages}</p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="rounded-lg" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage <= 1} aria-label="Previous page">
                      ←
                    </Button>
                    <span className="flex items-center gap-1 px-2 text-sm text-muted">
                      {safePage} / {totalPages}
                    </span>
                    <Button variant="outline" size="sm" className="rounded-lg" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages} aria-label="Next page">
                      →
                    </Button>
                  </div>
                </nav>
              )}
            </>
          )}

          <section className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50/80 dark:bg-slate-800/30 p-8 sm:p-10 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-growthlab-slate mb-2">Share your expertise</h2>
            <p className="text-muted max-w-2xl mx-auto mb-6">
              Join the Teachers directory and help startup founders learn. Create your profile to accept session bookings.
            </p>
            <Link href="/teachers/create">
              <Button className="btn-primary rounded-lg px-5">Join as Teacher</Button>
            </Link>
          </section>
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-growthlab-slate">Learning resources</h2>
          </div>
          <ul className="space-y-2">
            {MOCK_RESOURCES.map((r) => (
              <li key={r.title}>
                <Link href={r.link} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <span className="font-medium text-growthlab-slate">{r.title}</span>
                  <span className="text-xs text-muted">{r.type}</span>
                </Link>
              </li>
            ))}
          </ul>
        </TabsContent>

        <TabsContent value="forum" className="mt-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-growthlab-slate">Discussion</h2>
          </div>
          <ul className="space-y-2">
            {MOCK_FORUM.map((f) => (
              <li key={f.title}>
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-600">
                  <p className="font-medium text-growthlab-slate">{f.title}</p>
                  <p className="text-xs text-muted mt-1">{f.author} · {f.replies} replies</p>
                </div>
              </li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>

      <TeacherProfileDrawer teacher={drawerTeacher} open={!!drawerTeacher} onClose={closeDrawer} />
    </DirectoryLayout>
  );
}

function TeacherCard({ teacher, onOpenProfile }: { teacher: Teacher; onOpenProfile: () => void }) {
  const subtitle = [teacher.title, teacher.company].filter(Boolean).join(' · ');
  return (
    <Card className={cn('gs-card-hover rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/30', teacher.premium && 'ring-1 ring-primary/20')}>
      <CardContent className="p-5">
        <div
          role="button"
          tabIndex={0}
          onClick={onOpenProfile}
          onKeyDown={(e) => e.key === 'Enter' && onOpenProfile()}
          className="cursor-pointer -m-5 p-5 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
          aria-label={`View ${teacher.name} profile`}
        >
          <div className="flex items-start gap-3 mb-3">
            <div className="h-12 w-12 shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200/80 dark:border-slate-600/80 overflow-hidden">
              {teacher.logo ? (
                <img src={teacher.logo} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-sm font-semibold text-muted">
                  {teacher.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-growthlab-slate truncate">{teacher.name}</h3>
                <span className="flex items-center gap-1 text-sm text-muted">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {teacher.rating}
                </span>
              </div>
              {subtitle && <p className="text-sm text-muted truncate mt-0.5">{teacher.title}</p>}
              {teacher.company && <p className="text-xs text-muted truncate">{teacher.company}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted mb-3">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {teacher.location}
            </span>
            {teacher.sessionsCompleted != null && (
              <>
                <span aria-hidden>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  {teacher.sessionsCompleted} sessions
                </span>
              </>
            )}
            {teacher.hourlyRate && (
              <>
                <span aria-hidden>·</span>
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5 shrink-0" />
                  {teacher.hourlyRate}
                </span>
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {teacher.expertise.slice(0, 5).map((tag) => (
              <span key={tag} className="rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 px-2.5 py-0.5 text-xs font-medium text-growthlab-slate dark:text-slate-200">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            {teacher.available && (
              <span className="inline-flex items-center rounded-md bg-primary/12 text-primary dark:bg-primary/20 dark:text-primary text-[10px] font-medium px-1.5 py-0.5 border border-primary/25">
                Available
              </span>
            )}
            {teacher.verified && (
              <span className="inline-flex items-center rounded-md bg-primary/12 text-primary dark:bg-primary/20 dark:text-primary text-[10px] font-medium px-1.5 py-0.5 border border-primary/25">
                <Award className="h-3 w-3 mr-0.5" /> Verified
              </span>
            )}
            {teacher.premium && (
              <span className="inline-flex items-center rounded-md bg-primary/12 text-primary dark:bg-primary/20 dark:text-primary text-[10px] font-medium px-1.5 py-0.5 border border-primary/25 dark:border-primary/30">
                Premium
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Button size="sm" className="flex-1 min-w-0 rounded-lg gap-1.5 btn-primary" asChild>
            <Link href={`/teachers/${teacher.id}`}>
              <Calendar className="h-4 w-4" /> Book Session
            </Link>
          </Button>
          <Button size="sm" variant="outline" className="rounded-lg shrink-0" asChild>
            <Link href={`/teachers/${teacher.id}`} aria-label="Message">
              <MessageCircle className="h-4 w-4" />
            </Link>
          </Button>
          <button type="button" className="rounded-lg p-2 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800" aria-label="Share">
            <Share2 className="h-4 w-4" />
          </button>
          <Link href={`/teachers/${teacher.id}`} className="rounded-lg p-2 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800" aria-label="View profile">
            <Eye className="h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
