'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'growthlab-messages';

export interface MessageItem {
  id: string;
  text: string;
  fromMe: boolean;
  at: number;
}

/** Where the conversation originated (directory or context) */
export type ConversationSource =
  | 'startup'
  | 'investor'
  | 'mentor'
  | 'incubator'
  | 'expert'
  | 'teacher'
  | 'government'
  | 'connection';

export const CONVERSATION_SOURCE_LABELS: Record<ConversationSource, string> = {
  startup: 'Startup enquiry',
  investor: 'Investor',
  mentor: 'Mentor',
  incubator: 'Incubator / Accelerator',
  expert: 'Industry expert',
  teacher: 'Teacher',
  government: 'Government agency',
  connection: 'Connection',
};

export interface Conversation {
  id: string;
  participant: { name: string; role?: string; location?: string };
  /** Where this chat came from (startup, investor, mentor, etc.) */
  source: ConversationSource;
  lastMessage?: string;
  unreadCount: number;
  messages: MessageItem[];
}

const INITIAL: Conversation[] = [
  {
    id: 'c1',
    participant: { name: 'Alex Wong', role: 'Founder', location: 'Singapore' },
    source: 'startup',
    lastMessage: 'Thanks for connecting!',
    unreadCount: 1,
    messages: [
      { id: 'm1', text: 'Hi! Great to connect at the event.', fromMe: false, at: Date.now() - 86400000 },
      { id: 'm2', text: 'Thanks for connecting!', fromMe: true, at: Date.now() - 43200000 },
    ],
  },
  {
    id: 'c2',
    participant: { name: 'Sarah Chen', role: 'Investor' },
    source: 'investor',
    lastMessage: "Let's schedule a call",
    unreadCount: 0,
    messages: [
      { id: 'm3', text: "Let's schedule a call", fromMe: false, at: Date.now() - 3600000 },
    ],
  },
];

function loadFromStorage(): Conversation[] {
  if (typeof window === 'undefined') return INITIAL;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL;
    const parsed = JSON.parse(raw) as Conversation[];
    if (!Array.isArray(parsed) || !parsed.length) return INITIAL;
    const validSources: ConversationSource[] = ['startup', 'investor', 'mentor', 'incubator', 'expert', 'teacher', 'government', 'connection'];
    return parsed.map((c) => ({
      ...c,
      source: validSources.includes(c.source as ConversationSource) ? (c.source as ConversationSource) : 'connection',
      messages: Array.isArray(c.messages) ? c.messages : [],
    }));
  } catch {
    return INITIAL;
  }
}

function saveToStorage(conversations: Conversation[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch {
    // ignore
  }
}

interface MessagesContextValue {
  conversations: Conversation[];
  addMessage: (conversationId: string, text: string) => void;
  markRead: (conversationId: string) => void;
}

const MessagesContext = createContext<MessagesContextValue | null>(null);

export function MessagesProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL);

  useEffect(() => {
    setConversations(loadFromStorage());
  }, []);

  useEffect(() => {
    saveToStorage(conversations);
  }, [conversations]);

  const addMessage = useCallback((conversationId: string, text: string) => {
    const msg: MessageItem = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      text: text.trim(),
      fromMe: true,
      at: Date.now(),
    };
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== conversationId) return c;
        return {
          ...c,
          lastMessage: msg.text,
          messages: [...c.messages, msg],
        };
      })
    );
  }, []);

  const markRead = useCallback((conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, unreadCount: 0 } : c))
    );
  }, []);

  const value = useMemo(
    () => ({ conversations, addMessage, markRead }),
    [conversations, addMessage, markRead]
  );

  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>;
}

export function useMessages() {
  const ctx = useContext(MessagesContext);
  if (!ctx) throw new Error('useMessages must be used within MessagesProvider');
  return ctx;
}

export function useMessagesOptional() {
  return useContext(MessagesContext);
}
