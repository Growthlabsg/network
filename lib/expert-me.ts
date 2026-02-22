import type { IndustryExpert } from './mock-industry-experts';

const STORAGE_KEY = 'growthlab_expert_profile';

export function getMyExpertFromStorage(): IndustryExpert | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Record<string, unknown>;
    if (!data || typeof data.name !== 'string') return null;
    return data as unknown as IndustryExpert;
  } catch {
    return null;
  }
}

export function setMyExpertInStorage(expert: IndustryExpert): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expert));
  } catch {
    // ignore
  }
}

/** Minimal empty expert for "Create profile" form */
export function getEmptyExpert(): IndustryExpert {
  return {
    id: 'me',
    name: '',
    location: '',
    description: '',
    expertise: [],
    rating: 0,
    verified: false,
  };
}
