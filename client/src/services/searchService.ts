import api from './api';
import type { SearchResult } from '../types/search';

export const SEARCH_CACHE = new Map<string, SearchResult[]>();

export function getCachedResults(query: string): SearchResult[] | null {
  const key = query.trim().toLowerCase();
  if (!key) return null;
  return SEARCH_CACHE.get(key) ?? null;
}

export function setCachedResults(query: string, results: SearchResult[]): void {
  const key = query.trim().toLowerCase();
  if (!key) return;
  SEARCH_CACHE.set(key, results);
  if (SEARCH_CACHE.size > 50) {
    const firstKey = SEARCH_CACHE.keys().next().value;
    if (firstKey !== undefined) {
      SEARCH_CACHE.delete(firstKey);
    }
  }
}

export async function searchEvents(query: string): Promise<SearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  try {
    const response = await api.get<SearchResult[]>('/events/search', {
      params: { q: trimmed },
    });
    return response.data || [];
  } catch (err) {
    console.error('searchEvents service error:', err);
    return [];
  }
}
