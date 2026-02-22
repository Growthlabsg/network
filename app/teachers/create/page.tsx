'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TeacherProfileEditDialog } from '@/components/teacher/teacher-profile-edit-dialog';
import { getEmptyTeacher, getMyTeacherFromStorage, setMyTeacherInStorage } from '@/lib/teacher-me';
import type { Teacher } from '@/lib/mock-teachers';
import { ArrowLeft, School } from 'lucide-react';

export default function CreateTeacherProfilePage() {
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

  const handleSave = (data: Partial<Teacher>) => {
    const existing = getMyTeacherFromStorage();
    const base = existing ?? getEmptyTeacher();
    const merged: Teacher = { ...base, ...data } as Teacher;
    merged.id = 'me';
    setMyTeacherInStorage(merged);
    setOpen(false);
    router.push('/teachers/me');
  };

  const initialTeacher = mounted ? (getMyTeacherFromStorage() ?? getEmptyTeacher()) : getEmptyTeacher();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <nav className="flex items-center gap-2 text-sm text-muted mb-8" aria-label="Breadcrumb">
        <Link href="/teachers" className="hover:text-primary transition-colors">
          Teachers
        </Link>
        <span className="text-slate-300 dark:text-slate-600">/</span>
        <span className="font-medium text-growthlab-slate">Create profile</span>
      </nav>

      <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
        <CardContent className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <School className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-growthlab-slate">Create your teacher profile</h1>
              <p className="text-sm text-muted mt-0.5">Fill in your expertise and how founders can book sessions with you. Your profile will appear in the Teachers directory.</p>
            </div>
          </div>
          <p className="text-sm text-muted mb-6">
            Complete all <strong className="text-growthlab-slate">required</strong> fields (name, title, location, description, expertise, and how to book). Add recommended fields like profile photo, sessions completed, hourly rate, and FAQ to stand out.
          </p>
          <Button className="btn-primary rounded-lg" onClick={() => setOpen(true)}>
            {getMyTeacherFromStorage() ? 'Edit profile' : 'Open profile form'}
          </Button>
          <Link href="/teachers" className="ml-3 inline-flex items-center text-sm font-medium text-muted hover:text-primary">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to directory
          </Link>
        </CardContent>
      </Card>

      <TeacherProfileEditDialog
        open={open}
        onOpenChange={setOpen}
        teacher={initialTeacher}
        onSave={handleSave}
      />
    </div>
  );
}
