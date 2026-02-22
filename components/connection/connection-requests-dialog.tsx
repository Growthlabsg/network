'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserPlus, Check, X, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

const MOCK_REQUESTS = [
  { id: 'r1', name: 'Jessica Lee', role: 'Product Manager', company: 'InnovateSG', message: 'Hi! I saw your presentation and would love to connect.', avatar: '' },
  { id: 'r2', name: 'Michael Zhang', role: 'Software Engineer', company: 'CodeCraft', message: 'We\'re both in the AI space—could collaborate.', avatar: '' },
];

export function ConnectionRequestsDialog({
  open,
  onOpenChange,
  trigger,
  pendingCount = 0,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  pendingCount?: number;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const isControlled = open !== undefined && onOpenChange !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setOpen = isControlled ? onOpenChange! : setInternalOpen;

  const handleAccept = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };
  const handleDecline = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const count = pendingCount > 0 ? pendingCount : requests.length;

  return (
    <>
      {trigger ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="contents focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F7377] focus-visible:ring-offset-2 rounded-full"
        >
          {trigger}
        </button>
      ) : (
        <Button variant="outline" onClick={() => setOpen(true)} className="relative">
          <UserPlus className="mr-2 h-4 w-4" />
          Requests
          {count > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
              {count}
            </span>
          )}
        </Button>
      )}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden />
          <div className="fixed left-1/2 top-1/2 z-[110] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-gray-200 bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-[#1E293B]">Connection Requests</h2>
            {requests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Bell className="h-12 w-12 text-[#64748B] mb-4" />
                <p className="text-center text-[#64748B]">You have no pending connection requests</p>
              </div>
            ) : (
              <ul className="mt-4 space-y-4">
                {requests.map((req) => (
                  <li key={req.id} className="flex items-start justify-between gap-3 rounded-lg border border-gray-200 p-4">
                    <div className="flex gap-3 min-w-0">
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarFallback>{req.name.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-medium text-[#1E293B]">{req.name}</p>
                        <p className="text-sm text-[#64748B]">{req.role} at {req.company}</p>
                        {req.message && <p className="text-sm text-[#64748B] mt-1 line-clamp-2">{req.message}</p>}
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button size="sm" variant="outline" onClick={() => handleDecline(req.id)} className="h-8 w-8 p-0">
                        <X className="h-4 w-4" />
                      </Button>
                      <Button size="sm" onClick={() => handleAccept(req.id)} className="h-8 w-8 p-0 btn-primary">
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
