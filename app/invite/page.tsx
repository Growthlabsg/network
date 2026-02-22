'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Copy, Check, Share2 } from 'lucide-react';

const DEFAULT_INVITE_LINK = 'https://growthlab.example/join?ref=network';

export default function InvitePage() {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(DEFAULT_INVITE_LINK);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to My Network
      </Link>
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/30">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 mb-4">
          <Share2 className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-semibold text-growthlab-slate">Invite to GrowthLab</h1>
        <p className="mt-1 text-sm text-muted">Share your referral link so others can join the ecosystem.</p>
        <div className="mt-4 flex gap-2">
          <Input
            readOnly
            value={DEFAULT_INVITE_LINK}
            className="rounded-lg bg-gray-50 dark:bg-slate-800 text-sm"
          />
          <Button onClick={copyLink} variant="outline" size="sm" className="rounded-lg shrink-0 h-9 w-9 p-0" aria-label={copied ? 'Copied' : 'Copy link'}>
            {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <p className="mt-3 text-xs text-muted">Or invite by email (coming soon).</p>
      </div>
    </div>
  );
}
