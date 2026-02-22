'use client';

import { Card, CardContent } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

interface Stat {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
}

interface StatsDashboardProps {
  stats: Stat[];
  columns?: 2 | 4;
}

export function StatsDashboard({ stats, columns = 4 }: StatsDashboardProps) {
  const gridCols = columns === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4';
  return (
    <div className={`grid ${gridCols} gap-4 mb-8`}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const iconColor = stat.iconColor ?? 'text-primary';
        return (
          <Card key={index} className="gs-card-hover overflow-hidden border border-gray-100 dark:border-slate-700/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-muted truncate">{stat.label}</p>
                  <p className="text-2xl font-bold tracking-tight text-growthlab-slate mt-0.5">{stat.value}</p>
                </div>
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 ${iconColor} dark:bg-primary-900/30`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
