import type { Incubator } from './mock-incubators';

export interface IncubatorCompletionItem {
  id: string;
  label: string;
  required: boolean;
  filled: boolean;
  section: string;
}

const COMPLETION_ITEMS: { id: keyof Incubator | 'logo' | 'banner'; label: string; required: boolean; section: string }[] = [
  { id: 'name', label: 'Program name', required: true, section: 'Basics' },
  { id: 'tagline', label: 'Tagline', required: false, section: 'Basics' },
  { id: 'type', label: 'Type (Accelerator / Incubator)', required: true, section: 'Basics' },
  { id: 'location', label: 'Location', required: true, section: 'Basics' },
  { id: 'description', label: 'Short description', required: true, section: 'Basics' },
  { id: 'logo', label: 'Profile photo / logo', required: false, section: 'Profile photo & banner' },
  { id: 'banner', label: 'Banner image', required: false, section: 'Profile photo & banner' },
  { id: 'duration', label: 'Program duration', required: false, section: 'Program details' },
  { id: 'funding', label: 'Funding / equity', required: false, section: 'Program details' },
  { id: 'cohortSize', label: 'Cohort size', required: false, section: 'Program details' },
  { id: 'nextIntake', label: 'Next intake', required: false, section: 'Program details' },
  { id: 'industries', label: 'Industries (at least one)', required: true, section: 'Program details' },
  { id: 'successRate', label: 'Success rate', required: false, section: 'Program details' },
  { id: 'alumniCount', label: 'Alumni count', required: false, section: 'Program details' },
  { id: 'about', label: 'About (long-form)', required: false, section: 'About' },
  { id: 'howToApply', label: 'How to apply', required: true, section: 'Process' },
  { id: 'faqs', label: 'At least one FAQ', required: false, section: 'FAQ' },
  { id: 'recognition', label: 'Recognition / As seen in', required: false, section: 'Highlights' },
  { id: 'website', label: 'Website', required: false, section: 'Contact' },
  { id: 'linkedIn', label: 'LinkedIn', required: false, section: 'Contact' },
];

function isFilled(value: unknown): boolean {
  if (value == null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'number') return true;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

export function getIncubatorProfileCompletion(data: Partial<Incubator> & { logo?: string; banner?: string }): {
  items: IncubatorCompletionItem[];
  requiredFilled: number;
  requiredTotal: number;
  recommendedFilled: number;
  recommendedTotal: number;
  percent: number;
  isComplete: boolean;
} {
  const required = COMPLETION_ITEMS.filter((c) => c.required);
  const recommended = COMPLETION_ITEMS.filter((c) => !c.required);

  const items: IncubatorCompletionItem[] = COMPLETION_ITEMS.map((c) => {
    let filled = false;
    if (c.id === 'logo' || c.id === 'banner') {
      filled = isFilled((data as Record<string, unknown>)[c.id]);
    } else if (c.id === 'industries') {
      const arr = data.industries;
      filled = Array.isArray(arr) ? arr.length > 0 : false;
    } else if (c.id === 'faqs') {
      const faqs = data.faqs;
      filled = Array.isArray(faqs) && faqs.some((f) => f.question?.trim() || f.answer?.trim());
    } else {
      filled = isFilled(data[c.id as keyof Incubator]);
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
