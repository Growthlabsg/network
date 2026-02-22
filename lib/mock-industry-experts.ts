export interface IndustryExpert {
  id: string;
  name: string;
  /** Job title, e.g. Chief Technology Officer */
  title?: string;
  /** Company name */
  company?: string;
  location: string;
  description: string;
  /** Areas of expertise (tags) */
  expertise: string[];
  rating: number;
  reviewCount?: number;
  /** e.g. "15+ years" */
  experience?: string;
  /** e.g. "$500/hr" */
  hourlyRate?: string;
  /** e.g. "Available for consultation" */
  availability?: string;
  /** Key insights / tips (bullet points) */
  keyInsights?: string[];
  verified: boolean;
  featured?: boolean;
  logo?: string;
  banner?: string;
  about?: string;
  howToApply?: string;
  faqs?: { question: string; answer: string }[];
  recognition?: string[];
  website?: string;
  linkedIn?: string;
  views?: number;
}

export const EXPERT_INDUSTRIES = [
  'Financial Technology',
  'Healthcare Technology',
  'Marketing & Growth',
  'Logistics & Supply Chain',
  'Artificial Intelligence',
  'Education Technology',
  'Clean Technology',
  'E-commerce',
  'SaaS',
  'Cybersecurity',
  'Blockchain',
  'RegTech',
  'Digital Payments',
  'AI in Finance',
  'B2B',
  'Marketplace',
] as const;

export const EXPERT_LOCATIONS = ['Singapore', 'Hong Kong', 'Jakarta', 'Bangkok', 'Kuala Lumpur', 'Manila', 'Ho Chi Minh City', 'Sydney', 'Remote'] as const;

export const EXPERTS: IndustryExpert[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    title: 'Chief Technology Officer',
    company: 'FinTech Innovations Ltd',
    location: 'Singapore',
    description: 'Leading fintech expert with experience in building scalable payment solutions and regulatory technology. Former VP at major banks with deep knowledge of Southeast Asian markets.',
    expertise: ['Blockchain', 'Digital Payments', 'RegTech', 'AI in Finance'],
    rating: 4.9,
    reviewCount: 127,
    experience: '15+ years',
    hourlyRate: '$500/hr',
    availability: 'Available for consultation',
    keyInsights: ['Focus on regulatory compliance from day one', 'Build partnerships with traditional financial institutions'],
    verified: true,
    featured: true,
    about: 'Dr. Sarah Chen has led technology and product teams at global banks and fintech startups across APAC. She specializes in payment infrastructure, regulatory technology, and AI applications in finance.',
    howToApply: 'Send a brief note outlining your challenge and preferred format (call or workshop). I typically respond within 48 hours.',
    recognition: ['Fintech Asia', 'e27', 'Tech in Asia'],
    views: 892,
    faqs: [
      { question: 'What format do you prefer for consultations?', answer: 'I offer 1:1 calls (60 min), half-day workshops, or ongoing advisory. We can align on scope after an intro call.' },
      { question: 'Do you work with early-stage startups?', answer: 'Yes. I work with pre-seed to Series B, especially in fintech and regtech.' },
    ],
  },
  {
    id: '2',
    name: 'Marcus Tan',
    title: 'Head of Growth',
    company: 'ScaleUp Labs',
    location: 'Singapore',
    description: 'Growth and marketing leader who has scaled B2B and B2C startups across SEA. Expert in performance marketing, retention, and go-to-market strategy.',
    expertise: ['Marketing & Growth', 'B2B', 'E-commerce', 'SaaS'],
    rating: 4.8,
    reviewCount: 94,
    experience: '12+ years',
    hourlyRate: '$400/hr',
    availability: 'Available for consultation',
    keyInsights: ['Invest in retention before scaling acquisition', 'Localize messaging and channels by market'],
    verified: true,
    featured: true,
    views: 654,
  },
  {
    id: '3',
    name: 'Priya Sharma',
    title: 'Healthcare Technology Advisor',
    company: 'HealthTech Ventures',
    location: 'Singapore',
    description: 'Former hospital CIO and healthtech advisor. Deep experience in digital health, compliance, and scaling healthtech in regulated markets.',
    expertise: ['Healthcare Technology', 'Digital Health', 'Regulatory', 'SaaS'],
    rating: 4.9,
    reviewCount: 68,
    experience: '18+ years',
    hourlyRate: '$550/hr',
    availability: 'Limited availability',
    keyInsights: ['Design for regulators and clinicians from day one', 'Partner with at least one anchor institution early'],
    verified: true,
    featured: true,
    views: 521,
  },
  {
    id: '4',
    name: 'David Wong',
    title: 'AI/ML Lead',
    company: 'DataDriven AI',
    location: 'Singapore',
    description: 'Machine learning and AI practitioner. Built recommendation and automation systems for e-commerce and logistics. Focus on practical ML deployment.',
    expertise: ['Artificial Intelligence', 'Machine Learning', 'E-commerce', 'Logistics & Supply Chain'],
    rating: 4.7,
    reviewCount: 45,
    experience: '10+ years',
    hourlyRate: '$450/hr',
    availability: 'Available for consultation',
    keyInsights: ['Start with a narrow use case and clear success metric', 'Invest in data quality before complex models'],
    verified: true,
    featured: false,
    views: 398,
  },
  {
    id: '5',
    name: 'Elena Rodriguez',
    title: 'Sustainability & Clean Tech Advisor',
    company: 'GreenScale Advisory',
    location: 'Remote',
    description: 'Clean technology and sustainability strategy. Helps startups align product and operations with ESG and carbon reporting requirements.',
    expertise: ['Clean Technology', 'Sustainability', 'ESG', 'Carbon'],
    rating: 4.8,
    reviewCount: 32,
    experience: '14+ years',
    hourlyRate: '$420/hr',
    availability: 'Available for consultation',
    keyInsights: ['Embed sustainability in product and ops from the start', 'Get one credible certification or framework in place early'],
    verified: true,
    featured: false,
    views: 287,
  },
];

export function getExpertById(id: string): IndustryExpert | undefined {
  return EXPERTS.find((e) => e.id === id);
}

export function getSimilarExperts(expert: IndustryExpert, limit = 4): IndustryExpert[] {
  const overlap = (a: string[], b: string[]) => a.filter((x) => b.includes(x)).length;
  const scored = EXPERTS.filter((e) => e.id !== expert.id).map((e) => ({
    expert: e,
    score: overlap(expert.expertise, e.expertise) + (e.location === expert.location ? 1 : 0),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.expert);
}

export function getPeopleAlsoViewedExperts(excludeId: string, limit = 3): IndustryExpert[] {
  return EXPERTS.filter((e) => e.id !== excludeId).slice(0, limit);
}

export function getRecommendedExperts(limit = 6): IndustryExpert[] {
  return [...EXPERTS].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, limit);
}
