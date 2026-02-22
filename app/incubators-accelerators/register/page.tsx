'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const STEPS = ['Program info', 'Details', 'Preview'];

export default function RegisterProgramPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState({
    name: '',
    type: '',
    focus: '',
    duration: '',
    location: '',
    description: '',
    website: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (step === 1) {
      if (!data.name.trim()) e.name = 'Program name is required';
      if (!data.type.trim()) e.type = 'Type is required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validate()) return;
    if (step < 3) setStep((s) => s + 1);
    else setSubmitted(true);
  };

  const prev = () => setStep((s) => Math.max(1, s - 1));

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold text-[#1E293B] mb-2">Program registered</h2>
            <p className="text-[#64748B] mb-4">You can manage your listing from the dashboard.</p>
            <Link href="/incubators-accelerators/dashboard">
              <Button className="btn-primary">Go to dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Link href="/incubators-accelerators" className="link-teal text-sm mb-4 inline-block">← Back to Programs</Link>
      <h1 className="text-2xl font-bold text-[#1E293B] mb-6">Register your program</h1>
      <div className="flex gap-2 mb-8">
        {STEPS.map((_, i) => (
          <div key={i} className={cn('flex-1 h-2 rounded-full', i + 1 <= step ? 'bg-[#0F7377]' : 'bg-gray-200')} />
        ))}
      </div>
      <Card className="max-w-xl">
        <CardContent className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-[#1E293B]">Program info</h2>
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1">Program name *</label>
                <Input value={data.name} onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))} className={errors.name ? 'border-red-500' : ''} />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1">Type *</label>
                <Input value={data.type} onChange={(e) => setData((d) => ({ ...d, type: e.target.value }))} placeholder="e.g. Accelerator, Incubator" className={errors.type ? 'border-red-500' : ''} />
                {errors.type && <p className="text-xs text-red-500 mt-1">{errors.type}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1">Focus</label>
                <Input value={data.focus} onChange={(e) => setData((d) => ({ ...d, focus: e.target.value }))} placeholder="e.g. Early stage" />
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-[#1E293B]">Details</h2>
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1">Duration</label>
                <Input value={data.duration} onChange={(e) => setData((d) => ({ ...d, duration: e.target.value }))} placeholder="e.g. 12 weeks" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1">Location</label>
                <Input value={data.location} onChange={(e) => setData((d) => ({ ...d, location: e.target.value }))} placeholder="e.g. Singapore" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1">Description</label>
                <textarea value={data.description} onChange={(e) => setData((d) => ({ ...d, description: e.target.value }))} rows={3} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1">Website</label>
                <Input value={data.website} onChange={(e) => setData((d) => ({ ...d, website: e.target.value }))} placeholder="https://..." />
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="rounded-lg border border-gray-200 p-4 bg-gray-50 text-sm">
              <p className="font-medium text-[#1E293B]">{data.name || '—'}</p>
              <p className="text-[#64748B]">{data.type} · {data.location}</p>
              <p className="text-[#64748B] mt-1">{data.focus} · {data.duration}</p>
              {data.description && <p className="text-[#64748B] mt-2">{data.description}</p>}
            </div>
          )}
          <div className="mt-6 flex gap-3">
            <Button variant="outline" onClick={prev} disabled={step === 1}>Back</Button>
            <Button className="btn-primary ml-auto" onClick={next}>{step === 3 ? 'Submit' : 'Next'}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
