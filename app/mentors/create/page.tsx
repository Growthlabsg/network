'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MentorProfileEditDialog } from '@/components/mentor/mentor-profile-edit-dialog';
import { getEmptyMentor, getMyMentorFromStorage, setMyMentorInStorage } from '@/lib/mentor-me';
import type { Mentor } from '@/lib/mock-mentors';
import { ArrowLeft, GraduationCap } from 'lucide-react';

export default function CreateMentorProfilePage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = (data: Partial<Mentor>) => {
    const existing = getMyMentorFromStorage();
    const base = existing ?? getEmptyMentor();
    const merged: Mentor = { ...base, ...data } as Mentor;
    merged.id = 'me';
    setMyMentorInStorage(merged);
    setOpen(false);
    router.push('/mentors/me');
  };

  const initialMentor = mounted ? (getMyMentorFromStorage() ?? getEmptyMentor()) : getEmptyMentor();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <nav className="flex items-center gap-2 text-sm text-muted mb-8" aria-label="Breadcrumb">
        <Link href="/mentors" className="hover:text-primary transition-colors">
          Mentor directory
        </Link>
        <span className="text-slate-300 dark:text-slate-600">/</span>
        <span className="font-medium text-growthlab-slate">Create profile</span>
      </nav>

      <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
        <CardContent className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <GraduationCap className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-growthlab-slate">Create your mentor profile</h1>
              <p className="text-sm text-muted mt-0.5">Fill in the sections below so founders can find and book sessions with you.</p>
            </div>
          </div>
          <p className="text-sm text-muted mb-6">
            Complete all <strong className="text-growthlab-slate">required</strong> fields (name, location, description, expertise, industries, and how to book). Add recommended fields like tagline, profile photo, about, and FAQ to make your profile stand out.
          </p>
          <Button className="btn-primary rounded-lg" onClick={() => setOpen(true)}>
            {getMyMentorFromStorage() ? 'Edit profile' : 'Open profile form'}
          </Button>
          <Link href="/mentors" className="ml-3 inline-flex items-center text-sm font-medium text-muted hover:text-primary">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to directory
          </Link>
        </CardContent>
      </Card>

      <MentorProfileEditDialog open={open} onOpenChange={setOpen} mentor={initialMentor} onSave={handleSave} />
    </div>
  );
}
