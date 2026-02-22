'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Scan } from 'lucide-react';
import { QRCodeScannerDialog } from '@/components/connection/qr-code-scanner-dialog';

export default function QRNetworkingPage() {
  const [scannerOpen, setScannerOpen] = useState(false);
  const [lastScannedId, setLastScannedId] = useState<string | null>(null);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#1E293B]">QR Networking</h1>
        <p className="text-[#64748B] mt-1">Scan QR codes to quickly connect with others at events.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="gs-card-hover">
          <CardContent className="p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0F7377]/10 mb-4">
              <Scan className="h-6 w-6 text-[#0F7377]" />
            </div>
            <h2 className="text-lg font-semibold text-[#1E293B]">Scan a QR code</h2>
            <p className="text-sm text-[#64748B] mt-1">Point your camera at another member&apos;s QR code to view their profile and send a connection request.</p>
            <Button className="btn-primary mt-4 w-full sm:w-auto" onClick={() => setScannerOpen(true)}>
              <Scan className="h-4 w-4 mr-2" />
              Open scanner
            </Button>
          </CardContent>
        </Card>
        <Card className="gs-card-hover">
          <CardContent className="p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0F7377]/10 mb-4">
              <QrCode className="h-6 w-6 text-[#0F7377]" />
            </div>
            <h2 className="text-lg font-semibold text-[#1E293B]">Your QR code</h2>
            <p className="text-sm text-[#64748B] mt-1">Others can scan your QR to connect with you. Show this at events or share your profile link.</p>
            <div className="mt-4 flex h-32 w-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50">
              <QrCode className="h-16 w-16 text-[#64748B]" />
            </div>
            <p className="text-xs text-[#64748B] mt-2">Profile ID: current-user</p>
          </CardContent>
        </Card>
      </div>
      {lastScannedId && (
        <Card className="mt-6 border-[#0F7377]/30">
          <CardContent className="p-4">
            <p className="text-sm text-[#1E293B]">Last scanned: <strong>{lastScannedId}</strong>. <Link href="/connections" className="text-[#0F7377] hover:underline">View connections</Link></p>
          </CardContent>
        </Card>
      )}
      <QRCodeScannerDialog
        open={scannerOpen}
        onOpenChange={setScannerOpen}
        onScanResult={(id) => setLastScannedId(id)}
      />
    </div>
  );
}
