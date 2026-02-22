'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExpertProfileEditDialog } from '@/components/expert/expert-profile-edit-dialog';
import { getEmptyExpert, getMyExpertFromStorage, setMyExpertInStorage } from '@/lib/expert-me';
import type { IndustryExpert } from '@/lib/mock-industry-experts';
import { ArrowLeft, User } from 'lucide-react';

export default function CreateIndustryExpertPage() {
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

  const handleSave = (data: Partial<IndustryExpert>) => {
    const existing = getMyExpertFromStorage();
    const base = existing ?? getEmptyExpert();
    const merged: IndustryExpert = { ...base, ...data } as IndustryExpert;
    merged.id = 'me';
    setMyExpertInStorage(merged);
    setOpen(false);
    router.push('/industry-experts/me');
  };

  const initialExpert = mounted ? (getMyExpertFromStorage() ?? getEmptyExpert()) : getEmptyExpert();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <nav className="flex items-center gap-2 text-sm text-muted mb-8" aria-label="Breadcrumb">
        <Link href="/industry-experts" className="hover:text-primary transition-colors">
          Industry Experts
        </Link>
        <span className="text-slate-300 dark:text-slate-600">/</span>
        <span className="font-medium text-growthlab-slate">Become an Expert</span>
      </nav>

      <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
        <CardContent className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <User className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-growthlab-slate">Create your expert profile</h1>
              <p className="text-sm text-muted mt-0.5">Fill in your expertise and how startups can connect with you. Your profile will appear in the Industry Experts directory.</p>
            </div>
          </div>
          <p className="text-sm text-muted mb-6">
            Complete all <strong className="text-growthlab-slate">required</strong> fields (name, title, location, description, expertise, and how to connect). Add recommended fields like profile photo, experience, hourly rate, key insights, and FAQ to stand out.
          </p>
          <Button className="btn-primary rounded-lg" onClick={() => setOpen(true)}>
            {getMyExpertFromStorage() ? 'Edit profile' : 'Open profile form'}
          </Button>
          <Link href="/industry-experts" className="ml-3 inline-flex items-center text-sm font-medium text-muted hover:text-primary">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to directory
          </Link>
        </CardContent>
      </Card>

      <ExpertProfileEditDialog
        open={open}
        onOpenChange={setOpen}
        expert={initialExpert}
        onSave={handleSave}
      />
    </div>
  );
}
