'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { LayoutList, FileCheck, BarChart3 } from 'lucide-react';

const MOCK_LISTINGS = [{ id: '1', name: 'GrowthLab Accelerator', status: 'Live', applications: 12 }];
const MOCK_APPLICATIONS = [
  { id: 'a1', startup: 'TechNova', program: 'GrowthLab Accelerator', date: '2024-01-10', status: 'Under review' },
];

export default function ProgramDashboardPage() {
  return (
    <div>
      <Link href="/incubators-accelerators" className="link-teal text-sm mb-4 inline-block">← Back to Programs</Link>
      <h1 className="text-2xl font-bold text-[#1E293B] mb-2">Program dashboard</h1>
      <p className="text-[#64748B] mb-6">Manage your program listings and applications.</p>

      <Tabs defaultValue="listings" className="space-y-4">
        <TabsList className="bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="listings" className="data-[state=active]:bg-white data-[state=active]:text-[#0F7377] rounded-md">
            <LayoutList className="h-4 w-4 mr-2" />
            Listings
          </TabsTrigger>
          <TabsTrigger value="applications" className="data-[state=active]:bg-white data-[state=active]:text-[#0F7377] rounded-md">
            <FileCheck className="h-4 w-4 mr-2" />
            Applications
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-white data-[state=active]:text-[#0F7377] rounded-md">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="space-y-4">
          <div className="flex justify-end">
            <Link href="/incubators-accelerators/register">
              <Button className="btn-primary">Register new program</Button>
            </Link>
          </div>
          {MOCK_LISTINGS.length === 0 ? (
            <Card><CardContent className="p-12 text-center text-[#64748B]">No program listings yet.</CardContent></Card>
          ) : (
            <div className="space-y-2">
              {MOCK_LISTINGS.map((p) => (
                <Card key={p.id}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[#1E293B]">{p.name}</p>
                      <p className="text-sm text-[#64748B]">{p.status} · {p.applications} applications</p>
                    </div>
                    <Button variant="outline" size="sm">Edit</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="applications" className="space-y-2">
          {MOCK_APPLICATIONS.length === 0 ? (
            <Card><CardContent className="p-12 text-center text-[#64748B]">No applications yet.</CardContent></Card>
          ) : (
            MOCK_APPLICATIONS.map((a) => (
              <Card key={a.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#1E293B]">{a.startup}</p>
                    <p className="text-sm text-[#64748B]">{a.program} · {a.date} · {a.status}</p>
                  </div>
                  <Button variant="outline" size="sm">Review</Button>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardContent className="p-8 text-center">
              <BarChart3 className="h-12 w-12 text-[#64748B] mx-auto mb-4" />
              <p className="text-[#64748B]">Analytics coming soon. View applications and conversion metrics here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
