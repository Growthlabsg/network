import type { Mentor } from './mock-mentors';

const STORAGE_KEY = 'growthlab_mentor_profile';

export function getMyMentorFromStorage(): Mentor | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Record<string, unknown>;
    if (!data || typeof data.name !== 'string') return null;
    return data as unknown as Mentor;
  } catch {
    return null;
  }
}

export function setMyMentorInStorage(mentor: Mentor): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mentor));
  } catch {
    // ignore
  }
}

export function getEmptyMentor(): Mentor {
  return {
    id: 'me',
    name: '',
    description: '',
    location: '',
    expertise: [],
    industries: [],
    verified: false,
    rating: 0,
    sessions: 0,
  };
}
