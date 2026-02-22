export interface Incubator {
  id: string;
  name: string;
  tagline?: string;
  type: 'Accelerator' | 'Incubator';
  description: string;
  location: string;
  /** e.g. "12 weeks", "4 months", "6-12 months" */
  duration?: string;
  /** e.g. "$150K for 6-8% equity", "$50K for 5% equity" */
  funding?: string;
  /** e.g. "15 startups per cohort" */
  cohortSize?: string;
  /** e.g. "Next: September 2025", "Rolling admission" */
  nextIntake?: string;
  industries: string[];
  /** e.g. "85%" */
  successRate?: string;
  /** Alumni count */
  alumniCount?: number;
  verified: boolean;
  featured?: boolean;
  rating?: number;
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

export const INCUBATORS: Incubator[] = [
  {
    id: '1',
    name: 'GrowthLab',
    tagline: 'Early-stage accelerator',
    type: 'Accelerator',
    description: 'GrowthLab runs a 12-week program for early-stage startups in fintech, e-commerce, and SaaS. We provide funding, mentorship, and workspace in Singapore.',
    location: 'Singapore',
    duration: '12 weeks',
    funding: '$150K for 6-8% equity',
    cohortSize: '15 startups per cohort',
    nextIntake: 'Next: September 2025',
    industries: ['Fintech', 'E-commerce', 'SaaS', 'Healthtech'],
    successRate: '85%',
    alumniCount: 120,
    verified: true,
    featured: true,
    rating: 4.9,
    views: 1100,
    about: 'GrowthLab has been accelerating early-stage startups in Southeast Asia since 2018. Our program combines capital, hands-on mentorship, and access to our investor and corporate network.',
    howToApply: 'Apply via our website with a one-pager and deck. Shortlisted teams are invited for interviews. We run two cohorts per year.',
    recognition: ['Tech in Asia', 'e27', 'Forbes Asia'],
    faqs: [
      { question: 'What stage do you accept?', answer: 'Pre-seed to seed. We look for a working prototype and clear problem-solution fit.' },
      { question: 'Is the program in-person?', answer: 'Yes, we require teams to be based in Singapore for the 12-week duration.' },
    ],
    website: 'https://growthlab.example',
    linkedIn: 'https://linkedin.com/company/growthlab',
  },
  {
    id: '2',
    name: '500 Startups SEA',
    tagline: 'Global accelerator, SEA focus',
    type: 'Accelerator',
    description: '500 Global (formerly 500 Startups) runs accelerator programs worldwide. Our SEA program focuses on B2B, marketplace, AI/ML, and e-commerce.',
    location: 'Singapore',
    duration: '4 months',
    funding: '$50K for 5% equity',
    cohortSize: '30 startups per cohort',
    nextIntake: 'Next: November 2025',
    industries: ['B2B', 'Marketplace', 'AI/ML', 'E-commerce'],
    successRate: '78%',
    alumniCount: 380,
    verified: true,
    featured: true,
    rating: 4.8,
    views: 950,
    about: 'We invest in exceptional founders globally. Our SEA program includes curriculum, mentor matching, and demo day with regional investors.',
    howToApply: 'Apply through 500.co. Applications are reviewed on a rolling basis. Include deck and key metrics.',
    recognition: ['e27', 'DealStreetAsia'],
    website: 'https://500.co',
  },
  {
    id: '3',
    name: 'Block71 Singapore',
    tagline: 'Deep tech & innovation hub',
    type: 'Incubator',
    description: 'Block71 is a deep tech and innovation hub. We provide workspace, community, and access to corporates and investors. No equity taken.',
    location: 'Singapore',
    duration: '6-12 months',
    funding: 'No equity, workspace provided',
    cohortSize: '50 startups per cohort',
    nextIntake: 'Next: Rolling admission',
    industries: ['Deep Tech', 'AI/ML', 'Biotech', 'Clean Tech'],
    successRate: '72%',
    alumniCount: 200,
    verified: true,
    featured: true,
    rating: 4.6,
    views: 720,
    about: 'Block71 supports deep tech and science-based startups with space and ecosystem access. We do not take equity; startups pay a membership fee.',
    howToApply: 'Submit an application form on our website. We review on a rolling basis and invite teams for a short interview.',
    website: 'https://block71.co',
  },
  {
    id: '4',
    name: 'Antler',
    tagline: 'Company builder and early-stage VC',
    type: 'Accelerator',
    description: 'Antler invests at the idea stage and helps build companies from zero. We run residency programs where founders form teams and validate before investing.',
    location: 'Singapore',
    duration: '10 weeks (residency)',
    funding: '$250K for 10% equity',
    cohortSize: '40 founders per cohort',
    nextIntake: 'Next: January 2026',
    industries: ['AI/ML', 'SaaS', 'Marketplace', 'Fintech'],
    successRate: '80%',
    alumniCount: 150,
    verified: true,
    rating: 4.7,
    views: 880,
    howToApply: 'Apply to join an Antler residency in your city. We select individuals who then form teams during the program.',
    recognition: ['Tech in Asia', 'e27'],
    website: 'https://antler.co',
  },
  {
    id: '5',
    name: 'JFDI Asia',
    tagline: 'Accelerator for ASEAN startups',
    type: 'Accelerator',
    description: 'JFDI runs accelerator programs for ASEAN-focused startups. We focus on B2B and B2C tech with clear path to scale in the region.',
    location: 'Singapore',
    duration: '12 weeks',
    funding: '$100K for 7% equity',
    cohortSize: '10 startups per cohort',
    nextIntake: 'Next: March 2026',
    industries: ['B2B', 'SaaS', 'Consumer', 'E-commerce'],
    successRate: '75%',
    alumniCount: 85,
    verified: true,
    rating: 4.5,
    views: 420,
    website: 'https://jfdi.asia',
  },
  {
    id: '6',
    name: 'Innovation Factory',
    tagline: 'Corporate-backed incubator',
    type: 'Incubator',
    description: 'Corporate-backed incubator for enterprise and B2B startups. We offer workspace, pilot opportunities with our parent group, and optional funding.',
    location: 'Singapore',
    duration: '6 months',
    funding: 'Pilot + optional $50K',
    cohortSize: '8 startups per cohort',
    nextIntake: 'Next: Rolling',
    industries: ['Enterprise', 'B2B', 'AI/ML', 'IoT'],
    successRate: '70%',
    alumniCount: 45,
    verified: false,
    rating: 4.4,
    views: 310,
  },
];

export const INCUBATOR_TYPES = ['All Types', 'Accelerator', 'Incubator'] as const;
export const INCUBATOR_INDUSTRIES = Array.from(new Set(INCUBATORS.flatMap((i) => i.industries))).sort();
export const INCUBATOR_LOCATIONS = ['All Locations', ...Array.from(new Set(INCUBATORS.map((i) => i.location)))];

export function getIncubatorById(id: string): Incubator | undefined {
  return INCUBATORS.find((i) => i.id === id);
}

export function getSimilarIncubators(incubator: Incubator, limit = 4): Incubator[] {
  return INCUBATORS.filter(
    (i) =>
      i.id !== incubator.id &&
      (i.location === incubator.location || i.industries.some((ind) => incubator.industries.includes(ind)))
  ).slice(0, limit);
}

const PEOPLE_ALSO_VIEWED_IDS: Record<string, string[]> = {
  '1': ['2', '4', '3', '5'],
  '2': ['1', '4', '3', '5'],
  '3': ['1', '2', '4', '6'],
  '4': ['1', '2', '5', '3'],
  '5': ['1', '2', '4', '6'],
  '6': ['3', '1', '4', '5'],
};

export function getPeopleAlsoViewedIncubators(incubatorId: string, limit = 4): Incubator[] {
  const ids = PEOPLE_ALSO_VIEWED_IDS[incubatorId] ?? INCUBATORS.filter((i) => i.id !== incubatorId).slice(0, limit).map((i) => i.id);
  return ids.slice(0, limit).map((id) => INCUBATORS.find((i) => i.id === id)).filter(Boolean) as Incubator[];
}

export function getRecommendedIncubators(limit = 6): Incubator[] {
  return [...INCUBATORS].filter((i) => i.featured || (i.alumniCount && i.alumniCount >= 50)).sort((a, b) => (b.alumniCount ?? 0) - (a.alumniCount ?? 0)).slice(0, limit);
}
