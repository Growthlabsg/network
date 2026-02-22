export interface Mentor {
  id: string;
  name: string;
  /** Short headline, e.g. "Former Google Engineering Director" */
  tagline?: string;
  /** Role/company for card, e.g. "TechStart Ventures" */
  role?: string;
  description: string;
  location: string;
  /** Expertise areas */
  expertise: string[];
  industries: string[];
  /** e.g. "1:1 sessions", "Group workshops" */
  availability?: string;
  /** Available | Busy | Limited */
  status?: 'Available' | 'Busy' | 'Limited';
  verified: boolean;
  featured?: boolean;
  premium?: boolean;
  rating: number;
  /** Number of sessions conducted */
  sessions: number;
  /** e.g. "$500/hour" */
  hourlyRate?: string;
  /** e.g. "15+ years experience" */
  experience?: string;
  logo?: string;
  banner?: string;
  about?: string;
  howToBook?: string;
  faqs?: { question: string; answer: string }[];
  recognition?: string[];
  linkedIn?: string;
  website?: string;
  views?: number;
}

export const MENTORS: Mentor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    tagline: 'Former Google Engineering Director',
    role: 'TechStart Ventures',
    description: 'I help technical founders scale engineering teams and product. 15+ years in tech leadership and early-stage advising.',
    location: 'Singapore',
    expertise: ['AI/ML', 'Product Strategy', 'Scaling'],
    industries: ['Tech', 'FinTech', 'SaaS'],
    availability: '1:1 sessions',
    status: 'Available',
    verified: true,
    featured: true,
    premium: true,
    rating: 4.9,
    sessions: 127,
    hourlyRate: '$500/hour',
    experience: '15+ years experience',
    views: 890,
    about: 'Former Google Engineering Director with deep experience in scaling product and engineering. I advise startups on technical strategy, hiring, and product-market fit.',
    howToBook: 'Book a session via the button above. I offer 45-min and 1-hour slots. Share your context in advance for a more productive session.',
    recognition: ['Tech in Asia', 'e27', 'Forbes Asia'],
    faqs: [
      { question: 'What can we discuss in a session?', answer: 'Product strategy, engineering scaling, hiring, technical roadmaps, and fundraising for technical founders.' },
      { question: 'Do you offer ongoing mentorship?', answer: 'Yes, we can arrange a recurring cadence after an initial session if there’s fit.' },
    ],
    linkedIn: 'https://linkedin.com/in/sarahchen',
    website: 'https://techstart.vc',
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    tagline: 'Serial Entrepreneur & Angel Investor',
    role: 'Innovation Capital',
    description: 'Built and exited two startups. Now angel investing and mentoring on business strategy, fundraising, and market entry.',
    location: 'Singapore',
    expertise: ['Business Strategy', 'Fundraising', 'Market Entry'],
    industries: ['SaaS', 'Marketplace', 'Consumer'],
    availability: 'Group workshops',
    status: 'Available',
    verified: true,
    featured: true,
    rating: 4.8,
    sessions: 89,
    hourlyRate: '$400/hour',
    experience: '12+ years experience',
    views: 620,
    about: 'Serial entrepreneur with two exits. I focus on go-to-market, fundraising narrative, and international expansion for early-stage companies.',
    howToBook: 'Request a session through the platform. I run group workshops monthly and take limited 1:1s.',
    recognition: ['e27', 'DealStreetAsia'],
  },
  {
    id: '3',
    name: 'Dr. Priya Patel',
    tagline: 'Healthcare & Regulatory Expert',
    role: 'HealthTech Advisors',
    description: 'Healthcare technology and regulatory compliance. Clinical trials, FDA pathways, and Asia-Pacific market entry for healthtech.',
    location: 'Singapore',
    expertise: ['Healthcare Tech', 'Regulatory Compliance', 'Clinical Trials'],
    industries: ['Healthcare', 'Biotech', 'HealthTech'],
    availability: '1:1 sessions',
    status: 'Limited',
    verified: true,
    rating: 4.7,
    sessions: 64,
    hourlyRate: '$450/hour',
    experience: '18+ years experience',
    views: 440,
    about: 'Background in clinical research and regulatory affairs. I advise healthtech founders on compliance, trials, and market access in APAC.',
    howToBook: 'Send a message with your company stage and key questions. I prioritise healthtech and biotech.',
  },
  {
    id: '4',
    name: 'Alex Thompson',
    tagline: 'Growth & GTM Lead',
    role: 'Scale Labs',
    description: 'B2B growth and go-to-market. Former head of growth at a unicorn. Help founders nail positioning and outbound.',
    location: 'Singapore',
    expertise: ['GTM', 'Growth', 'B2B Sales'],
    industries: ['SaaS', 'Enterprise', 'B2B'],
    availability: '1:1 sessions',
    status: 'Available',
    verified: true,
    rating: 4.6,
    sessions: 102,
    hourlyRate: '$350/hour',
    experience: '10+ years experience',
    views: 520,
  },
  {
    id: '5',
    name: 'Lisa Wang',
    tagline: 'Product & UX Leader',
    role: 'Design Forward',
    description: 'Product strategy and user experience for early-stage products. Former Head of Product at a regional super app.',
    location: 'Singapore',
    expertise: ['Product', 'UX', 'User Research'],
    industries: ['Consumer', 'Marketplace', 'FinTech'],
    availability: '1:1 sessions, Workshops',
    status: 'Available',
    verified: false,
    rating: 4.5,
    sessions: 56,
    hourlyRate: '$380/hour',
    experience: '9+ years experience',
    views: 310,
  },
  {
    id: '6',
    name: 'James Lee',
    tagline: 'CFO & Fundraising Advisor',
    role: 'Independent',
    description: 'Finance and fundraising for seed to Series B. Financial modelling, investor readiness, and cap table design.',
    location: 'Singapore',
    expertise: ['Fundraising', 'Financial Modelling', 'Investor Relations'],
    industries: ['FinTech', 'SaaS', 'E-commerce'],
    availability: '1:1 sessions',
    status: 'Available',
    verified: true,
    rating: 4.8,
    sessions: 78,
    hourlyRate: '$420/hour',
    experience: '14+ years experience',
    views: 380,
  },
];

export const MENTOR_EXPERTISE = Array.from(new Set(MENTORS.flatMap((m) => m.expertise))).sort();
export const MENTOR_INDUSTRIES = Array.from(new Set(MENTORS.flatMap((m) => m.industries))).sort();
export const MENTOR_LOCATIONS = ['All Locations', ...Array.from(new Set(MENTORS.map((m) => m.location)))];
export const MENTOR_STATUSES = ['All', 'Available', 'Limited', 'Busy'] as const;

export function getMentorById(id: string): Mentor | undefined {
  return MENTORS.find((m) => m.id === id);
}

export function getSimilarMentors(mentor: Mentor, limit = 4): Mentor[] {
  return MENTORS.filter(
    (m) =>
      m.id !== mentor.id &&
      (m.location === mentor.location || m.expertise.some((e) => mentor.expertise.includes(e)))
  ).slice(0, limit);
}

const PEOPLE_ALSO_VIEWED_MENTOR_IDS: Record<string, string[]> = {
  '1': ['2', '4', '6', '3'],
  '2': ['1', '6', '4', '5'],
  '3': ['1', '5', '6', '4'],
  '4': ['1', '2', '6', '5'],
  '5': ['1', '4', '2', '3'],
  '6': ['2', '1', '4', '3'],
};

export function getPeopleAlsoViewedMentors(mentorId: string, limit = 4): Mentor[] {
  const ids = PEOPLE_ALSO_VIEWED_MENTOR_IDS[mentorId] ?? MENTORS.filter((m) => m.id !== mentorId).slice(0, limit).map((m) => m.id);
  return ids.slice(0, limit).map((id) => MENTORS.find((m) => m.id === id)).filter(Boolean) as Mentor[];
}

export function getRecommendedMentors(limit = 6): Mentor[] {
  return [...MENTORS].filter((m) => m.featured || m.sessions >= 50).sort((a, b) => b.sessions - a.sessions).slice(0, limit);
}
