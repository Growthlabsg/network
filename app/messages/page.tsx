'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MessageSquare, Send, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMessages, CONVERSATION_SOURCE_LABELS } from '@/contexts/messages-context';
import { cn } from '@/lib/utils';

function MessagesContent() {
  const searchParams = useSearchParams();
  const openId = searchParams.get('open');
  const { conversations, addMessage, markRead } = useMessages();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (openId && conversations.some((c) => c.id === openId)) {
      setActiveId(openId);
      markRead(openId);
    }
  }, [openId, conversations, markRead]);

  const active = conversations.find((c) => c.id === activeId);

  const handleSend = () => {
    if (!activeId || !inputValue.trim()) return;
    addMessage(activeId, inputValue.trim());
    setInputValue('');
  };

  const handleSelect = (id: string) => {
    setActiveId(id);
    markRead(id);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <Link href="/" className="p-2 -ml-2 rounded-lg hover:bg-gray-100 md:hidden">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-semibold text-[#1E293B]">Messages</h1>
      </div>
      <div className="flex flex-col md:flex-row gap-4 rounded-xl border border-gray-200 bg-white overflow-hidden min-h-[400px]">
        <div className={active ? 'hidden md:flex md:w-80 border-r flex-col' : 'flex flex-col w-full md:w-80'}>
          <ul className="divide-y divide-gray-100">
            {conversations.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(c.id)}
                  className={cn(
                    'w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50',
                    activeId === c.id && 'bg-[#0F7377]/5'
                  )}
                >
                  <div className="h-10 w-10 rounded-full bg-[#0F7377]/20 flex items-center justify-center shrink-0">
                    <span className="text-sm font-medium text-[#0F7377]">{c.participant.name.slice(0, 1)}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-[#1E293B] truncate">{c.participant.name}</p>
                    <p className="text-xs text-[#64748B] truncate">
                      <span className="text-[#0F7377] font-medium">{CONVERSATION_SOURCE_LABELS[c.source]}</span>
                      {c.lastMessage ? ` · ${c.lastMessage}` : ''}
                    </p>
                  </div>
                  {c.unreadCount > 0 && (
                    <span className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#0F7377] text-xs font-medium text-white">
                      {c.unreadCount}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
        {active ? (
          <div className="flex-1 flex flex-col min-h-[300px]">
            <div className="gs-gradient px-4 py-3 flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => setActiveId(null)} className="md:hidden text-white hover:bg-white/20">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="min-w-0">
                <p className="font-semibold text-sm text-white">{active.participant.name}</p>
                <p className="text-xs text-white/80">
                  {CONVERSATION_SOURCE_LABELS[active.source]}
                  {active.participant.role ? ` · ${active.participant.role}` : ''}
                  {active.participant.location ? ` · ${active.participant.location}` : ''}
                </p>
              </div>
            </div>
            <div className="flex-1 p-4 bg-gray-50 overflow-y-auto space-y-3 min-h-[200px]">
              {active.messages.length === 0 ? (
                <p className="text-center text-sm text-[#64748B]">No messages yet. Say hello!</p>
              ) : (
                active.messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      'flex',
                      m.fromMe ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-[85%] rounded-2xl px-4 py-2 text-sm',
                        m.fromMe
                          ? 'bg-[#0F7377] text-white'
                          : 'bg-white border border-gray-200 text-[#1E293B]'
                      )}
                    >
                      {m.text}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-3 border-t flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0F7377] focus:ring-2 focus:ring-[#0F7377]/20"
              />
              <Button size="sm" className="btn-primary" onClick={handleSend} disabled={!inputValue.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center text-[#64748B]">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Select a conversation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="max-w-2xl mx-auto">
        <div className="h-10 mb-4 bg-gray-100 dark:bg-slate-800 rounded w-48" />
        <div className="rounded-xl border border-gray-200 bg-white min-h-[400px] animate-pulse bg-gray-50/50 dark:bg-slate-800/30" />
      </div>
    }>
      <MessagesContent />
    </Suspense>
  );
}
