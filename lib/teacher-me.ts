import type { Teacher } from './mock-teachers';

const STORAGE_KEY = 'growthlab_teacher_profile';

export function getMyTeacherFromStorage(): Teacher | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Record<string, unknown>;
    if (!data || typeof data.name !== 'string') return null;
    return data as unknown as Teacher;
  } catch {
    return null;
  }
}

export function setMyTeacherInStorage(teacher: Teacher): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(teacher));
  } catch {
    // ignore
  }
}

export function getEmptyTeacher(): Teacher {
  return {
    id: 'me',
    name: '',
    location: '',
    description: '',
    expertise: [],
    rating: 0,
    available: true,
    verified: false,
  };
}
