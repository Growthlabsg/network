'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  getNetworkSettings,
  setNetworkSettings,
  applyTheme,
  clearNetworkLocalData,
  type NetworkSettings,
  type Theme,
} from '@/lib/network-settings';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div className="relative shrink-0 mt-0.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div
          className={cn(
            'w-10 h-6 rounded-full transition-colors',
            checked ? 'bg-[#0F7377]' : 'bg-gray-200 dark:bg-slate-600'
          )}
        />
        <div
          className={cn(
            'absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform',
            checked && 'translate-x-4'
          )}
        />
      </div>
      <div>
        <span className="text-sm font-medium text-[#1E293B] dark:text-slate-200 group-hover:text-[#0F7377] dark:group-hover:text-teal-dark-light">
          {label}
        </span>
        {description && (
          <p className="text-xs text-[#64748B] dark:text-slate-400 mt-0.5">{description}</p>
        )}
      </div>
    </label>
  );
}

const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export function NetworkSettingsForm() {
  const [settings, setSettingsState] = useState<NetworkSettings | null>(null);
  const [cleared, setCleared] = useState(false);

  const load = useCallback(() => setSettingsState(getNetworkSettings()), []);
  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!settings) return;
    applyTheme(settings.theme);
  }, [settings?.theme]);

  const update = useCallback((partial: Partial<NetworkSettings>) => {
    setSettingsState((prev) => (prev ? setNetworkSettings({ ...prev, ...partial }) : prev));
  }, []);

  const handleClearLocalData = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (!confirm('Clear all local Network data (messages and preferences)? This cannot be undone.')) return;
    clearNetworkLocalData();
    setCleared(true);
    load();
    window.location.reload();
  }, [load]);

  if (settings === null) {
    return (
      <div className="max-w-xl mx-auto py-8">
        <div className="h-8 w-48 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mb-6" />
        <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 space-y-4">
          <div className="h-10 bg-gray-100 dark:bg-slate-800 rounded" />
          <div className="h-10 bg-gray-100 dark:bg-slate-800 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-[#1E293B] dark:text-slate-100 mb-2">Settings</h1>
      <p className="text-[#64748B] dark:text-slate-400 mb-6">
        Preferences for the Network section. Account and sign out are managed by the main platform.
      </p>

      {/* About */}
      <Card className="rounded-xl border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm mb-6">
        <CardContent className="p-4">
          <p className="text-sm text-[#64748B] dark:text-slate-400">
            This is the <strong className="text-[#1E293B] dark:text-slate-200">Network</strong> section of GrowthLab.
            When embedded in the main platform, your account and sign out are managed there.
          </p>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="rounded-xl border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-[#1E293B] dark:text-slate-100">Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <Toggle
            label="Connection requests"
            description="When someone sends you a connection request"
            checked={settings.notifyConnectionRequests}
            onChange={(v) => update({ notifyConnectionRequests: v })}
          />
          <Toggle
            label="New messages"
            description="When you receive a new message in Network"
            checked={settings.notifyNewMessages}
            onChange={(v) => update({ notifyNewMessages: v })}
          />
        </CardContent>
      </Card>

      {/* Display */}
      <Card className="rounded-xl border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-[#1E293B] dark:text-slate-100">Display</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-[#64748B] dark:text-slate-400 mb-3">Theme (when run standalone)</p>
          <div className="flex flex-wrap gap-2">
            {THEME_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => update({ theme: value })}
                className={cn(
                  'rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
                  settings.theme === value
                    ? 'bg-[#0F7377] text-white border-[#0F7377] dark:bg-teal-dark dark:border-teal-dark'
                    : 'border-gray-300 dark:border-slate-600 text-[#1E293B] dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data */}
      <Card className="rounded-xl border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-[#1E293B] dark:text-slate-100">Data</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-[#64748B] dark:text-slate-400 mb-3">
            Clear messages and preferences stored locally in this section. Does not affect your account on the main platform.
          </p>
          <Button variant="outline" size="sm" onClick={handleClearLocalData} className="rounded-lg">
            Clear local Network data
          </Button>
          {cleared && (
            <p className="text-xs text-[#0F7377] dark:text-teal-dark-light mt-2">Local data cleared. Page reloading.</p>
          )}
        </CardContent>
      </Card>

      <Link href="/" className="inline-flex items-center text-sm font-medium text-[#0F7377] dark:text-teal-dark-light hover:underline">
        Back to Network
      </Link>
    </div>
  );
}
