export interface Teacher {
  id: string;
  name: string;
  title?: string;
  company?: string;
  location: string;
  description: string;
  rating: number;
  reviewCount?: number;
  sessionsCompleted?: number;
  hourlyRate?: string;
  expertise: string[];
  available: boolean;
  verified: boolean;
  premium?: boolean;
  logo?: string;
  banner?: string;
  about?: string;
  howToBook?: string;
  faqs?: { question: string; answer: string }[];
  recognition?: string[];
  website?: string;
  linkedIn?: string;
  views?: number;
}

export const TEACHER_EXPERTISE = [
  'AI/ML', 'Product Strategy', 'Scaling', 'Business Strategy', 'Market Entry', 'Growth Hacking',
  'Fundraising', 'Leadership', 'Sales', 'Marketing', 'Operations', 'Legal & Compliance',
] as const;

export const TEACHERS: Teacher[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    title: 'Former Google Engineering Director',
    company: 'TechStart Ventures',
    location: 'Singapore',
    description: 'Experienced technology leader and educator. Teaches founders how to scale engineering teams and ship products that users love.',
    rating: 4.9,
    reviewCount: 127,
    sessionsCompleted: 127,
    hourlyRate: '$500/hour',
    expertise: ['AI/ML', 'Product Strategy', 'Scaling'],
    available: true,
    verified: true,
    premium: true,
    about: 'Dr. Sarah Chen spent over a decade at Google before advising startups.',
    howToBook: 'Book a session via the button below. I offer 1:1 calls and workshops.',
    views: 892,
    faqs: [
      { question: 'What format are sessions?', answer: 'Usually 60-minute video calls.' },
      { question: 'Do you offer ongoing coaching?', answer: 'Yes, we can set up a recurring cadence.' },
    ],
  },
  {
    id: '2',
    name: 'Prof. Michael Rodriguez',
    title: 'Business Strategy Professor',
    company: 'Singapore Management University',
    location: 'Singapore',
    description: 'Academic and practitioner in business strategy and market entry. Helps founders refine positioning and go-to-market plans.',
    rating: 4.7,
    reviewCount: 89,
    sessionsCompleted: 89,
    hourlyRate: '$400/hour',
    expertise: ['Business Strategy', 'Market Entry', 'Growth Hacking'],
    available: true,
    verified: true,
    premium: false,
    about: 'Professor Rodriguez teaches strategy at SMU and advises startups on market entry.',
    howToBook: 'Select a time slot that works for you.',
    views: 654,
  },
  {
    id: '3',
    name: 'Jane Lim',
    title: 'Head of Growth',
    company: 'Scale Labs',
    location: 'Singapore',
    description: 'Growth and marketing expert. Specializes in acquisition, retention, and growth loops for early-stage startups.',
    rating: 4.8,
    sessionsCompleted: 64,
    hourlyRate: '$350/hour',
    expertise: ['Growth Hacking', 'Marketing', 'Scaling'],
    available: true,
    verified: true,
    premium: true,
    views: 421,
  },
];

export function getTeacherById(id: string): Teacher | undefined {
  return TEACHERS.find((t) => t.id === id);
}

export function getSimilarTeachers(teacher: Teacher, limit = 4): Teacher[] {
  const overlap = (a: string[], b: string[]) => a.filter((x) => b.includes(x)).length;
  const scored = TEACHERS.filter((t) => t.id !== teacher.id).map((t) => ({
    teacher: t,
    score: overlap(teacher.expertise, t.expertise) + (t.location === teacher.location ? 1 : 0),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.teacher);
}

export function getPeopleAlsoViewedTeachers(excludeId: string, limit = 3): Teacher[] {
  return TEACHERS.filter((t) => t.id !== excludeId).slice(0, limit);
}

export function getRecommendedTeachers(limit = 4): Teacher[] {
  return [...TEACHERS].sort((a, b) => b.rating - a.rating).slice(0, limit);
}
