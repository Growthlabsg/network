export interface Investor {
  id: string;
  name: string;
  type: string;
  verified: boolean;
  rating: number;
  description: string;
  location: string;
  investmentRange: string;
  portfolioCount: number;
  focus: string;
  categories: string[];
  industries: string[];
  /** Preferred stages, e.g. Pre-seed, Seed, Series A */
  stages?: string[];
  /** Year founded or first fund */
  foundedYear?: number;
  /** Website URL */
  website?: string;
  /** Featured in directory */
  featured?: boolean;
  /** Typical response time, e.g. "Within 2 weeks" */
  responseTime?: string;
  /** Active deals or "Actively investing" */
  activeDeals?: string;
  /** Long-form about (for profile page) */
  about?: string;
  /** How to apply / process (for profile page) */
  howToApply?: string;
  /** Sample portfolio company names */
  portfolioHighlights?: string[];
  /** If true, contact only via in-app message after connection (no public email/website) */
  contactPrivate?: boolean;
  /** Short investment thesis or "Why we invest" (for profile) */
  investmentThesis?: string;
  /** Profile/logo image URL (uploaded by investor) */
  logo?: string;
  /** Cover/banner image URL (uploaded by investor) */
  banner?: string;
  /** Key facts or highlights about the company (bullet points) */
  keyFacts?: string[];
  /** Regions/countries they invest in */
  geographies?: string[];
  /** Recognition: "As seen in", awards, etc. */
  recognition?: string[];
  /** Team size or description, e.g. "15 partners" */
  teamSize?: string;
  /** LinkedIn profile or company page URL */
  linkedIn?: string;
  /** Twitter/X handle or URL */
  twitter?: string;
  /** Extended company story / about the firm (optional long-form) */
  companyStory?: string;
  /** Number of deals in the last 12 months (for profile) */
  dealsLast12Months?: number;
  /** Average response time in days (for sorting/filter) */
  avgResponseDays?: number;
  /** Preferred intro type */
  preferredIntro?: 'warm' | 'cold' | 'both';
  /** FAQ for profile page */
  faqs?: { question: string; answer: string }[];
  /** Lead or follow in rounds */
  leadOrFollow?: 'Lead' | 'Follow' | 'Both';
  /** Profile view count (for profile page) */
  views?: number;
  /** Short headline/tagline (e.g. "Early-stage VC in Southeast Asia") */
  tagline?: string;
}

export const INVESTORS: Investor[] = [
  {
    id: '1',
    name: 'Golden Gate Ventures',
    type: 'VC Fund',
    verified: true,
    rating: 4.8,
    description: 'Early-stage venture capital focused on Southeast Asian technology startups. We back founders building category-defining companies in fintech, e-commerce, and SaaS.',
    location: 'Singapore',
    investmentRange: '$500K – $5M',
    portfolioCount: 120,
    focus: 'Fintech, E-commerce, SaaS',
    categories: ['VC Fund'],
    industries: ['Fintech', 'E-commerce', 'SaaS', 'Consumer'],
    stages: ['Seed', 'Series A'],
    foundedYear: 2011,
    website: 'https://goldengate.vc',
    featured: true,
    responseTime: 'Within 2 weeks',
    activeDeals: 'Actively investing',
    about: 'Golden Gate Ventures is a leading early-stage VC in Southeast Asia. We partner with exceptional founders from seed to Series A and provide hands-on support in go-to-market, talent, and follow-on fundraising.',
    investmentThesis: 'We back category-defining technology companies in Southeast Asia. We look for strong unit economics, exceptional teams, and markets large enough to support venture-scale outcomes.',
    howToApply: 'Submit your deck via our website or through a warm introduction. We review all applications and respond within two weeks. Preferred: pre-seed to Series A, B2B or B2C tech in SEA.',
    portfolioHighlights: ['Carousell', 'Omise', 'Carro', 'Funding Societies'],
    keyFacts: ['120+ portfolio companies across SEA', 'Led by partners with operator experience', 'Hands-on support on GTM and talent', 'Follow-on capital available'],
    geographies: ['Singapore', 'Indonesia', 'Vietnam', 'Thailand', 'Philippines'],
    recognition: ['Tech in Asia', 'e27', 'Forbes Asia', 'DealStreetAsia'],
    teamSize: '12 investment professionals',
    companyStory: 'Golden Gate Ventures was founded in 2011 to back the next generation of Southeast Asian technology companies. We combine local presence with global best practices and have supported founders through multiple cycles.',
    dealsLast12Months: 18,
    avgResponseDays: 10,
    preferredIntro: 'both',
    leadOrFollow: 'Both',
    views: 1240,
    tagline: 'Early-stage VC in Southeast Asia',
    faqs: [
      { question: 'Do you lead or follow rounds?', answer: 'We can lead or follow. We typically lead seed and Series A in SEA.' },
      { question: 'What documents do you need?', answer: 'Send a one-pager and deck. We may request financials and cap table after initial review.' },
      { question: 'How long until we hear back?', answer: 'We aim to respond within two weeks. Warm intros may get a faster first response.' },
    ],
  },
  {
    id: '2',
    name: 'Sequoia Capital SEA',
    type: 'VC Fund',
    verified: true,
    rating: 4.9,
    description: 'Global venture firm with a dedicated Southeast Asia practice. We invest from seed to growth in technology and healthcare across the region.',
    location: 'Singapore',
    investmentRange: '$1M – $50M',
    portfolioCount: 280,
    focus: 'Technology, Healthcare',
    categories: ['VC Fund'],
    industries: ['Enterprise', 'Healthcare', 'B2B', 'AI/ML'],
    stages: ['Seed', 'Series A', 'Series B', 'Growth'],
    foundedYear: 1972,
    website: 'https://www.sequoiacap.com',
    featured: true,
    responseTime: 'Within 1 week',
    activeDeals: 'Actively investing',
    about: 'Sequoia Capital has a dedicated Southeast Asia team investing in category-defining companies from seed through growth. We bring global networks and operational experience to our portfolio.',
    investmentThesis: 'We invest in companies that can define or redefine large categories. We look for mission-driven founders, clear product-market fit, and the potential for enduring impact.',
    howToApply: 'Apply through our website or via referral. We focus on technology and healthcare companies with strong product-market fit and scalable business models.',
    portfolioHighlights: ['Gojek', 'Grab', 'Tokopedia', 'Kredivo'],
    dealsLast12Months: 24,
    avgResponseDays: 5,
    preferredIntro: 'warm',
    leadOrFollow: 'Lead',
    views: 2100,
    tagline: 'Global venture firm with dedicated SEA practice',
    faqs: [
      { question: 'Do you take cold outreach?', answer: 'We prefer warm introductions from our network or portfolio founders, but we do review all applications.' },
      { question: 'What stage do you invest?', answer: 'We invest from seed through growth. Our SEA team focuses on early to growth stage.' },
    ],
  },
  {
    id: '3',
    name: '500 Startups',
    type: 'Accelerator',
    verified: true,
    rating: 4.7,
    description: 'Seed-stage accelerator and VC. We invest in exceptional founders globally with a focus on diverse and underrepresented teams.',
    location: 'Singapore',
    investmentRange: '$50K – $500K',
    portfolioCount: 380,
    focus: 'Early stage, Global',
    categories: ['Accelerator'],
    industries: ['Marketplace', 'AI/ML', 'Fintech', 'Consumer'],
    stages: ['Pre-seed', 'Seed'],
    foundedYear: 2010,
    website: 'https://500.co',
    featured: true,
    responseTime: 'Within 3 weeks',
    activeDeals: 'Cohort-based programs',
    about: '500 Global (formerly 500 Startups) runs accelerator programs and makes seed investments worldwide. We look for bold founders and early traction in large markets.',
    howToApply: 'Apply to our accelerator cohort via 500.co. Applications are reviewed on a rolling basis. We also make direct investments outside the program.',
    portfolioHighlights: ['Credit Karma', 'Canva', 'Grab', 'Bukalapak'],
    dealsLast12Months: 45,
    avgResponseDays: 14,
    preferredIntro: 'both',
    leadOrFollow: 'Both',
    views: 890,
    tagline: 'Seed-stage accelerator and VC, global focus',
  },
  {
    id: '4',
    name: 'Jane Capital',
    type: 'VC',
    verified: false,
    rating: 4.5,
    description: 'Focused on fintech and AI at the intersection of financial services and automation. Check size $500K – $2M for seed and Series A.',
    location: 'Singapore',
    investmentRange: '$500K – $2M',
    portfolioCount: 45,
    focus: 'FinTech, AI',
    categories: ['VC'],
    industries: ['Fintech', 'AI/ML', 'SaaS'],
    stages: ['Seed', 'Series A'],
    foundedYear: 2018,
    responseTime: 'Within 3 weeks',
    activeDeals: 'Selective',
    about: 'Jane Capital is a sector-focused VC backing fintech and AI companies in SEA. We provide capital and strategic support for regulatory, partnerships, and scaling.',
    howToApply: 'Send a one-pager and deck to our website. We prefer fintech or AI/ML with clear unit economics.',
    portfolioHighlights: ['Payment solutions', 'Lending tech', 'AI for finance'],
  },
  {
    id: '5',
    name: 'Seed Ventures',
    type: 'Angel',
    verified: false,
    rating: 4.4,
    contactPrivate: true,
    description: 'Angel network backing early-stage founders. We prefer pre-seed and seed with check sizes from $50K to $200K and a global remit.',
    location: 'Global',
    investmentRange: '$50K – $200K',
    portfolioCount: 95,
    focus: 'Early stage',
    categories: ['Angel'],
    industries: ['Consumer', 'Marketplace', 'E-commerce'],
    stages: ['Pre-seed', 'Seed'],
    responseTime: 'Within 1 month',
    about: 'Seed Ventures is an angel collective investing in pre-seed and seed stage companies globally. We focus on strong founding teams and clear problem-solution fit.',
    howToApply: 'Reach out via warm intro or our website. Include deck and key metrics. We invest individually and as a syndicate.',
  },
  {
    id: '6',
    name: 'Vertex Ventures',
    type: 'VC Fund',
    verified: true,
    rating: 4.6,
    description: 'Series A and B investor in technology and healthcare across Asia. We partner with companies that have achieved product-market fit.',
    location: 'Singapore',
    investmentRange: '$2M – $15M',
    portfolioCount: 160,
    focus: 'Series A/B, Technology, Healthcare',
    categories: ['VC Fund'],
    industries: ['Healthcare', 'Enterprise', 'B2B', 'AI/ML'],
    stages: ['Series A', 'Series B'],
    foundedYear: 1988,
    website: 'https://www.vertexventures.com',
    featured: true,
    responseTime: 'Within 2 weeks',
    activeDeals: 'Actively investing',
    about: 'Vertex Ventures is a Temasek-backed VC investing in technology and healthcare across Asia. We lead Series A and B rounds and work closely with portfolio on growth and expansion.',
    howToApply: 'Submit through our website or via referral. We typically engage after product-market fit and meaningful traction. Sector focus: deep tech, healthcare, enterprise.',
    portfolioHighlights: ['Grab', 'Patsnap', 'Nium', 'Ninja Van'],
    dealsLast12Months: 12,
    avgResponseDays: 12,
    preferredIntro: 'warm',
    leadOrFollow: 'Lead',
    faqs: [
      { question: 'What sectors do you focus on?', answer: 'Technology and healthcare, with emphasis on deep tech, enterprise, and healthcare innovation.' },
    ],
  },
  {
    id: '7',
    name: 'East Ventures',
    type: 'VC Fund',
    verified: true,
    rating: 4.6,
    description: "Southeast Asia's leading sector-agnostic venture capital firm. We invest from seed to growth across Indonesia and the region.",
    location: 'Indonesia',
    investmentRange: '$100K – $10M',
    portfolioCount: 250,
    focus: 'E-commerce, Fintech, Edtech',
    categories: ['VC Fund'],
    industries: ['E-commerce', 'Fintech', 'Edtech', 'Consumer'],
    stages: ['Pre-seed', 'Seed', 'Series A', 'Series B'],
    foundedYear: 2010,
    website: 'https://east.vc',
    featured: true,
    responseTime: 'Within 2 weeks',
    activeDeals: 'Actively investing',
    about: 'East Ventures is one of the earliest and most active VCs in Indonesia and SEA. We are sector-agnostic and back founders from idea stage through growth.',
    howToApply: 'Apply via our website or through a portfolio founder intro. We review all applications and prioritize Indonesia and SEA-focused companies.',
    portfolioHighlights: ['Tokopedia', 'Traveloka', 'SIRCLO', 'Sociolla'],
    dealsLast12Months: 30,
    avgResponseDays: 8,
    preferredIntro: 'both',
    leadOrFollow: 'Both',
  },
  {
    id: '8',
    name: 'Antler',
    type: 'Accelerator',
    verified: true,
    rating: 4.4,
    description: 'Global startup generator and early-stage venture capital firm. We invest at the idea stage and help build companies from zero.',
    location: 'Singapore',
    investmentRange: '$25K – $200K',
    portfolioCount: 150,
    focus: 'AI/ML, SaaS, Marketplace',
    categories: ['Accelerator'],
    industries: ['AI/ML', 'SaaS', 'Marketplace', 'Fintech'],
    stages: ['Pre-seed', 'Seed'],
    foundedYear: 2017,
    website: 'https://www.antler.co',
    featured: true,
    responseTime: 'Cohort-based',
    activeDeals: 'Cohort-based',
    about: 'Antler is a global early-stage VC that invests in founders at the idea stage. We run residency programs where we help form teams and validate ideas before investing.',
    howToApply: 'Apply to join an Antler residency in your city. We also consider direct investments in pre-seed companies with strong teams.',
    portfolioHighlights: ['Ninja Van', 'Carro', 'Advance.ai', 'Gradient'],
  },
  {
    id: '9',
    name: 'Vynn Capital',
    type: 'VC Fund',
    verified: false,
    rating: 4.3,
    contactPrivate: true,
    description: 'Early-stage VC focused on mobility, logistics, and sustainability in Southeast Asia.',
    location: 'Malaysia',
    investmentRange: '$300K – $3M',
    portfolioCount: 42,
    focus: 'Mobility, Logistics, Sustainability',
    categories: ['VC Fund'],
    industries: ['Logistics', 'Clean Tech', 'Mobility', 'B2B'],
    stages: ['Seed', 'Series A'],
    foundedYear: 2019,
    responseTime: 'Within 3 weeks',
    about: 'Vynn Capital backs early-stage companies in mobility, logistics, and sustainability. We support founders with capital and regional networks.',
    howToApply: 'Send deck and one-pager via our website. We prefer B2B or marketplace models in our focus sectors.',
  },
  {
    id: '10',
    name: 'Wavemaker Partners',
    type: 'VC Fund',
    verified: true,
    rating: 4.5,
    description: 'Cross-border VC investing in B2B and enterprise technology across Southeast Asia and the US.',
    location: 'Singapore',
    investmentRange: '$500K – $5M',
    portfolioCount: 180,
    focus: 'B2B, Enterprise, Deep Tech',
    categories: ['VC Fund'],
    industries: ['Enterprise', 'B2B', 'AI/ML', 'SaaS'],
    stages: ['Seed', 'Series A'],
    foundedYear: 2003,
    website: 'https://wavemaker.vc',
    responseTime: 'Within 2 weeks',
    activeDeals: 'Actively investing',
    about: 'Wavemaker Partners is a cross-border VC with offices in SEA and the US. We focus on B2B and enterprise software with global potential.',
    howToApply: 'Apply via our website. We look for B2B or enterprise companies with early revenue and clear path to scale.',
    portfolioHighlights: ['Patsnap', 'Carro', 'Grab', 'Omise'],
    dealsLast12Months: 15,
    avgResponseDays: 9,
    preferredIntro: 'both',
    leadOrFollow: 'Both',
  },
  {
    id: '11',
    name: 'AC Ventures',
    type: 'VC Fund',
    verified: true,
    rating: 4.5,
    description: 'Indonesia and SEA-focused early-stage VC. We invest in technology companies from pre-seed to Series B.',
    location: 'Indonesia',
    investmentRange: '$500K – $15M',
    portfolioCount: 90,
    focus: 'Fintech, E-commerce, SaaS, Climate',
    categories: ['VC Fund'],
    industries: ['Fintech', 'E-commerce', 'SaaS', 'Clean Tech', 'Consumer'],
    stages: ['Pre-seed', 'Seed', 'Series A', 'Series B'],
    foundedYear: 2019,
    website: 'https://acventures.id',
    featured: true,
    responseTime: 'Within 2 weeks',
    activeDeals: 'Actively investing',
    about: 'AC Ventures is an Indonesia and SEA-focused venture capital firm. We back technology companies that are shaping the future of the region.',
    investmentThesis: 'We look for strong teams, clear product-market fit, and large addressable markets in Indonesia and Southeast Asia.',
    howToApply: 'Apply via our website or through a portfolio/referral intro. We review all applications within two weeks.',
    portfolioHighlights: ['Xendit', 'Stockbit', 'Shipper', 'Kredivo'],
    keyFacts: ['90+ portfolio companies', 'Indonesia and SEA focus', 'Pre-seed to Series B'],
    geographies: ['Indonesia', 'Singapore', 'Malaysia'],
    recognition: ['Tech in Asia', 'e27', 'DealStreetAsia'],
    teamSize: '8 partners and investment team',
    dealsLast12Months: 22,
    avgResponseDays: 11,
    preferredIntro: 'both',
    leadOrFollow: 'Both',
    faqs: [
      { question: 'Which geographies do you cover?', answer: 'We focus on Indonesia and Southeast Asia, with the majority of our portfolio in Indonesia.' },
      { question: 'Do you lead rounds?', answer: 'Yes, we lead and follow from pre-seed through Series B.' },
    ],
  },
  {
    id: '12',
    name: 'Monk’s Hill Ventures',
    type: 'VC Fund',
    verified: true,
    rating: 4.6,
    description: 'Early-stage VC backing technology companies in Southeast Asia. Operator-led with hands-on support.',
    location: 'Singapore',
    investmentRange: '$1M – $10M',
    portfolioCount: 70,
    focus: 'B2B, Enterprise, Deep Tech',
    categories: ['VC Fund'],
    industries: ['Enterprise', 'B2B', 'AI/ML', 'SaaS', 'Fintech'],
    stages: ['Seed', 'Series A'],
    foundedYear: 2014,
    website: 'https://monkshill.com',
    responseTime: 'Within 1 week',
    activeDeals: 'Actively investing',
    about: 'Monk’s Hill Ventures is an operator-led VC in Southeast Asia. We partner with founders from seed to Series A and provide operational support.',
    investmentThesis: 'We back technical and product-led teams building B2B and enterprise software with global potential.',
    howToApply: 'Apply via our website. Warm intros from our network are welcome. We respond within a week.',
    portfolioHighlights: ['Ninja Van', 'Carro', 'Funding Societies', 'Glints'],
    dealsLast12Months: 14,
    avgResponseDays: 7,
    preferredIntro: 'warm',
    leadOrFollow: 'Lead',
  },
];

export const INVESTOR_CATEGORIES = ['All Categories', 'VC Fund', 'Accelerator', 'VC', 'Angel'];
export const INVESTOR_LOCATIONS = ['All Locations', 'Singapore', 'Indonesia', 'Malaysia', 'Global'];
export const INVESTOR_STAGES = ['Pre-seed', 'Seed', 'Series A', 'Series B', 'Growth'];

/** Unique industries across all investors (for directory filter) */
export const INVESTOR_INDUSTRIES = Array.from(
  new Set(INVESTORS.flatMap((i) => i.industries))
).sort();

/** Check size bands for filtering */
export const CHECK_SIZE_BANDS = [
  { id: 'any', label: 'Any', min: 0, max: Infinity },
  { id: 'under1m', label: 'Under $1M', min: 0, max: 1 },
  { id: '1m-5m', label: '$1M – $5M', min: 1, max: 5 },
  { id: '5m-20m', label: '$5M – $20M', min: 5, max: 20 },
  { id: '20m+', label: '$20M+', min: 20, max: Infinity },
];

export function getInvestorById(id: string): Investor | undefined {
  return INVESTORS.find((i) => i.id === id);
}

export function getSimilarInvestors(investor: Investor, limit = 4): Investor[] {
  return INVESTORS.filter(
    (i) =>
      i.id !== investor.id &&
      (i.location === investor.location || i.industries.some((ind) => investor.industries.includes(ind)))
  ).slice(0, limit);
}

/** Mock "people also viewed" – investor ids often viewed together */
const PEOPLE_ALSO_VIEWED_INVESTOR_IDS: Record<string, string[]> = {
  '1': ['2', '7', '11', '8'],
  '2': ['1', '6', '11', '3'],
  '3': ['8', '1', '2', '7'],
  '4': ['1', '11', '6', '9'],
  '5': ['3', '8', '1', '10'],
  '6': ['1', '2', '11', '12'],
  '7': ['11', '1', '2', '6'],
  '8': ['3', '1', '11', '10'],
  '9': ['10', '1', '4', '6'],
  '10': ['1', '12', '6', '9'],
  '11': ['1', '7', '2', '6'],
  '12': ['1', '6', '10', '11'],
};

export function getPeopleAlsoViewedInvestors(investorId: string, limit = 4): Investor[] {
  const ids = PEOPLE_ALSO_VIEWED_INVESTOR_IDS[investorId] ?? INVESTORS.filter((i) => i.id !== investorId).slice(0, limit).map((i) => i.id);
  return ids.slice(0, limit).map((id) => INVESTORS.find((i) => i.id === id)).filter(Boolean) as Investor[];
}

/** Parse investment range string to get typical max value in millions (approx) for filter */
function parseCheckSizeMax(range: string): number {
  const parts = range.split(/[–\-−]/).map((s) => s.trim());
  const last = parts[parts.length - 1] || range;
  const mMatch = last.match(/\$?([\d.,]+)\s*M/i);
  const kMatch = last.match(/\$?([\d.,]+)\s*K/i);
  if (mMatch) return parseFloat(mMatch[1].replace(/,/g, ''));
  if (kMatch) return parseFloat(kMatch[1].replace(/,/g, '')) / 1000;
  return 0;
}

export function investorMatchesCheckSize(inv: Investor, bandId: string): boolean {
  if (bandId === 'any') return true;
  const band = CHECK_SIZE_BANDS.find((b) => b.id === bandId);
  if (!band || band.id === 'any') return true;
  const maxM = parseCheckSizeMax(inv.investmentRange);
  return maxM >= band.min && maxM <= band.max;
}

/** Recommended investors (e.g. by recent activity, rating, or matching industries) */
export function getRecommendedInvestors(limit = 6): Investor[] {
  return [...INVESTORS]
    .filter((i) => i.featured || (i.dealsLast12Months && i.dealsLast12Months >= 10))
    .sort((a, b) => (b.dealsLast12Months ?? 0) - (a.dealsLast12Months ?? 0))
    .slice(0, limit);
}
