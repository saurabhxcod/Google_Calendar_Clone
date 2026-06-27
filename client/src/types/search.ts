import React from 'react';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  color: string;
  allDay: boolean;
  calendarId: string;
}

export interface SearchState {
  query: string;
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  isOpen: boolean;
  selectedIndex: number;
}

export interface UseEventSearchReturn {
  query: string;
  setQuery: (q: string) => void;
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  isOpen: boolean;
  selectedIndex: number;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
  clearSearch: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  closeDropdown: () => void;
}
