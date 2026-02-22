import type { Mentor } from './mock-mentors';

export interface MentorCompletionItem {
  id: string;
  label: string;
  required: boolean;
  filled: boolean;
  section: string;
}

const COMPLETION_ITEMS: { id: keyof Mentor | 'logo' | 'banner'; label: string; required: boolean; section: string }[] = [
  { id: 'name', label: 'Full name', required: true, section: 'Basics' },
  { id: 'tagline', label: 'Tagline (short headline)', required: false, section: 'Basics' },
  { id: 'role', label: 'Current role / company', required: false, section: 'Basics' },
  { id: 'location', label: 'Location', required: true, section: 'Basics' },
  { id: 'description', label: 'Short description', required: true, section: 'Basics' },
  { id: 'logo', label: 'Profile photo', required: false, section: 'Profile photo & banner' },
  { id: 'banner', label: 'Banner image', required: false, section: 'Profile photo & banner' },
  { id: 'expertise', label: 'Expertise areas (at least one)', required: true, section: 'Expertise' },
  { id: 'industries', label: 'Industries (at least one)', required: true, section: 'Expertise' },
  { id: 'availability', label: 'Availability (e.g. 1:1 sessions)', required: false, section: 'Expertise' },
  { id: 'hourlyRate', label: 'Hourly rate', required: false, section: 'Expertise' },
  { id: 'experience', label: 'Years of experience', required: false, section: 'Expertise' },
  { id: 'about', label: 'About (long-form)', required: false, section: 'About' },
  { id: 'howToBook', label: 'How to book', required: true, section: 'Process' },
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

export function getMentorProfileCompletion(data: Partial<Mentor> & { logo?: string; banner?: string }): {
  items: MentorCompletionItem[];
  requiredFilled: number;
  requiredTotal: number;
  recommendedFilled: number;
  recommendedTotal: number;
  percent: number;
  isComplete: boolean;
} {
  const required = COMPLETION_ITEMS.filter((c) => c.required);
  const recommended = COMPLETION_ITEMS.filter((c) => !c.required);

  const items: MentorCompletionItem[] = COMPLETION_ITEMS.map((c) => {
    let filled = false;
    if (c.id === 'logo' || c.id === 'banner') {
      filled = isFilled((data as Record<string, unknown>)[c.id]);
    } else if (c.id === 'expertise' || c.id === 'industries') {
      const arr = data[c.id as keyof Mentor];
      filled = Array.isArray(arr) ? arr.length > 0 : false;
    } else if (c.id === 'faqs') {
      const faqs = data.faqs;
      filled = Array.isArray(faqs) && faqs.some((f) => f.question?.trim() || f.answer?.trim());
    } else {
      filled = isFilled(data[c.id as keyof Mentor]);
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
