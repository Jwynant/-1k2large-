// View and Navigation Types
export type ViewMode = 'weeks' | 'months' | 'years';
export type ViewState = 'grid' | 'cluster';

// Grid Types
export interface ClusterPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SelectedCell {
  year: number;
  month?: number;
  week?: number;
}

export interface Cluster {
  year: number;
  isCurrent: boolean;
}

// Content Types
export type ContentType = 'memory' | 'lesson' | 'goal' | 'reflection';

export interface ContentItem {
  id: string;
  title: string;
  date: string;
  type: ContentType;
  notes?: string;
  emoji?: string;
  importance?: number;
  media?: string[];
}

export interface Season {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  memories: number;
}

// Form Types
export interface ContentFormState {
  title: string;
  notes: string;
  date: Date;
  emoji: string;
  importance: number;
  media: string[];
}

export interface ContentFormErrors {
  title?: string;
  notes?: string;
  date?: string;
  emoji?: string;
}

// App State Types
export interface AppState {
  isLoading: boolean;
  userBirthDate: string | null;
  accentColor: string;
  viewMode: ViewMode;
  viewState: ViewState;
  selectedYear: number | null;
  selectedMonth: number | null;
  selectedWeek: number | null;
  selectedCell: SelectedCell | null;
  contentItems: ContentItem[];
  seasons: Season[];
  theme: 'dark' | 'light' | 'system';
}

export type AppAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER_BIRTH_DATE'; payload: string }
  | { type: 'SET_ACCENT_COLOR'; payload: string }
  | { type: 'SET_VIEW_MODE'; payload: ViewMode }
  | { type: 'SET_VIEW_STATE'; payload: ViewState }
  | { type: 'SELECT_YEAR'; payload: number | null }
  | { type: 'SELECT_MONTH'; payload: number | null }
  | { type: 'SELECT_WEEK'; payload: number | null }
  | { type: 'SELECT_CELL'; payload: SelectedCell | null }
  | { type: 'ADD_CONTENT_ITEM'; payload: ContentItem }
  | { type: 'UPDATE_CONTENT_ITEM'; payload: ContentItem }
  | { type: 'DELETE_CONTENT_ITEM'; payload: string }
  | { type: 'ADD_SEASON'; payload: Season }
  | { type: 'UPDATE_SEASON'; payload: Season }
  | { type: 'DELETE_SEASON'; payload: string }
  | { type: 'SET_THEME'; payload: 'dark' | 'light' | 'system' }
  | { type: 'LOAD_DATA'; payload: { contentItems: ContentItem[]; seasons: Season[] } };

// Default export for Expo Router
import React from 'react';

export default function AppTypes() {
  // This is a dummy component that satisfies Expo Router's requirement
  // for having a React component as the default export
  return null;
} 