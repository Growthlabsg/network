import type { Incubator } from './mock-incubators';

const STORAGE_KEY = 'growthlab_incubator_profile';

export function getMyIncubatorFromStorage(): Incubator | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Record<string, unknown>;
    if (!data || typeof data.name !== 'string') return null;
    return data as unknown as Incubator;
  } catch {
    return null;
  }
}

export function setMyIncubatorInStorage(incubator: Incubator): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(incubator));
  } catch {
    // ignore
  }
}

export function getEmptyIncubator(): Incubator {
  return {
    id: 'me',
    name: '',
    type: 'Accelerator',
    description: '',
    location: '',
    industries: [],
    verified: false,
  };
}
