'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users,
  UserPlus,
  MessageSquare,
  Search,
  TrendingUp,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Filter,
  ArrowUpDown,
  Share2,
  CheckCircle2,
  UserPlus2,
  Bell,
} from 'lucide-react';
import { NETWORK_DIRECTORIES } from '@/lib/network-directories';
import { SendConnectionRequestDialog } from '@/components/connection/send-connection-request-dialog';

type SortOption = 'name' | 'strength' | 'newest';
type ConnectionFilter = 'all' | 'online' | 'strong';

const MOCK_CONNECTIONS = [
  { id: '1', name: 'Alex Wong', role: 'Founder & CEO', company: 'TechNova', connectionStrength: 85, online: true, addedAt: '2024-01-15' },
  { id: '2', name: 'Sarah Chen', role: 'Investment Manager', company: 'Singapore Ventures', connectionStrength: 70, online: false, addedAt: '2024-02-01' },
  { id: '3', name: 'Raj Patel', role: 'CTO', company: 'DataSphere', connectionStrength: 90, online: true, addedAt: '2024-01-20' },
];

const MOCK_SUGGESTIONS = [
  { id: 's1', name: 'Sarah Chen', role: 'Product Manager', company: 'TechCorp', reason: 'Based on your interest in product development', mutualCount: 4, tags: ['Product', 'B2B'] },
  { id: 's2', name: 'Michael Rodriguez', role: 'Software Engineer', company: 'InnovateLab', reason: 'Similar technical background', mutualCount: 2, tags: ['Engineering', 'AI'] },
];

const STATS = [
  { label: 'Connections', value: 12, icon: Users, color: 'text-primary', bg: 'bg-primary/12', hoverBg: 'hover:bg-primary/20' },
  { label: 'Pending', value: 3, icon: UserPlus, color: 'text-secondary', bg: 'bg-secondary/12', hoverBg: 'hover:bg-secondary/20' },
  { label: 'New this week', value: 12, icon: TrendingUp, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/12', hoverBg: 'hover:bg-emerald-500/20' },
  { label: 'Messages', value: 0, icon: MessageSquare, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-500/12', hoverBg: 'hover:bg-violet-500/20' },
];

const MOCK_ACTIVITY = [
  { id: 'a1', type: 'accepted', text: 'Alex Wong accepted your connection request', time: '2h ago', color: 'border-l-emerald-500 bg-emerald-500/5' },
  { id: 'a2', type: 'suggestion', text: 'New suggestion: Michael Rodriguez (2 mutual)', time: '5h ago', color: 'border-l-primary bg-primary/5' },
  { id: 'a3', type: 'pending', text: 'Sarah Chen sent you a connection request', time: '1d ago', color: 'border-l-secondary bg-secondary/5' },
];

const DIRECTORY_ACCENT_COLORS = [
  'hover:border-primary hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20',
  'hover:border-secondary hover:bg-secondary/10 hover:text-secondary dark:hover:bg-secondary/20',
  'hover:border-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400',
  'hover:border-violet-500 hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400',
  'hover:border-primary hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20',
  'hover:border-secondary hover:bg-secondary/10 hover:text-secondary dark:hover:bg-secondary/20',
  'hover:border-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400',
];

function getStrengthBarColor(strength: number) {
  if (strength >= 80) return 'bg-emerald-500';
  if (strength >= 50) return 'bg-secondary';
  return 'bg-gray-400 dark:bg-slate-500';
}

export default function NetworkHubPage() {
  const [activeTab, setActiveTab] = useState('connections');
  const [connections] = useState(MOCK_CONNECTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [connectionFilter, setConnectionFilter] = useState<ConnectionFilter>('all');
  const [suggestions, setSuggestions] = useState(MOCK_SUGGESTIONS);
  const [suggestionTagFilter, setSuggestionTagFilter] = useState<string | null>(null);
  const [sendRequestTarget, setSendRequestTarget] = useState<{ name: string } | null>(null);
  const [loading] = useState(false);

  const openRequestsDialog = () => {
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('open-connection-requests'));
  };

  const filteredAndSortedConnections = useMemo(() => {
    let list = [...connections];
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.role.toLowerCase().includes(q) ||
          c.company.toLowerCase().includes(q)
      );
    }
    if (connectionFilter === 'online') list = list.filter((c) => (c as { online?: boolean }).online);
    if (connectionFilter === 'strong') list = list.filter((c) => c.connectionStrength >= 80);
    if (sortBy === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'strength') list.sort((a, b) => b.connectionStrength - a.connectionStrength);
    if (sortBy === 'newest') list.sort((a, b) => (b as { addedAt?: string }).addedAt?.localeCompare((a as { addedAt?: string }).addedAt ?? '') ?? 0);
    return list;
  }, [connections, searchQuery, connectionFilter, sortBy]);

  const filteredSuggestions = useMemo(() => {
    if (!suggestionTagFilter) return suggestions;
    return suggestions.filter((s) => (s as { tags?: string[] }).tags?.includes(suggestionTagFilter));
  }, [suggestions, suggestionTagFilter]);

  const allSuggestionTags = useMemo(() => {
    const set = new Set<string>();
    suggestions.forEach((s) => (s as { tags?: string[] }).tags?.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [suggestions]);

  const refreshSuggestions = () => {
    setSuggestions((prev) => [...prev].sort(() => Math.random() - 0.5));
  };

  const pendingCount = STATS.find((s) => s.label === 'Pending')?.value ?? 0;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero */}
      <header className="pt-2 pb-6 md:pt-4" aria-label="My Network overview">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="border-b-2 border-primary w-fit pb-1">
            <h1 className="text-2xl font-semibold tracking-tight text-growthlab-slate sm:text-3xl">
              My Network
            </h1>
            <p className="mt-1 text-sm text-muted">
              Your GrowthLab ecosystem at a glance
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={openRequestsDialog} className="btn-outline-primary rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
              <UserPlus className="h-4 w-4 mr-1.5" />
              Requests
              {pendingCount > 0 && (
                <span className="ml-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary/20 px-1.5 text-xs font-semibold text-secondary" aria-label={`${pendingCount} pending`}>
                  {pendingCount}
                </span>
              )}
            </Button>
            <Link href="/connections">
              <Button size="sm" className="btn-primary rounded-full transition-all hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                Find connections
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="sm" className="rounded-full text-muted hover:text-violet-600 hover:bg-violet-500/10 dark:hover:text-violet-400" asChild>
              <Link href="/invite">
                <Share2 className="h-4 w-4 mr-1.5" />
                Invite
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Stats strip – color-coded, Pending clickable */}
      <section className="mb-8" aria-label="Network stats">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl border border-gray-200/80 bg-gray-50/80 px-5 py-4 transition-colors dark:border-slate-700/50 dark:bg-slate-800/30">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            const isPending = stat.label === 'Pending';
            const content = (
              <>
                {i > 0 && <span className="hidden sm:inline h-4 w-px bg-gray-300 dark:bg-slate-600" aria-hidden />}
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.bg} ${stat.color}`}>
                  <Icon className="h-4 w-4 shrink-0" aria-hidden />
                </span>
                <span className="text-sm text-muted">{stat.label}</span>
                <span className="text-sm font-semibold text-growthlab-slate tabular-nums">{stat.value}</span>
              </>
            );
            if (isPending && pendingCount > 0) {
              return (
                <button
                  key={stat.label}
                  type="button"
                  onClick={openRequestsDialog}
                  className={`flex items-center gap-2 rounded-lg px-1 -mx-1 py-0.5 transition-colors ${stat.hoverBg} focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus:outline-none`}
                  aria-label={`${stat.label}: ${stat.value}. Open requests`}
                >
                  {content}
                </button>
              );
            }
            return (
              <div key={stat.label} className="flex items-center gap-2">
                {content}
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent activity */}
      <section className="mb-8" aria-label="Recent activity">
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted mb-3 flex items-center gap-2">
          <Bell className="h-3.5 w-3.5" />
          Recent activity
        </h2>
        <ul className="space-y-2">
          {MOCK_ACTIVITY.map((a) => (
            <li key={a.id} className={`flex items-center gap-3 rounded-xl border-l-4 py-2.5 px-3 ${a.color} border-gray-200/80 dark:border-slate-700/50`}>
              {a.type === 'accepted' && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />}
              {a.type === 'suggestion' && <Sparkles className="h-4 w-4 shrink-0 text-primary" aria-hidden />}
              {a.type === 'pending' && <UserPlus2 className="h-4 w-4 shrink-0 text-secondary" aria-hidden />}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-growthlab-slate">{a.text}</p>
                <p className="text-xs text-muted">{a.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Directories: horizontal chips with accent colors */}
      <section className="mb-10" aria-labelledby="explore-heading">
        <h2 id="explore-heading" className="text-xs font-medium uppercase tracking-wider text-muted mb-3">Explore</h2>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin -mx-1 px-1">
          {NETWORK_DIRECTORIES.map((dir, idx) => {
            const Icon = dir.icon;
            const accent = DIRECTORY_ACCENT_COLORS[idx % DIRECTORY_ACCENT_COLORS.length];
            return (
              <Link
                key={dir.href}
                href={dir.href}
                className={`group flex shrink-0 items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-growthlab-slate transition-all duration-200 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-800/50 ${accent}`}
              >
                <Icon className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
                <span>{dir.shortLabel}</span>
                <ChevronRight className="h-4 w-4 shrink-0 opacity-50 transition-opacity group-hover:opacity-100" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Connections / Pending / Suggestions */}
      <section aria-label="Connections and suggestions">
        <Tabs defaultValue="connections" value={activeTab} onValueChange={(v) => setActiveTab(v)}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <TabsList className="h-auto w-full sm:w-auto flex rounded-full border border-gray-200 bg-gray-100/80 p-1 dark:border-slate-700 dark:bg-slate-800/50 transition-colors">
              <TabsTrigger value="connections" className="rounded-full transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800">
                <Users className="mr-2 h-4 w-4" />
                Connections
              </TabsTrigger>
              <TabsTrigger value="pending" className="rounded-full transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800">
                Pending
              </TabsTrigger>
              <TabsTrigger value="suggestions" className="rounded-full transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800">
                Suggestions
              </TabsTrigger>
            </TabsList>
            {activeTab === 'connections' && (
              <div className="relative w-full sm:w-64">
                <label htmlFor="connection-search" className="sr-only">Search connections</label>
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted pointer-events-none" aria-hidden />
                <Input
                  id="connection-search"
                  placeholder="Search by name, role, company…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 rounded-full border-gray-200 pl-9 transition-colors focus-visible:ring-2 focus-visible:ring-primary dark:border-slate-600 dark:bg-slate-800/50"
                />
              </div>
            )}
            {activeTab === 'suggestions' && (
              <Button variant="ghost" size="sm" className="rounded-full text-muted hover:text-primary text-xs sm:ml-auto" onClick={refreshSuggestions}>
                Refresh suggestions
              </Button>
            )}
          </div>

          <div className="mt-6">
            <TabsContent value="connections" className="mt-0">
              {/* Sort & filter for connections */}
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1.5 text-xs font-medium text-muted">
                  <ArrowUpDown className="h-3.5 w-3.5" />
                  Sort
                </span>
                {(['name', 'strength', 'newest'] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSortBy(opt)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${sortBy === opt ? 'bg-primary text-white' : 'bg-gray-100 text-muted hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600'}`}
                  >
                    {opt === 'name' ? 'Name' : opt === 'strength' ? 'Strength' : 'Newest'}
                  </button>
                ))}
                <span className="mx-1 h-4 w-px bg-gray-300 dark:bg-slate-600" aria-hidden />
                <span className="flex items-center gap-1.5 text-xs font-medium text-muted">
                  <Filter className="h-3.5 w-3.5" />
                  Filter
                </span>
                {(['all', 'online', 'strong'] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setConnectionFilter(f)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${connectionFilter === f ? 'bg-primary text-white' : 'bg-gray-100 text-muted hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600'}`}
                  >
                    {f === 'all' ? 'All' : f === 'online' ? 'Online' : 'Strong (80%+)'}
                  </button>
                ))}
              </div>
              {loading ? (
                <ul className="divide-y divide-gray-200 dark:divide-slate-700">
                  {[1, 2, 3, 4].map((i) => (
                    <li key={i} className="flex items-center gap-4 py-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : filteredAndSortedConnections.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gradient-to-b from-gray-50/80 to-gray-50/40 py-16 px-6 dark:border-slate-600 dark:from-slate-800/40 dark:to-slate-800/20 transition-colors">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4" aria-hidden>
                    <Users className="h-7 w-7" />
                  </div>
                  <p className="text-center text-sm font-medium text-growthlab-slate">
                    {searchQuery ? 'No matches' : 'No connections yet'}
                  </p>
                  <p className="mt-1 text-center text-sm text-muted max-w-xs">
                    {searchQuery ? 'Try a different search term or clear the box.' : 'Explore directories or accept pending requests to start building your network.'}
                  </p>
                  {!searchQuery && (
                    <Button variant="outline" size="sm" className="mt-5 rounded-full btn-outline-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary" onClick={openRequestsDialog}>
                      View requests
                    </Button>
                  )}
                </div>
              ) : (
                <ul className="divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white shadow-sm dark:divide-slate-700/50 dark:border-slate-700/50 dark:bg-slate-900/30 dark:shadow-none">
                  {filteredAndSortedConnections.map((c) => (
                    <li key={c.id} className="flex items-center gap-4 px-4 py-3 first:rounded-t-2xl last:rounded-b-2xl transition-colors hover:bg-gray-50/80 dark:hover:bg-slate-800/50">
                      <div className="relative shrink-0">
                        <Avatar className="h-10 w-10 border-2 border-gray-100 dark:border-slate-700 ring-0">
                          <AvatarFallback className="bg-primary-100 text-primary text-sm font-medium">
                            {c.name.split(' ').map((n) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {'online' in c && (c as { online?: boolean }).online && (
                          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900" aria-label="Online" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-growthlab-slate truncate">{c.name}</p>
                        <p className="text-sm text-muted truncate">{c.role} · {c.company}</p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-200 dark:bg-slate-600" role="presentation">
                            <div className={`h-full rounded-full transition-[width] ${getStrengthBarColor(c.connectionStrength)}`} style={{ width: `${c.connectionStrength}%` }} role="progressbar" aria-valuenow={c.connectionStrength} aria-valuemin={0} aria-valuemax={100} aria-label="Connection strength" />
                          </div>
                          <span className="text-xs text-muted tabular-nums">{c.connectionStrength}%</span>
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <Link href="/messages">
                          <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full text-primary hover:bg-primary/10 p-0" title="Message" aria-label={`Message ${c.name}`}>
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" className="h-8 rounded-full btn-outline-primary text-xs transition-colors" onClick={openRequestsDialog}>
                          Connect
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>

            <TabsContent value="pending" className="mt-0">
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gradient-to-b from-gray-50/80 to-gray-50/40 py-16 px-6 dark:border-slate-600 dark:from-slate-800/40 dark:to-slate-800/20">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4" aria-hidden>
                  <UserPlus className="h-7 w-7" />
                </div>
                <p className="text-center text-sm font-medium text-growthlab-slate">Pending requests</p>
                <p className="mt-1 text-center text-sm text-muted max-w-xs">Review and accept or decline to grow your network.</p>
                <Button size="sm" className="mt-5 rounded-full btn-primary transition-all hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary" onClick={openRequestsDialog}>
                  View all requests
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="suggestions" className="mt-0">
              {allSuggestionTags.length > 0 && (
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-muted">Filter by tag</span>
                  <button
                    type="button"
                    onClick={() => setSuggestionTagFilter(null)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${suggestionTagFilter === null ? 'bg-primary text-white' : 'bg-gray-100 text-muted hover:bg-gray-200 dark:bg-slate-700'}`}
                  >
                    All
                  </button>
                  {allSuggestionTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSuggestionTagFilter(tag)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${suggestionTagFilter === tag ? 'bg-primary text-white' : 'bg-gray-100 text-muted hover:bg-gray-200 dark:bg-slate-700'}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
              <ul className="space-y-3">
                {filteredSuggestions.map((s) => (
                  <li key={s.id} className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-slate-700/50 dark:bg-slate-900/30 dark:hover:shadow-none dark:hover:ring-1 dark:hover:ring-slate-600 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-3 min-w-0">
                      <Avatar className="h-10 w-10 shrink-0 border-2 border-gray-100 dark:border-slate-700">
                        <AvatarFallback className="bg-primary-100 text-primary text-sm">{s.name.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-medium text-growthlab-slate">{s.name}</p>
                        <p className="text-sm text-muted">{s.role} · {s.company}</p>
                        <p className="text-xs text-muted mt-0.5">{s.reason}</p>
                        {'mutualCount' in s && (s as { mutualCount?: number }).mutualCount !== undefined && (
                          <p className="text-xs text-primary mt-1 font-medium">{(s as { mutualCount: number }).mutualCount} mutual</p>
                        )}
                        {'tags' in s && Array.isArray((s as { tags?: string[] }).tags) && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {((s as { tags: string[] }).tags).map((tag) => (
                              <span key={tag} className="rounded-md bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary dark:bg-primary-900/30">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button variant="outline" size="sm" className="rounded-full btn-outline-primary text-xs transition-colors">
                        Message
                      </Button>
                      <Button size="sm" className="rounded-full btn-primary transition-colors hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary" onClick={() => setSendRequestTarget({ name: s.name })} title="Send connection request" aria-label={`Send request to ${s.name}`}>
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </TabsContent>
          </div>
        </Tabs>
      </section>

      {/* CTA strip – multi-color */}
      <section className="mt-14" aria-label="Expand your network">
        <div className="relative overflow-hidden rounded-2xl gs-gradient px-6 py-8 text-center text-white shadow-lg">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.08)_0%,transparent_50%)]" aria-hidden />
          <p className="relative text-lg font-semibold">Expand your network</p>
          <p className="relative mt-1 text-sm text-white/90">Connect with startups, investors, and mentors in the ecosystem.</p>
          <div className="relative mt-5 flex flex-wrap justify-center gap-3">
            <Link href="/startups">
              <Button size="sm" className="rounded-full bg-white text-primary shadow-sm transition-all hover:bg-white/95 hover:shadow focus-visible:ring-2 focus-visible:ring-white/80">
                Startups
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/investors">
              <Button size="sm" className="rounded-full border-2 border-white/80 bg-secondary/90 text-white shadow-sm transition-all hover:bg-secondary hover:border-white focus-visible:ring-2 focus-visible:ring-white/80">
                Investors
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/mentors">
              <Button size="sm" variant="outline" className="rounded-full border-white/80 bg-white/10 text-white transition-all hover:bg-white hover:text-growthlab-slate focus-visible:ring-2 focus-visible:ring-white/80">
                Mentors
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {sendRequestTarget && (
        <SendConnectionRequestDialog
          open={!!sendRequestTarget}
          onOpenChange={(open) => !open && setSendRequestTarget(null)}
          targetName={sendRequestTarget.name}
          onSend={() => {}}
        />
      )}
    </div>
  );
}
