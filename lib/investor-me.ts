import type { Investor } from './mock-investors';

const STORAGE_KEY = 'growthlab_investor_profile';

export function getMyInvestorFromStorage(): Investor | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Record<string, unknown>;
    if (!data || typeof data.name !== 'string') return null;
    return data as unknown as Investor;
  } catch {
    return null;
  }
}

export function setMyInvestorInStorage(investor: Investor): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(investor));
  } catch {
    // ignore
  }
}

/** Minimal empty investor for "Create profile" form */
export function getEmptyInvestor(): Investor {
  return {
    id: 'me',
    name: '',
    type: '',
    verified: false,
    rating: 0,
    description: '',
    location: '',
    investmentRange: '',
    portfolioCount: 0,
    focus: '',
    categories: [],
    industries: [],
  };
}
