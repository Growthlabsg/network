'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Send, X, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMessages, CONVERSATION_SOURCE_LABELS } from '@/contexts/messages-context';
import type { Conversation } from '@/contexts/messages-context';

export type { Conversation };

export function CommunicationHubWidget({ isMobile = false }: { isMobile?: boolean }) {
  const { conversations, addMessage, markRead } = useMessages();
  const [open, setOpen] = useState(false);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);

  const unreadTotal = conversations.reduce((s, c) => s + c.unreadCount, 0);

  const handleSelectConversation = (c: Conversation) => {
    setActiveConversation(c);
    markRead(c.id);
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'fixed z-50 flex items-center justify-center rounded-full gs-gradient text-white shadow-lg w-14 h-14',
          isMobile ? 'right-4 bottom-24' : 'right-6 bottom-6'
        )}
        aria-label="Open messages"
      >
        <MessageSquare className="h-6 w-6" />
        {unreadTotal > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
            {unreadTotal}
          </span>
        )}
      </button>
    );
  }

  if (activeConversation) {
    return (
      <CommunicationHub
        conversations={conversations}
        activeConversation={activeConversation}
        onConversationSelect={setActiveConversation}
        onConversationClose={() => setActiveConversation(null)}
        onMessageSend={addMessage}
        isMobile={isMobile}
      />
    );
  }

  return (
    <div
      className={cn(
        'fixed right-4 w-80 rounded-xl border border-gray-200 bg-white shadow-xl z-50 flex flex-col overflow-hidden max-h-[70vh]',
        isMobile ? 'bottom-24' : 'bottom-6'
      )}
    >
      <div className="gs-gradient px-4 py-3 flex items-center justify-between">
        <span className="font-semibold text-sm text-white">Messages</span>
        <Button variant="ghost" size="sm" onClick={() => setOpen(false)} className="text-white hover:bg-white/20 h-8 w-8 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="overflow-y-auto flex-1 p-2">
        {conversations.length === 0 ? (
          <p className="text-sm text-[#64748B] p-4 text-center">No conversations yet</p>
        ) : (
          <ul className="space-y-1">
            {conversations.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => handleSelectConversation(c)}
                  className="w-full flex items-center gap-3 rounded-lg p-3 text-left hover:bg-gray-100"
                >
                  <div className="h-10 w-10 rounded-full bg-primary-teal/20 flex items-center justify-center shrink-0">
                    <span className="text-sm font-medium text-primary-teal">{c.participant.name.slice(0, 1)}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-[#1E293B] truncate">{c.participant.name}</p>
                    <p className="text-xs text-[#64748B] truncate">
                      <span className="text-primary-teal font-medium">{CONVERSATION_SOURCE_LABELS[c.source]}</span>
                      {c.lastMessage ? ` · ${c.lastMessage}` : ''}
                    </p>
                  </div>
                  {c.unreadCount > 0 && (
                    <span className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary-teal text-xs font-medium text-white">
                      {c.unreadCount}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

interface CommunicationHubProps {
  conversations: Conversation[];
  activeConversation: Conversation;
  onConversationSelect: (c: Conversation) => void;
  onConversationClose: () => void;
  onMessageSend: (conversationId: string, message: string) => void;
  isMobile?: boolean;
}

function CommunicationHub({
  activeConversation,
  onConversationClose,
  onMessageSend,
  isMobile = false,
}: CommunicationHubProps) {
  const [messageInput, setMessageInput] = useState('');

  const handleSend = () => {
    if (!messageInput.trim() || !activeConversation) return;
    onMessageSend(activeConversation.id, messageInput);
    setMessageInput('');
  };

  const messages = activeConversation.messages ?? [];

  return (
    <div
      className={cn(
        'fixed right-4 w-80 rounded-xl border border-gray-200 bg-white shadow-xl z-50 flex flex-col overflow-hidden',
        isMobile ? 'bottom-20' : 'bottom-4'
      )}
    >
      <div className="gs-gradient px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <MessageSquare className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-white truncate">{activeConversation.participant.name}</p>
            <p className="text-xs text-white/80 truncate">
              {CONVERSATION_SOURCE_LABELS[activeConversation.source]}
              {activeConversation.participant.role ? ` · ${activeConversation.participant.role}` : ''}
              {activeConversation.participant.location ? ` · ${activeConversation.participant.location}` : ''}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onConversationClose} className="text-white hover:bg-white/20 h-8 w-8 p-0 shrink-0" title="Back to list">
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 min-h-[200px] max-h-80 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-sm text-[#64748B] py-4">No messages yet. Say hello!</div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={cn('flex', m.fromMe ? 'justify-end' : 'justify-start')}>
              <div
                className={cn(
                  'max-w-[85%] rounded-2xl px-4 py-2 text-sm',
                  m.fromMe ? 'bg-primary-teal text-white' : 'bg-white border border-gray-200 text-[#1E293B]'
                )}
              >
                {m.text}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="p-3 border-t border-gray-200 flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-teal focus:ring-2 focus:ring-primary-teal/20"
        />
        <Button size="sm" onClick={handleSend} disabled={!messageInput.trim()} className="btn-primary shrink-0">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
