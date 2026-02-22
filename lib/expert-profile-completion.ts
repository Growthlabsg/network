import type { IndustryExpert } from './mock-industry-experts';

export interface ExpertCompletionItem {
  id: string;
  label: string;
  required: boolean;
  filled: boolean;
  section: string;
}

const COMPLETION_ITEMS: { id: keyof IndustryExpert | 'logo' | 'banner'; label: string; required: boolean; section: string }[] = [
  { id: 'name', label: 'Full name', required: true, section: 'Basics' },
  { id: 'title', label: 'Title / role', required: true, section: 'Basics' },
  { id: 'company', label: 'Company', required: false, section: 'Basics' },
  { id: 'location', label: 'Location', required: true, section: 'Basics' },
  { id: 'description', label: 'Short bio / description', required: true, section: 'Basics' },
  { id: 'logo', label: 'Profile photo', required: false, section: 'Profile photo & banner' },
  { id: 'banner', label: 'Banner image', required: false, section: 'Profile photo & banner' },
  { id: 'expertise', label: 'Expertise (at least one)', required: true, section: 'Expertise' },
  { id: 'experience', label: 'Experience (e.g. 15+ years)', required: false, section: 'Expertise' },
  { id: 'hourlyRate', label: 'Hourly rate', required: false, section: 'Expertise' },
  { id: 'availability', label: 'Availability', required: false, section: 'Expertise' },
  { id: 'keyInsights', label: 'Key insights (tips)', required: false, section: 'Expertise' },
  { id: 'about', label: 'About (long-form)', required: false, section: 'About' },
  { id: 'howToApply', label: 'How to connect / apply', required: true, section: 'Process' },
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

export function getExpertProfileCompletion(data: Partial<IndustryExpert> & { logo?: string; banner?: string }): {
  items: ExpertCompletionItem[];
  requiredFilled: number;
  requiredTotal: number;
  recommendedFilled: number;
  recommendedTotal: number;
  percent: number;
  isComplete: boolean;
} {
  const required = COMPLETION_ITEMS.filter((c) => c.required);
  const recommended = COMPLETION_ITEMS.filter((c) => !c.required);

  const items: ExpertCompletionItem[] = COMPLETION_ITEMS.map((c) => {
    let filled = false;
    if (c.id === 'logo' || c.id === 'banner') {
      filled = isFilled((data as Record<string, unknown>)[c.id]);
    } else if (c.id === 'expertise') {
      const arr = data.expertise;
      filled = Array.isArray(arr) ? arr.length > 0 : false;
    } else if (c.id === 'keyInsights') {
      const arr = data.keyInsights;
      filled = Array.isArray(arr) ? arr.length > 0 : false;
    } else if (c.id === 'faqs') {
      const faqs = data.faqs;
      filled = Array.isArray(faqs) && faqs.some((f) => f.question?.trim() || f.answer?.trim());
    } else if (c.id === 'recognition') {
      const arr = data.recognition;
      filled = Array.isArray(arr) ? arr.length > 0 : false;
    } else {
      filled = isFilled(data[c.id as keyof IndustryExpert]);
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
