'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, UserPlus, MessageSquare } from 'lucide-react';

const MOCK = [
  { id: '1', name: 'Alex Wong', role: 'Founder', company: 'TechNova', strength: 85, online: true },
  { id: '2', name: 'Sarah Chen', role: 'Investor', company: 'VC Fund', strength: 70, online: false },
  { id: '3', name: 'Raj Patel', role: 'CTO', company: 'DataSphere', strength: 90, online: true },
];

export default function ConnectionsPage() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'strength'>('name');

  const filtered = useMemo(() => {
    let list = MOCK.filter(
      (c) =>
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.role.toLowerCase().includes(search.toLowerCase()) ||
        c.company.toLowerCase().includes(search.toLowerCase())
    );
    if (sortBy === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'strength') list = [...list].sort((a, b) => b.strength - a.strength);
    return list;
  }, [search, sortBy]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#1E293B]">My Connections</h1>
        <p className="text-[#64748B] mt-1">Manage and search your network.</p>
      </div>
      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name, role, or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'name' | 'strength')}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#1E293B] focus:border-[#0F7377] focus:ring-2 focus:ring-[#0F7377]/20"
        >
          <option value="name">Sort by name</option>
          <option value="strength">Sort by strength</option>
        </select>
      </div>
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <UserPlus className="h-12 w-12 text-[#64748B] mx-auto mb-4" />
              <p className="text-[#64748B]">No connections match your search.</p>
              <Link href="/">
                <Button variant="outline" className="mt-4">Back to Network</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          filtered.map((c) => (
            <Card key={c.id} className="gs-card-hover">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <Avatar>
                        <AvatarFallback>{c.name.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      {c.online && (
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white" aria-label="Online" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-[#1E293B] truncate">{c.name}</p>
                      <p className="text-sm text-[#64748B] truncate">{c.role} at {c.company}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-[#0F7377] rounded-full" style={{ width: `${c.strength}%` }} />
                        </div>
                        <span className="text-xs text-[#64748B]">{c.strength}%</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="text-[#0F7377] border-[#0F7377] hover:bg-[#0F7377] hover:text-white shrink-0" asChild>
                    <Link href="/messages">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Message
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
