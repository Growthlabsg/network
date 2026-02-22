'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Bell,
  Eye,
  Database,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [profileVisible, setProfileVisible] = useState(true);
  const [cleared, setCleared] = useState(false);

  const clearLocalData = () => {
    if (typeof window === 'undefined') return;
    const keysToRemove: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key && (key.startsWith('growthlab-') || key.includes('mentor') || key.includes('investor') || key.includes('agency') || key.includes('expert') || key.includes('teacher') || key.includes('incubator'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => window.localStorage.removeItem(k));
    setCleared(true);
    setTimeout(() => setCleared(false), 3000);
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Link
          href="/"
          className="p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-muted hover:text-growthlab-slate transition-colors"
          aria-label="Back to Network"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-growthlab-slate">Network settings</h1>
          <p className="text-sm text-muted">Preferences for this section only. Account and sign out are in the main platform.</p>
        </div>
      </div>

      <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
        <CardHeader className="pb-2">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wider">Preferences</h2>
        </CardHeader>
        <CardContent className="space-y-0 divide-y divide-slate-100 dark:divide-slate-800">
          <label className="flex items-center justify-between gap-4 py-4 cursor-pointer">
            <span className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-muted" />
              <span className="font-medium text-growthlab-slate">Notifications</span>
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={notifications}
              onClick={() => setNotifications((v) => !v)}
              className={cn(
                'relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors',
                notifications ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-600'
              )}
            >
              <span
                className={cn(
                  'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition',
                  notifications ? 'translate-x-5' : 'translate-x-0.5'
                )}
                style={{ marginTop: 2 }}
              />
            </button>
          </label>
          <label className="flex items-center justify-between gap-4 py-4 cursor-pointer">
            <span className="flex items-center gap-3">
              <Eye className="h-5 w-5 text-muted" />
              <span className="font-medium text-growthlab-slate">Profile visible in directories</span>
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={profileVisible}
              onClick={() => setProfileVisible((v) => !v)}
              className={cn(
                'relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors',
                profileVisible ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-600'
              )}
            >
              <span
                className={cn(
                  'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition',
                  profileVisible ? 'translate-x-5' : 'translate-x-0.5'
                )}
                style={{ marginTop: 2 }}
              />
            </button>
          </label>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden mt-6">
        <CardHeader className="pb-2">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wider">Data</h2>
        </CardHeader>
        <CardContent className="space-y-0 divide-y divide-slate-100 dark:divide-slate-800">
          <div className="flex items-center justify-between gap-4 py-4">
            <span className="flex items-center gap-3">
              <Database className="h-5 w-5 text-muted" />
              <div>
                <p className="font-medium text-growthlab-slate">Clear local data</p>
                <p className="text-xs text-muted">Remove saved profiles and messages stored on this device. Does not affect the main platform.</p>
              </div>
            </span>
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg border-slate-300 dark:border-slate-600 shrink-0"
              onClick={clearLocalData}
            >
              {cleared ? 'Cleared' : 'Clear'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50/80 dark:bg-slate-800/30 p-4 flex gap-3">
        <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div className="text-sm text-muted">
          <p className="font-medium text-growthlab-slate mb-1">Part of the main platform</p>
          <p>Sign out, password, and account settings are managed in the main GrowthLab platform. Use the platform menu or profile to access them.</p>
        </div>
      </div>

      <div className="mt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Network
        </Link>
      </div>
    </div>
  );
}
