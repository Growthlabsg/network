'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface SendConnectionRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetName: string;
  onSend?: (message?: string) => void;
}

export function SendConnectionRequestDialog({
  open,
  onOpenChange,
  targetName,
  onSend,
}: SendConnectionRequestDialogProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    onSend?.(message.trim() || undefined);
    setMessage('');
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => onOpenChange(false)} aria-hidden />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-gray-200 bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-[#1E293B]">Send connection request</h2>
        <p className="text-sm text-[#64748B] mt-1">Send a request to {targetName}. Optionally add a message.</p>
        <textarea
          placeholder="Hi, I'd like to connect..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="mt-4 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0F7377] focus:ring-2 focus:ring-[#0F7377]/20"
        />
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSend} className="btn-primary">Send request</Button>
        </div>
      </div>
    </>
  );
}
