'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import {
  MessageSquare,
  Settings,
  Menu,
  X,
  UserPlus,
  Users,
  LayoutDashboard,
} from 'lucide-react';
import {
  NETWORK_DIRECTORIES,
  getActiveDirectory,
} from '@/lib/network-directories';
import { ConnectionRequestsDialog } from '@/components/connection/connection-requests-dialog';
import { CommunicationHubWidget } from '@/components/network/communication-hub';
import { useMessages } from '@/contexts/messages-context';

const PENDING_REQUESTS_COUNT = 3;

const floatingPillClass =
  'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xl rounded-full border border-slate-200/50 dark:border-slate-700/50';

export function NetworkShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [requestsOpen, setRequestsOpen] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const activeDir = getActiveDirectory(pathname);
  const isHub = pathname === '/';
  const { conversations } = useMessages();
  const messagesUnreadTotal = conversations.reduce((s, c) => s + c.unreadCount, 0);

  useEffect(() => {
    const m = window.matchMedia('(max-width: 768px)');
    setIsMobile(m.matches);
    const listener = () => setIsMobile(m.matches);
    m.addEventListener('change', listener);
    return () => m.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    const handler = () => setRequestsOpen(true);
    window.addEventListener('open-connection-requests', handler);
    return () => window.removeEventListener('open-connection-requests', handler);
  }, []);

  const closeMobileSheet = () => setMobileSheetOpen(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-slate-950 dark:to-slate-900 pb-24 md:pb-0">
      {/* Floating header: directories as direct links (no dropdown) */}
      <div className="fixed left-0 right-0 top-4 z-[100] flex justify-center px-3 pointer-events-none">
        <div
          className={clsx(
            'pointer-events-auto',
            'hidden md:flex items-center justify-center flex-nowrap gap-2 min-h-11 rounded-full px-3 py-2 w-max max-w-[99vw]',
            floatingPillClass
          )}
        >
          {/* My Network + directory names */}
          <div className="flex shrink-0 items-center gap-1.5">
            <Link
              href="/"
              className={clsx(
                'flex shrink-0 items-center justify-center rounded-full h-9 px-3.5 text-sm font-medium transition-colors no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-teal focus-visible:ring-offset-2',
                pathname === '/'
                  ? 'gs-gradient text-white shadow-md'
                  : 'text-[#1E293B] dark:text-slate-200 hover:bg-primary-teal/10 hover:text-primary-teal dark:hover:bg-teal-dark/20 dark:hover:text-teal-dark-light'
              )}
              title="My Network"
            >
              <span className="whitespace-nowrap">My Network</span>
            </Link>
            <span className="h-5 w-px shrink-0 bg-slate-200/80 dark:bg-slate-600/80" aria-hidden />
            {NETWORK_DIRECTORIES.map((dir) => {
              const active =
                pathname === dir.href || pathname.startsWith(dir.href + '/');
              return (
                <Link
                  key={dir.href}
                  href={dir.href}
                  title={dir.label}
                  className={clsx(
                    'flex shrink-0 items-center justify-center rounded-full h-9 px-3 text-sm font-medium transition-colors no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-teal focus-visible:ring-offset-2',
                    active
                      ? 'gs-gradient text-white shadow-md'
                      : 'text-[#1E293B] dark:text-slate-200 hover:bg-primary-teal/10 hover:text-primary-teal dark:hover:bg-teal-dark/20 dark:hover:text-teal-dark-light'
                  )}
                >
                  <span className="whitespace-nowrap">{dir.shortLabel}</span>
                </Link>
              );
            })}
          </div>

          <span className="h-5 w-px shrink-0 bg-slate-200/80 dark:bg-slate-600/80 mx-0.5" aria-hidden />

          {/* Utility icons */}
          <div className="flex shrink-0 items-center gap-0.5">
            <Link
              href="/connections"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-600 dark:text-slate-400 hover:bg-primary-teal/10 hover:text-primary-teal dark:hover:text-teal-dark-light focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-teal focus-visible:ring-offset-2 transition-colors"
              title="Connections"
              aria-label="Connections"
            >
              <Users className="h-5 w-5" />
            </Link>
            <Link
              href="/messages"
              className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-600 dark:text-slate-400 hover:bg-primary-teal/10 hover:text-primary-teal dark:hover:text-teal-dark-light focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-teal focus-visible:ring-offset-2 transition-colors"
              title="Messages"
              aria-label="Messages"
            >
              <MessageSquare className="h-5 w-5" />
              {messagesUnreadTotal > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                  {messagesUnreadTotal}
                </span>
              )}
            </Link>
            <ConnectionRequestsDialog
              open={requestsOpen}
              onOpenChange={setRequestsOpen}
              trigger={
                <span
                  className="relative inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-slate-600 dark:text-slate-400 hover:bg-primary-teal/10 hover:text-primary-teal dark:hover:text-teal-dark-light focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-teal focus-visible:ring-offset-2 transition-colors"
                  title="Connection requests"
                  aria-label="Connection requests"
                >
                  <UserPlus className="h-5 w-5" />
                  {PENDING_REQUESTS_COUNT > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                      {PENDING_REQUESTS_COUNT}
                    </span>
                  )}
                </span>
              }
              pendingCount={PENDING_REQUESTS_COUNT}
            />
            <Link
              href="/settings"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-600 dark:text-slate-400 hover:bg-primary-teal/10 hover:text-primary-teal dark:hover:text-teal-dark-light focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-teal focus-visible:ring-offset-2 transition-colors"
              title="Settings"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </Link>
          </div>

          <span className="h-5 w-px shrink-0 bg-slate-200/80 dark:bg-slate-600/80 mx-0.5" aria-hidden />

          {/* Primary CTA */}
          <Link
            href={activeDir.ctaHref}
            className="flex shrink-0 items-center justify-center rounded-full h-9 px-4 text-sm font-medium gs-gradient text-white shadow-md hover:opacity-95 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-teal focus-visible:ring-offset-2"
          >
            {activeDir.ctaLabel}
          </Link>
        </div>
      </div>

      {/* Mobile: only FAB; no top bar. FAB opens sheet with directories + CTA */}
      <div className="fixed bottom-6 right-6 z-[100] md:hidden">
        <button
          type="button"
          onClick={() => setMobileSheetOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full gs-gradient text-white shadow-lg"
          aria-label="Open Network menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile sheet: directories + CTA + Messages / Settings */}
      {mobileSheetOpen && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm md:hidden transition-opacity duration-200"
            onClick={closeMobileSheet}
            aria-hidden
          />
          <div
            className={clsx(
              'fixed inset-x-0 bottom-0 z-[61] rounded-t-3xl border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl md:hidden',
              'max-h-[85vh] overflow-y-auto'
            )}
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3">
              <span className="font-semibold text-[#1E293B] dark:text-slate-100">
                {isHub ? 'My Network' : activeDir.label}
              </span>
              <button
                type="button"
                onClick={closeMobileSheet}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="p-4 space-y-1" aria-label="Directories">
              <Link
                href="/"
                onClick={closeMobileSheet}
                className={clsx(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                  pathname === '/'
                    ? 'gs-gradient text-white'
                    : 'text-[#1E293B] dark:text-slate-200 hover:bg-primary-teal/10 hover:text-primary-teal dark:hover:text-teal-dark-light'
                )}
              >
                <LayoutDashboard className="h-5 w-5 shrink-0" />
                My Network
              </Link>
              {NETWORK_DIRECTORIES.map((dir) => {
                const active =
                  pathname === dir.href || pathname.startsWith(dir.href + '/');
                return (
                  <Link
                    key={dir.href}
                    href={dir.href}
                    onClick={closeMobileSheet}
                    className={clsx(
                      'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                      active
                        ? 'gs-gradient text-white'
                        : 'text-[#1E293B] dark:text-slate-200 hover:bg-primary-teal/10 hover:text-primary-teal dark:hover:text-teal-dark-light'
                    )}
                  >
                    <dir.icon className="h-5 w-5 shrink-0" />
                    {dir.label}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
              <Link
                href={activeDir.ctaHref}
                onClick={closeMobileSheet}
                className="flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-medium gs-gradient text-white"
              >
                {activeDir.ctaLabel}
              </Link>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/connections"
                  onClick={closeMobileSheet}
                  className="flex items-center justify-center gap-2 rounded-xl border border-primary-teal/30 px-4 py-3 text-sm font-medium text-primary-teal hover:bg-primary-teal/10 flex-1 min-w-0"
                >
                  <Users className="h-4 w-4" />
                  Connections
                </Link>
                <Link
                  href="/messages"
                  onClick={closeMobileSheet}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-600 px-4 py-3 text-sm font-medium text-[#64748B] hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <MessageSquare className="h-4 w-4" />
                  Messages
                  {messagesUnreadTotal > 0 && (
                    <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] text-white ml-1">
                      {messagesUnreadTotal}
                    </span>
                  )}
                </Link>
                <ConnectionRequestsDialog
                  open={requestsOpen}
                  onOpenChange={(o) => {
                    setRequestsOpen(o);
                    if (!o) closeMobileSheet();
                  }}
                  trigger={
                    <span className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-600 px-4 py-3 text-sm font-medium text-[#64748B] hover:bg-slate-50 dark:hover:bg-slate-800">
                      <UserPlus className="h-4 w-4" />
                      Requests
                      {PENDING_REQUESTS_COUNT > 0 && (
                        <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] text-white ml-1">
                          {PENDING_REQUESTS_COUNT}
                        </span>
                      )}
                    </span>
                  }
                  pendingCount={PENDING_REQUESTS_COUNT}
                />
                <Link
                  href="/settings"
                  onClick={closeMobileSheet}
                  className="flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-600 px-4 py-3 text-[#64748B] hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <Settings className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Content: app-like on mobile (rounded top, safe area, extra pb for FAB) */}
      <main className="container mx-auto max-w-7xl pt-20 md:pt-28 pb-safe-fab md:pb-8 min-h-screen md:min-h-0 bg-white dark:bg-slate-900/50 rounded-t-[1.75rem] md:rounded-none shadow-[0_-4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.2)] md:shadow-none pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] md:pl-4 md:pr-4">
        {children}
      </main>

      <CommunicationHubWidget isMobile={isMobile} />
    </div>
  );
}
