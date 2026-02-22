import type { GovernmentAgency } from './mock-government-agencies';

export interface AgencyCompletionItem {
  id: string;
  label: string;
  required: boolean;
  filled: boolean;
  section: string;
}

const COMPLETION_ITEMS: { id: keyof GovernmentAgency | 'logo' | 'banner'; label: string; required: boolean; section: string }[] = [
  { id: 'name', label: 'Agency name', required: true, section: 'Basics' },
  { id: 'category', label: 'Agency category', required: true, section: 'Basics' },
  { id: 'location', label: 'Location', required: true, section: 'Basics' },
  { id: 'description', label: 'Short description', required: true, section: 'Basics' },
  { id: 'logo', label: 'Logo', required: false, section: 'Logo & banner' },
  { id: 'banner', label: 'Banner image', required: false, section: 'Logo & banner' },
  { id: 'programs', label: 'Programs (at least one)', required: true, section: 'Programs' },
  { id: 'regulationsCount', label: 'Regulations count', required: false, section: 'Programs' },
  { id: 'phone', label: 'Contact phone', required: false, section: 'Contact' },
  { id: 'keyInsights', label: 'Key insights', required: false, section: 'Insights' },
  { id: 'about', label: 'About (long-form)', required: false, section: 'About' },
  { id: 'howToConnect', label: 'How to connect', required: true, section: 'Process' },
  { id: 'faqs', label: 'At least one FAQ', required: false, section: 'FAQ' },
  { id: 'website', label: 'Website', required: false, section: 'Contact' },
];

function isFilled(value: unknown): boolean {
  if (value == null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'number') return true;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

export function getAgencyProfileCompletion(data: Partial<GovernmentAgency> & { logo?: string; banner?: string }): {
  items: AgencyCompletionItem[];
  requiredFilled: number;
  requiredTotal: number;
  recommendedFilled: number;
  recommendedTotal: number;
  percent: number;
  isComplete: boolean;
} {
  const required = COMPLETION_ITEMS.filter((c) => c.required);
  const recommended = COMPLETION_ITEMS.filter((c) => !c.required);

  const items: AgencyCompletionItem[] = COMPLETION_ITEMS.map((c) => {
    let filled = false;
    if (c.id === 'logo' || c.id === 'banner') {
      filled = isFilled((data as Record<string, unknown>)[c.id]);
    } else if (c.id === 'programs') {
      const arr = data.programs;
      filled = Array.isArray(arr) ? arr.length > 0 : false;
    } else if (c.id === 'keyInsights') {
      const arr = data.keyInsights;
      filled = Array.isArray(arr) ? arr.length > 0 : false;
    } else if (c.id === 'faqs') {
      const faqs = data.faqs;
      filled = Array.isArray(faqs) && faqs.some((f) => f.question?.trim() || f.answer?.trim());
    } else {
      filled = isFilled(data[c.id as keyof GovernmentAgency]);
    }
    return { ...c, filled };
  });

  const requiredFilled = items.filter((i) => i.required && i.filled).length;
  const requiredTotal = required.length;
  const recommendedFilled = items.filter((i) => !i.required && i.filled).length;
  const recommendedTotal = recommended.length;
  const isComplete = requiredFilled === requiredTotal;
  const percent =
    requiredTotal + recommendedTotal > 0
      ? Math.round(((requiredFilled + recommendedFilled) / (requiredTotal + recommendedTotal)) * 100)
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
