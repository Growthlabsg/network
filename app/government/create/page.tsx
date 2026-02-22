'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AgencyProfileEditDialog } from '@/components/agency/agency-profile-edit-dialog';
import { getEmptyAgency, getMyAgencyFromStorage, setMyAgencyInStorage } from '@/lib/agency-me';
import type { GovernmentAgency } from '@/lib/mock-government-agencies';
import { ArrowLeft, Landmark } from 'lucide-react';

export default function CreateGovernmentAgencyPage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setOpen(true);
  }, [mounted]);

  const handleSave = (data: Partial<GovernmentAgency>) => {
    const existing = getMyAgencyFromStorage();
    const base = existing ?? getEmptyAgency();
    const merged: GovernmentAgency = { ...base, ...data } as GovernmentAgency;
    merged.id = 'me';
    setMyAgencyInStorage(merged);
    setOpen(false);
    router.push('/government/me');
  };

  const initialAgency = mounted ? (getMyAgencyFromStorage() ?? getEmptyAgency()) : getEmptyAgency();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <nav className="flex items-center gap-2 text-sm text-muted mb-8" aria-label="Breadcrumb">
        <Link href="/government" className="hover:text-primary transition-colors">
          Government Agencies
        </Link>
        <span className="text-slate-300 dark:text-slate-600">/</span>
        <span className="font-medium text-growthlab-slate">Register Agency</span>
      </nav>

      <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
        <CardContent className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Landmark className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-growthlab-slate">Register your agency</h1>
              <p className="text-sm text-muted mt-0.5">Add your agency to the directory so startups can find your programs, regulations, and contact information.</p>
            </div>
          </div>
          <p className="text-sm text-muted mb-6">
            Complete all <strong className="text-growthlab-slate">required</strong> fields (name, category, location, description, programs, and how to connect). Add recommended fields like logo, key insights, and FAQ to help founders.
          </p>
          <Button className="btn-primary rounded-lg" onClick={() => setOpen(true)}>
            {getMyAgencyFromStorage() ? 'Edit profile' : 'Open profile form'}
          </Button>
          <Link href="/government" className="ml-3 inline-flex items-center text-sm font-medium text-muted hover:text-primary">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to directory
          </Link>
        </CardContent>
      </Card>

      <AgencyProfileEditDialog
        open={open}
        onOpenChange={setOpen}
        agency={initialAgency}
        onSave={handleSave}
      />
    </div>
  );
}
