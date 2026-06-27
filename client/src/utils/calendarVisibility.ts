export interface CalendarDefinition {
  id: string;
  name: string;
  color: string;
  visible: boolean;
  type: 'primary' | 'system';
  section: 'my' | 'other';
}

export type VisibilityMap = Record<string, boolean>;

export const DEFAULT_CALENDARS: CalendarDefinition[] = [
  { id: 'primary', name: 'My Calendar', color: '#F6BF26', visible: true, type: 'primary', section: 'my' },
  { id: 'birthdays', name: 'Birthdays', color: '#34A853', visible: true, type: 'system', section: 'my' },
  { id: 'tasks', name: 'Tasks', color: '#4285F4', visible: false, type: 'system', section: 'my' },
  { id: 'holidays', name: 'Holidays in India', color: '#0F9D58', visible: true, type: 'system', section: 'other' },
];

export function buildDefaultVisibilityMap(): VisibilityMap {
  const map: VisibilityMap = {};
  DEFAULT_CALENDARS.forEach((cal) => {
    map[cal.id] = cal.visible;
  });
  return map;
}

export function loadVisibilityFromStorage(): VisibilityMap | null {
  try {
    const raw = localStorage.getItem('calendar_visibility');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed as VisibilityMap;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveVisibilityToStorage(map: VisibilityMap): void {
  try {
    localStorage.setItem('calendar_visibility', JSON.stringify(map));
  } catch {
  }
}

export function ensureAtLeastOneVisible(map: VisibilityMap): VisibilityMap {
  const updated = { ...map };
  const hasVisible = Object.values(updated).some((val) => val === true);
  if (!hasVisible) {
    updated['primary'] = true;
  }
  return updated;
}
