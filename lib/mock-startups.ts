/** Region for global directory (Americas, Europe, Asia Pacific, etc.) */
export type StartupRegion = 'Americas' | 'Europe' | 'Asia Pacific' | 'Middle East & Africa';

export interface Startup {
  id: string;
  name: string;
  /** URL to the startup's logo image */
  logo: string;
  /** Optional URL to cover/banner image for profile hero */
  coverImage?: string;
  description: string;
  industry: string;
  stage: string;
  size: string;
  location: string;
  region: StartupRegion;
  funding: string;
  employees: number;
  views: number;
  growthRate: string;
  tags: string[];
  hiring: boolean;
  openPositions: number;
  partnerships: boolean;
  verified: boolean;
  foundedYear: number;
  website: string;
  featured: boolean;
  trending: boolean;
  /** Optional social and contact */
  linkedinUrl?: string;
  twitterUrl?: string;
  contactEmail?: string;
  /** Optional resources */
  pitchDeckUrl?: string;
  onePagerUrl?: string;
  videoUrl?: string;
}

/** Testimonial from customer or investor */
export interface StartupTestimonial {
  quote: string;
  author: string;
  role: string;
  company?: string;
}

/** Product offered by a startup */
export interface StartupProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'Live' | 'Beta' | 'Coming soon';
  url?: string;
}

/** Products by startup id */
export const STARTUP_PRODUCTS: Record<string, StartupProduct[]> = {
  '1': [
    { id: 'p1', name: 'Workflow AI', description: 'AI-powered workflow automation for enterprise teams. Automates repetitive tasks and integrates with existing tools.', category: 'SaaS', status: 'Live', url: 'https://technova.sg/workflow-ai' },
    { id: 'p2', name: 'Data Pipeline Studio', description: 'No-code data pipelines with built-in connectors and transformations for analytics and ML.', category: 'Data', status: 'Live', url: 'https://technova.sg/data-studio' },
    { id: 'p3', name: 'APAC Compliance Hub', description: 'Compliance monitoring and reporting for Asia Pacific regulations. Updated in real time.', category: 'Compliance', status: 'Beta', url: 'https://technova.sg/compliance' },
  ],
  '2': [
    { id: 'p4', name: 'SME Pay', description: 'Integrated payments and invoicing for small and medium businesses with multi-currency support.', category: 'Payments', status: 'Live' },
    { id: 'p5', name: 'Cashflow Forecast', description: 'AI-driven cashflow forecasting and scenario planning for growing teams.', category: 'Analytics', status: 'Beta' },
  ],
  '3': [
    { id: 'p6', name: 'GreenTrack', description: 'Carbon footprint tracking and reporting for supply chains and logistics.', category: 'Sustainability', status: 'Live' },
    { id: 'p7', name: 'Supplier Scorecard', description: 'ESG and performance scorecards for suppliers with automated data collection.', category: 'Sustainability', status: 'Beta' },
  ],
};

export function getProductsForStartup(startupId: string): StartupProduct[] {
  return STARTUP_PRODUCTS[startupId] ?? [];
}

/** Testimonials by startup id */
export const STARTUP_TESTIMONIALS: Record<string, StartupTestimonial[]> = {
  '1': [
    { quote: 'TechNova reduced our workflow setup time by 70%. A must for any scaling team.', author: 'Priya Sharma', role: 'Head of Ops', company: 'Fortune 500 APAC' },
    { quote: 'Best-in-class automation. We evaluated five vendors and chose TechNova.', author: 'Marcus Lee', role: 'CTO', company: 'DataFirst' },
  ],
  '2': [
    { quote: 'Finally, payments that scale with our growth. Implementation took a week.', author: 'Wei Chen', role: 'Founder', company: 'SME Hub' },
  ],
  '3': [
    { quote: 'Their AI triage saved us 40% in support costs. Game-changer for healthcare.', author: 'Dr. Amy Ng', role: 'Medical Director', company: 'City Clinic' },
  ],
};

/** Mock "people also viewed" – startup ids often viewed together (no analytics yet) */
const PEOPLE_ALSO_VIEWED_IDS: Record<string, string[]> = {
  '1': ['2', '3', '5', '6'],
  '2': ['1', '8', '3'],
  '3': ['1', '4', '7'],
  '4': ['3', '7', '9'],
  '5': ['1', '6', '3'],
  '6': ['1', '5', '9'],
  '7': ['3', '4', '8'],
  '8': ['2', '7', '1'],
  '9': ['4', '6', '3'],
};

export function getPeopleAlsoViewed(startupId: string, limit = 4): Startup[] {
  const ids = PEOPLE_ALSO_VIEWED_IDS[startupId] ?? STARTUPS.filter((s) => s.id !== startupId).slice(0, limit).map((s) => s.id);
  return ids.slice(0, limit).map((id) => STARTUPS.find((s) => s.id === id)).filter(Boolean) as Startup[];
}

export const REGIONS: StartupRegion[] = ['Americas', 'Europe', 'Asia Pacific', 'Middle East & Africa'];

export const STARTUPS: Startup[] = [
  {
    id: '1',
    name: 'TechNova Solutions',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=TechNova&backgroundColor=0ea5e9',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80',
    description: 'AI-powered solutions for enterprise workflow automation and digital transformation',
    industry: 'Artificial Intelligence',
    stage: 'Series A',
    size: '11-50',
    location: 'Singapore',
    region: 'Asia Pacific',
    funding: '$2.5M',
    employees: 25,
    views: 1240,
    growthRate: '45%',
    tags: ['AI', 'Enterprise', 'SaaS', 'Automation'],
    hiring: true,
    openPositions: 8,
    partnerships: true,
    verified: true,
    foundedYear: 2020,
    website: 'https://technova.sg',
    featured: true,
    trending: true,
    linkedinUrl: 'https://linkedin.com/company/technova-sg',
    twitterUrl: 'https://x.com/technovasg',
    contactEmail: 'hello@technova.sg',
    pitchDeckUrl: 'https://technova.sg/pitch.pdf',
    onePagerUrl: 'https://technova.sg/onepager.pdf',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: '2',
    name: 'FinFlow Pro',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=FinFlow&backgroundColor=059669',
    coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80',
    description: 'Next-generation financial technology platform for SMEs with integrated payment solutions',
    industry: 'Financial Technology',
    stage: 'Seed',
    size: '1-10',
    location: 'Singapore',
    region: 'Asia Pacific',
    funding: '$500K',
    employees: 8,
    views: 890,
    growthRate: '120%',
    tags: ['FinTech', 'SME', 'Payments'],
    hiring: false,
    openPositions: 0,
    partnerships: false,
    verified: false,
    foundedYear: 2022,
    website: 'https://finflowpro.com',
    featured: false,
    trending: false,
    linkedinUrl: 'https://linkedin.com/company/finflowpro',
    contactEmail: 'contact@finflowpro.com',
    pitchDeckUrl: 'https://finflowpro.com/deck',
  },
  {
    id: '3',
    name: 'HealthTech Innovations',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=HealthTech&backgroundColor=7c3aed',
    coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80',
    description: 'Revolutionary healthcare technology solutions powered by AI and machine learning',
    industry: 'Healthcare Technology',
    stage: 'Series B',
    size: '51-200',
    location: 'Singapore',
    region: 'Asia Pacific',
    funding: '$8.2M',
    employees: 120,
    views: 2100,
    growthRate: '78%',
    tags: ['Healthcare', 'AI', 'Telemedicine'],
    hiring: true,
    openPositions: 15,
    partnerships: true,
    verified: true,
    foundedYear: 2019,
    website: 'https://healthtechinnovations.sg',
    featured: true,
    trending: true,
    linkedinUrl: 'https://linkedin.com/company/healthtech-innovations',
    contactEmail: 'partnerships@healthtechinnovations.sg',
    videoUrl: 'https://www.youtube.com/embed/kJQP7kiw5Fk',
  },
  {
    id: '4',
    name: 'GreenTech Solutions',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=GreenTech&backgroundColor=10b981',
    coverImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&q=80',
    description: 'Sustainable technology solutions for carbon footprint reduction and renewable energy',
    industry: 'Clean Technology',
    stage: 'Series A',
    size: '11-50',
    location: 'Singapore',
    region: 'Asia Pacific',
    funding: '$3.8M',
    employees: 35,
    views: 1560,
    growthRate: '92%',
    tags: ['CleanTech', 'Sustainability', 'Renewable Energy'],
    hiring: true,
    openPositions: 12,
    partnerships: true,
    verified: true,
    foundedYear: 2021,
    website: 'https://greentech.sg',
    featured: true,
    trending: false,
  },
  {
    id: '5',
    name: 'Neural Labs',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=NeuralLabs&backgroundColor=8b5cf6',
    coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80',
    description: 'Deep learning infrastructure for computer vision and NLP at scale',
    industry: 'Artificial Intelligence',
    stage: 'Series A',
    size: '11-50',
    location: 'San Francisco, USA',
    region: 'Americas',
    funding: '$4.1M',
    employees: 42,
    views: 3200,
    growthRate: '156%',
    tags: ['AI', 'ML', 'Computer Vision', 'NLP'],
    hiring: true,
    openPositions: 6,
    partnerships: true,
    verified: true,
    foundedYear: 2021,
    website: 'https://neurallabs.io',
    featured: true,
    trending: true,
  },
  {
    id: '6',
    name: 'EduStream',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=EduStream&backgroundColor=f59e0b',
    coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80',
    description: 'Live and on-demand learning platform for upskilling and certifications',
    industry: 'Education Technology',
    stage: 'Seed',
    size: '1-10',
    location: 'London, UK',
    region: 'Europe',
    funding: '$1.2M',
    employees: 12,
    views: 780,
    growthRate: '88%',
    tags: ['EdTech', 'Learning', 'Certifications'],
    hiring: true,
    openPositions: 4,
    partnerships: false,
    verified: false,
    foundedYear: 2023,
    website: 'https://edustream.co',
    featured: false,
    trending: false,
  },
  {
    id: '7',
    name: 'LogiChain',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=LogiChain&backgroundColor=0ea5e9',
    coverImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80',
    description: 'Smart logistics and last-mile delivery optimization for e-commerce',
    industry: 'Logistics & Transportation',
    stage: 'Series B',
    size: '51-200',
    location: 'Berlin, Germany',
    region: 'Europe',
    funding: '$12M',
    employees: 180,
    views: 4100,
    growthRate: '62%',
    tags: ['Logistics', 'E-commerce', 'Supply Chain'],
    hiring: true,
    openPositions: 22,
    partnerships: true,
    verified: true,
    foundedYear: 2018,
    website: 'https://logichain.eu',
    featured: true,
    trending: true,
  },
  {
    id: '8',
    name: 'PayBridge',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=PayBridge&backgroundColor=ec4899',
    coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&q=80',
    description: 'Cross-border B2B payments and FX for emerging markets',
    industry: 'Financial Technology',
    stage: 'Series A',
    size: '11-50',
    location: 'Dubai, UAE',
    region: 'Middle East & Africa',
    funding: '$5M',
    employees: 38,
    views: 1900,
    growthRate: '110%',
    tags: ['FinTech', 'Payments', 'B2B', 'FX'],
    hiring: true,
    openPositions: 5,
    partnerships: true,
    verified: true,
    foundedYear: 2020,
    website: 'https://paybridge.ae',
    featured: false,
    trending: true,
  },
  {
    id: '9',
    name: 'AgriGrow',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=AgriGrow&backgroundColor=84cc16',
    coverImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80',
    description: 'IoT and analytics for precision agriculture and crop yield',
    industry: 'Clean Technology',
    stage: 'Pre-seed',
    size: '1-10',
    location: 'Bangalore, India',
    region: 'Asia Pacific',
    funding: '$300K',
    employees: 6,
    views: 420,
    growthRate: '200%',
    tags: ['AgTech', 'IoT', 'Sustainability'],
    hiring: false,
    openPositions: 0,
    partnerships: false,
    verified: false,
    foundedYear: 2023,
    website: 'https://agrigrow.in',
    featured: false,
    trending: false,
  },
];
