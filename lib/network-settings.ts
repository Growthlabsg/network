/**
 * Network section settings (local only).
 * No account or sign out – those are handled by the main platform when integrated.
 */

const STORAGE_KEY = 'growthlab-network-settings';

export type Theme = 'light' | 'dark' | 'system';

export interface NetworkSettings {
  /** Notify on new connection requests */
  notifyConnectionRequests: boolean;
  /** Notify on new messages */
  notifyNewMessages: boolean;
  /** UI theme when run standalone; when embedded, main platform may override */
  theme: Theme;
}

const DEFAULTS: NetworkSettings = {
  notifyConnectionRequests: true,
  notifyNewMessages: true,
  theme: 'system',
};

export function getNetworkSettings(): NetworkSettings {
  if (typeof window === 'undefined') return DEFAULTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<NetworkSettings>;
    return { ...DEFAULTS, ...parsed };
  } catch {
    return DEFAULTS;
  }
}

export function setNetworkSettings(partial: Partial<NetworkSettings>): NetworkSettings {
  const current = getNetworkSettings();
  const next = { ...current, ...partial };
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }
  return next;
}

export function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const prefersDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const useDark = theme === 'dark' || (theme === 'system' && prefersDark);
  if (useDark) root.classList.add('dark');
  else root.classList.remove('dark');
}

/** Clear all local data stored by the network section (messages, settings). */
export function clearNetworkLocalData(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('growthlab-messages');
    // Add other network keys here if needed (e.g. saved items, drafts)
  } catch {
    // ignore
  }
}
