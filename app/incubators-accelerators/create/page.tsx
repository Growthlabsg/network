'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IncubatorProfileEditDialog } from '@/components/incubator/incubator-profile-edit-dialog';
import { getEmptyIncubator, getMyIncubatorFromStorage, setMyIncubatorInStorage } from '@/lib/incubator-me';
import type { Incubator } from '@/lib/mock-incubators';
import { ArrowLeft, Rocket } from 'lucide-react';

export default function CreateIncubatorProfilePage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = (data: Partial<Incubator>) => {
    const existing = getMyIncubatorFromStorage();
    const base = existing ?? getEmptyIncubator();
    const merged: Incubator = { ...base, ...data } as Incubator;
    merged.id = 'me';
    setMyIncubatorInStorage(merged);
    setOpen(false);
    router.push('/incubators-accelerators/me');
  };

  const initialIncubator = mounted ? (getMyIncubatorFromStorage() ?? getEmptyIncubator()) : getEmptyIncubator();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <nav className="flex items-center gap-2 text-sm text-muted mb-8" aria-label="Breadcrumb">
        <Link href="/incubators-accelerators" className="hover:text-primary transition-colors">
          Incubators & Accelerators
        </Link>
        <span className="text-slate-300 dark:text-slate-600">/</span>
        <span className="font-medium text-growthlab-slate">Create profile</span>
      </nav>

      <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
        <CardContent className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Rocket className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-growthlab-slate">Create your program profile</h1>
              <p className="text-sm text-muted mt-0.5">Fill in the sections below so startups can discover and apply to your program.</p>
            </div>
          </div>
          <p className="text-sm text-muted mb-6">
            Complete all <strong className="text-growthlab-slate">required</strong> fields (name, type, location, description, industries, and how to apply). Add recommended fields like tagline, logo, duration, funding, and FAQ to make your profile stand out.
          </p>
          <Button className="btn-primary rounded-lg" onClick={() => setOpen(true)}>
            {getMyIncubatorFromStorage() ? 'Edit profile' : 'Open profile form'}
          </Button>
          <Link href="/incubators-accelerators" className="ml-3 inline-flex items-center text-sm font-medium text-muted hover:text-primary">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to directory
          </Link>
        </CardContent>
      </Card>

      <IncubatorProfileEditDialog open={open} onOpenChange={setOpen} incubator={initialIncubator} onSave={handleSave} />
    </div>
  );
}
