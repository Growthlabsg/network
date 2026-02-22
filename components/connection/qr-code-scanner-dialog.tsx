'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { QrCode, X } from 'lucide-react';

interface QRCodeScannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScanResult?: (userId: string) => void;
}

export function QRCodeScannerDialog({ open, onOpenChange, onScanResult }: QRCodeScannerDialogProps) {
  const [scanInput, setScanInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = scanInput.trim();
    if (id) {
      onScanResult?.(id);
      onOpenChange(false);
      setScanInput('');
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm" onClick={() => onOpenChange(false)} aria-hidden />
      <div className="fixed left-1/2 top-1/2 z-[110] w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border border-gray-200 bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#1E293B]">Scan QR or enter ID</h2>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-[#64748B] mb-4">
          Point your camera at a QR code, or paste a connection ID below.
        </p>
        <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 mb-4">
          <QrCode className="h-16 w-16 text-[#64748B]" />
          <span className="sr-only">Camera placeholder (use ID input for demo)</span>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Paste connection ID"
            value={scanInput}
            onChange={(e) => setScanInput(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0F7377] focus:ring-2 focus:ring-[#0F7377]/20"
          />
          <Button type="submit" className="btn-primary mt-3 w-full">Connect</Button>
        </form>
      </div>
    </>
  );
}
