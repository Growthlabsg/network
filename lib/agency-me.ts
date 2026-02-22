import type { GovernmentAgency } from './mock-government-agencies';

const STORAGE_KEY = 'growthlab_agency_profile';

export function getMyAgencyFromStorage(): GovernmentAgency | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Record<string, unknown>;
    if (!data || typeof data.name !== 'string') return null;
    return data as unknown as GovernmentAgency;
  } catch {
    return null;
  }
}

export function setMyAgencyInStorage(agency: GovernmentAgency): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(agency));
  } catch {
    // ignore
  }
}

export function getEmptyAgency(): GovernmentAgency {
  return {
    id: 'me',
    name: '',
    category: '',
    location: '',
    description: '',
    programs: [],
    rating: 0,
    verified: false,
  };
}
