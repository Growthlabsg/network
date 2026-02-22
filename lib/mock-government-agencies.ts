export interface GovernmentAgency {
  id: string;
  name: string;
  category: string;
  location: string;
  description: string;
  programs: string[];
  regulationsCount?: number;
  phone?: string;
  rating: number;
  reviewCount?: number;
  verified: boolean;
  featured?: boolean;
  logo?: string;
  banner?: string;
  keyInsights?: string[];
  about?: string;
  howToConnect?: string;
  faqs?: { question: string; answer: string }[];
  recognition?: string[];
  website?: string;
  views?: number;
}

export const AGENCY_CATEGORIES = [
  'Economic Development',
  'Financial Regulation',
  'Digital Economy',
  'Policy & Regulation',
  'Innovation & Technology',
  'Trade & Investment',
  'Healthcare & Life Sciences',
  'Education & Skills',
] as const;

export const AGENCIES: GovernmentAgency[] = [
  {
    id: '1',
    name: 'Enterprise Singapore',
    category: 'Economic Development',
    location: 'Singapore',
    description: "Singapore's government agency championing enterprise development.",
    programs: ['Startup SG Founder', 'Startup SG Tech', 'Market Readiness Assistance'],
    regulationsCount: 4,
    phone: '+65 6898 1800',
    rating: 4.8,
    reviewCount: 156,
    verified: true,
    featured: true,
    keyInsights: [
      'Focus on building strong local partnerships before expanding',
      'Ensure compliance with MAS regulations for fintech startups',
    ],
    about: 'Enterprise Singapore is the government agency championing enterprise development.',
    howToConnect: 'Apply for programs via our website or contact the hotline.',
    views: 1240,
    website: 'https://www.enterprisesg.gov.sg',
    faqs: [
      { question: 'Who is eligible for Startup SG Founder?', answer: 'First-time entrepreneurs with a viable business idea.' },
    ],
  },
  {
    id: '2',
    name: 'Singapore Economic Development Board (EDB)',
    category: 'Economic Development',
    location: 'Singapore',
    description: 'Government agency driving Singapore\'s economic growth.',
    programs: ['Global Innovation Alliance', 'Research & Development Incentives'],
    regulationsCount: 2,
    phone: '+65 6832 6832',
    rating: 4.6,
    reviewCount: 89,
    verified: true,
    featured: false,
    keyInsights: [
      'Align your innovation roadmap with national research priorities',
    ],
    views: 892,
    website: 'https://www.edb.gov.sg',
  },
  {
    id: '3',
    name: 'Monetary Authority of Singapore (MAS)',
    category: 'Financial Regulation',
    location: 'Singapore',
    description: 'Central bank and financial regulator. Supports fintech innovation.',
    programs: ['MAS Fintech Regulatory Sandbox', 'Financial Sector Technology & Innovation'],
    regulationsCount: 12,
    phone: '+65 6225 5577',
    rating: 4.5,
    reviewCount: 72,
    verified: true,
    featured: true,
    keyInsights: [
      'Engage early with MAS for licensing and sandbox applications',
    ],
    views: 756,
    website: 'https://www.mas.gov.sg',
  },
  {
    id: '4',
    name: 'Infocomm Media Development Authority (IMDA)',
    category: 'Digital Economy',
    location: 'Singapore',
    description: 'Drives digital economy and media development.',
    programs: ['Startup SG Equity', 'Open Innovation Platform'],
    regulationsCount: 3,
    rating: 4.7,
    reviewCount: 54,
    verified: true,
    featured: false,
    views: 621,
    website: 'https://www.imda.gov.sg',
  },
  {
    id: '5',
    name: 'SkillsFuture Singapore (SSG)',
    category: 'Education & Skills',
    location: 'Singapore',
    description: 'Promotes skills development and lifelong learning.',
    programs: ['SkillsFuture Credit', 'Enterprise Singapore – SkillsFuture'],
    regulationsCount: 2,
    phone: '+65 6785 5785',
    rating: 4.4,
    reviewCount: 38,
    verified: true,
    featured: false,
    views: 445,
    website: 'https://www.skillsfuture.gov.sg',
  },
];

export function getAgencyById(id: string): GovernmentAgency | undefined {
  return AGENCIES.find((a) => a.id === id);
}

export function getSimilarAgencies(agency: GovernmentAgency, limit = 4): GovernmentAgency[] {
  const sameCategory = AGENCIES.filter((a) => a.id !== agency.id && a.category === agency.category);
  const other = AGENCIES.filter((a) => a.id !== agency.id && a.category !== agency.category);
  return [...sameCategory, ...other].slice(0, limit);
}

export function getPeopleAlsoViewedAgencies(excludeId: string, limit = 3): GovernmentAgency[] {
  return AGENCIES.filter((a) => a.id !== excludeId).slice(0, limit);
}

export function getRecommendedAgencies(limit = 4): GovernmentAgency[] {
  return [...AGENCIES].sort((a, b) => b.rating - a.rating).slice(0, limit);
}

export function getTotalActivePrograms(): number {
  return AGENCIES.reduce((sum, a) => sum + a.programs.length, 0);
}
