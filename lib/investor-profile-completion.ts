import type { Investor } from './mock-investors';

/** One checklist item for profile completion */
export interface ProfileCompletionItem {
  id: string;
  label: string;
  required: boolean;
  filled: boolean;
  section: string;
}

/** Required and recommended fields so the profile is "complete" per what we built */
const COMPLETION_ITEMS: { id: keyof Investor | 'logo' | 'banner'; label: string; required: boolean; section: string }[] = [
  { id: 'name', label: 'Fund or firm name', required: true, section: 'Basics' },
  { id: 'tagline', label: 'Tagline (short headline)', required: false, section: 'Basics' },
  { id: 'type', label: 'Investor type', required: true, section: 'Basics' },
  { id: 'location', label: 'Location', required: true, section: 'Basics' },
  { id: 'description', label: 'Short description', required: true, section: 'Basics' },
  { id: 'logo', label: 'Profile photo (logo)', required: false, section: 'Profile photo & banner' },
  { id: 'banner', label: 'Banner image', required: false, section: 'Profile photo & banner' },
  { id: 'investmentRange', label: 'Check size / investment range', required: true, section: 'Investment' },
  { id: 'portfolioCount', label: 'Portfolio companies count', required: false, section: 'Investment' },
  { id: 'focus', label: 'Focus areas', required: true, section: 'Investment' },
  { id: 'industries', label: 'Industries (at least one)', required: true, section: 'Investment' },
  { id: 'stages', label: 'Stages (at least one)', required: true, section: 'Investment' },
  { id: 'preferredIntro', label: 'Preferred intro type', required: false, section: 'Investment' },
  { id: 'leadOrFollow', label: 'Lead or follow', required: false, section: 'Investment' },
  { id: 'about', label: 'About (long-form)', required: false, section: 'About & thesis' },
  { id: 'investmentThesis', label: 'Investment thesis', required: false, section: 'About & thesis' },
  { id: 'companyStory', label: 'Company story', required: false, section: 'About & thesis' },
  { id: 'howToApply', label: 'How to apply', required: true, section: 'Process' },
  { id: 'responseTime', label: 'Response time', required: false, section: 'Process' },
  { id: 'keyFacts', label: 'Key facts', required: false, section: 'Highlights' },
  { id: 'portfolioHighlights', label: 'Portfolio highlights', required: false, section: 'Highlights' },
  { id: 'recognition', label: 'Recognition / As seen in', required: false, section: 'Highlights' },
  { id: 'geographies', label: 'Geographies', required: false, section: 'Highlights' },
  { id: 'teamSize', label: 'Team size', required: false, section: 'Highlights' },
  { id: 'faqs', label: 'At least one FAQ', required: false, section: 'FAQ' },
  { id: 'website', label: 'Website', required: false, section: 'Contact & links' },
  { id: 'linkedIn', label: 'LinkedIn', required: false, section: 'Contact & links' },
  { id: 'twitter', label: 'Twitter / X', required: false, section: 'Contact & links' },
];

function isFilled(value: unknown): boolean {
  if (value == null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'number') return true;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

/** Get completion status from investor data (e.g. from edit form or saved profile) */
export function getProfileCompletion(data: Partial<Investor> & { logo?: string; banner?: string }): {
  items: ProfileCompletionItem[];
  requiredFilled: number;
  requiredTotal: number;
  recommendedFilled: number;
  recommendedTotal: number;
  percent: number;
  isComplete: boolean;
} {
  const required = COMPLETION_ITEMS.filter((c) => c.required);
  const recommended = COMPLETION_ITEMS.filter((c) => !c.required);

  const items: ProfileCompletionItem[] = COMPLETION_ITEMS.map((c) => {
    let filled = false;
    if (c.id === 'logo' || c.id === 'banner') {
      filled = isFilled((data as Record<string, unknown>)[c.id]);
    } else if (c.id === 'industries' || c.id === 'stages') {
      const arr = data[c.id as keyof Investor];
      filled = Array.isArray(arr) ? arr.length > 0 : false;
    } else if (c.id === 'faqs') {
      const faqs = data.faqs;
      filled = Array.isArray(faqs) && faqs.some((f) => f.question?.trim() || f.answer?.trim());
    } else {
      filled = isFilled(data[c.id as keyof Investor]);
    }
    return { ...c, filled };
  });

  const requiredFilled = items.filter((i) => i.required && i.filled).length;
  const requiredTotal = required.length;
  const recommendedFilled = items.filter((i) => !i.required && i.filled).length;
  const recommendedTotal = recommended.length;
  const isComplete = requiredFilled === requiredTotal;
  const percent = requiredTotal + recommendedTotal > 0
    ? Math.round((requiredFilled + recommendedFilled) / (requiredTotal + recommendedTotal) * 100)
    : 100;

  return {
    items,
    requiredFilled,
    requiredTotal,
    recommendedFilled,
    recommendedTotal,
    percent,
    isComplete,
  };
}

export const INVESTOR_PROFILE_REQUIRED_SECTIONS = [
  'Basics (name, type, location, description)',
  'Investment (check size, focus, industries, stages)',
  'Process (how to apply)',
];
