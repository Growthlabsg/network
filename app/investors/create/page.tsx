'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InvestorProfileEditDialog } from '@/components/investor/investor-profile-edit-dialog';
import { getEmptyInvestor, getMyInvestorFromStorage, setMyInvestorInStorage } from '@/lib/investor-me';
import type { Investor } from '@/lib/mock-investors';
import { ArrowLeft, Building2 } from 'lucide-react';

export default function CreateInvestorProfilePage() {
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

  const handleSave = (data: Partial<Investor>) => {
    const existing = getMyInvestorFromStorage();
    const base = existing ?? getEmptyInvestor();
    const merged: Investor = { ...base, ...data } as Investor;
    merged.id = 'me';
    setMyInvestorInStorage(merged);
    setOpen(false);
    router.push('/investors/me');
  };

  const initialInvestor = mounted ? (getMyInvestorFromStorage() ?? getEmptyInvestor()) : getEmptyInvestor();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <nav className="flex items-center gap-2 text-sm text-muted mb-8" aria-label="Breadcrumb">
        <Link href="/investors" className="hover:text-primary transition-colors">
          Investor directory
        </Link>
        <span className="text-slate-300 dark:text-slate-600">/</span>
        <span className="font-medium text-growthlab-slate">Create profile</span>
      </nav>

      <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
        <CardContent className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Building2 className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-growthlab-slate">Create your investor profile</h1>
              <p className="text-sm text-muted mt-0.5">Fill in the sections below so startups can find and request to connect with you.</p>
            </div>
          </div>
          <p className="text-sm text-muted mb-6">
            Complete all <strong className="text-growthlab-slate">required</strong> fields (name, type, location, description, investment details, and how to apply). Add recommended fields like tagline, logo, about, and FAQ to make your profile stand out.
          </p>
          <Button className="btn-primary rounded-lg" onClick={() => setOpen(true)}>
            {getMyInvestorFromStorage() ? 'Edit profile' : 'Open profile form'}
          </Button>
          <Link href="/investors" className="ml-3 inline-flex items-center text-sm font-medium text-muted hover:text-primary">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to directory
          </Link>
        </CardContent>
      </Card>

      <InvestorProfileEditDialog
        open={open}
        onOpenChange={setOpen}
        investor={initialInvestor}
        onSave={handleSave}
      />
    </div>
  );
}
