/**
 * Network section: only these 7 directories.
 * Single dynamic floating header uses this to show section-specific options and CTA.
 */
import type { LucideIcon } from 'lucide-react';
import {
  Building2,
  Wallet,
  GraduationCap,
  Rocket,
  Lightbulb,
  School,
  Landmark,
} from 'lucide-react';

export interface NetworkDirectory {
  href: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  /** CTA shown when this directory is active */
  ctaLabel: string;
  ctaHref: string;
}

export const NETWORK_DIRECTORIES: NetworkDirectory[] = [
  {
    href: '/startups',
    label: 'Startup Directory',
    shortLabel: 'Startups',
    icon: Building2,
    ctaLabel: 'Exhibit your startup',
    ctaHref: '/startups/exhibit',
  },
  {
    href: '/investors',
    label: 'Investors',
    shortLabel: 'Investors',
    icon: Wallet,
    ctaLabel: 'Join as Investor',
    ctaHref: '/investors/create',
  },
  {
    href: '/mentors',
    label: 'Mentors',
    shortLabel: 'Mentors',
    icon: GraduationCap,
    ctaLabel: 'Join as Mentor',
    ctaHref: '/mentors/create',
  },
  {
    href: '/incubators-accelerators',
    label: 'Incubators & Accelerators',
    shortLabel: 'Incubators',
    icon: Rocket,
    ctaLabel: 'Create program profile',
    ctaHref: '/incubators-accelerators/create',
  },
  {
    href: '/industry-experts',
    label: 'Industry Experts',
    shortLabel: 'Experts',
    icon: Lightbulb,
    ctaLabel: 'Become an Expert',
    ctaHref: '/industry-experts/create',
  },
  {
    href: '/teachers',
    label: 'Teachers',
    shortLabel: 'Teachers',
    icon: School,
    ctaLabel: 'Join as Teacher',
    ctaHref: '/teachers/create',
  },
  {
    href: '/government',
    label: 'Government Agencies',
    shortLabel: 'Government',
    icon: Landmark,
    ctaLabel: 'Register Agency',
    ctaHref: '/government/create',
  },
];

/** Resolve which directory (and thus CTA) applies for pathname */
export function getActiveDirectory(pathname: string | null | undefined): NetworkDirectory {
  const normalized = pathname === '/' ? '/startups' : (pathname ?? '/');
  for (const dir of NETWORK_DIRECTORIES) {
    const exactMatch = normalized === dir.href;
    const subRouteMatch = normalized.startsWith(dir.href + '/');
    if (exactMatch || subRouteMatch) return dir;
  }
  return NETWORK_DIRECTORIES[0];
}
