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

// Focus Area Types
export interface FocusArea {
  id: string;
  name: string;
  color: string; // From predefined palette
  allocation: number; // Percentage of focus
  rank: number; // Order of importance (1 = primary, 2 = secondary, etc.)
  description?: string;
}

// Content Types
export type ContentType = 'memory' | 'goal' | 'insight';

export interface SubGoal {
  id: string;
  title: string;
  isCompleted: boolean;
  deadline?: string;
}

export interface MediaItem {
  uri: string;
  type: 'photo' | 'video' | 'audio';
}

export interface ContentItem {
  id: string;
  title: string;
  date: string;
  type: ContentType;
  notes?: string;
  emoji?: string;
  
  // Type-specific fields
  // For goals:
  deadline?: string;
  progress?: number; // 0-100 percentage
  focusAreaId?: string;
  milestones?: SubGoal[];
  isCompleted?: boolean;
  
  // For memories:
  media?: string[];
  mediaType?: 'photo' | 'video' | 'audio';
  emotion?: string; // Free text entry
  isSpecialEvent?: boolean; // For annual recognition
  
  // For insights:
  relatedGoalIds?: string[]; // Multiple connections possible
  relatedMemoryIds?: string[]; // Multiple connections possible
  importance?: number; // 1-5 scale
}

export interface Season {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  memories: number;
}

// User Settings
export interface UserSettings {
  lifeExpectancy: number; // Default 83 (1000 months)
  notifications: {
    goalDeadlines: boolean;
    priorityReminders: boolean;
    reflectionPrompts: boolean;
    memoryCapture: boolean;
  };
  // Added properties for profile settings
  notificationsEnabled: boolean;
  showCompletedGoals: boolean;
  weekStartsOnMonday: boolean;
}

// Form Types
export interface ContentFormState {
  title: string;
  notes: string;
  date: Date;
  emoji: string;
  importance: number;
  media: string[];
  
  // Goal-specific fields
  deadline?: Date;
  progress?: number;
  focusAreaId?: string;
  milestones?: SubGoal[];
  
  // Memory-specific fields
  mediaType?: 'photo' | 'video' | 'audio';
  emotion?: string;
  isSpecialEvent?: boolean;
  
  // Insight-specific fields
  relatedGoalIds?: string[];
  relatedMemoryIds?: string[];
}

export interface ContentFormErrors {
  title?: string;
  notes?: string;
  date?: string;
  emoji?: string;
  deadline?: string;
  focusAreaId?: string;
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
  focusAreas: FocusArea[];
  userSettings: UserSettings;
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
  | { type: 'ADD_FOCUS_AREA'; payload: FocusArea }
  | { type: 'UPDATE_FOCUS_AREA'; payload: FocusArea }
  | { type: 'DELETE_FOCUS_AREA'; payload: string }
  | { type: 'REORDER_FOCUS_AREAS'; payload: string[] } // IDs in new order
  | { type: 'UPDATE_USER_SETTINGS'; payload: Partial<UserSettings> }
  | { type: 'SET_THEME'; payload: 'dark' | 'light' | 'system' }
  | { type: 'LOAD_DATA'; payload: { contentItems: ContentItem[]; seasons: Season[]; focusAreas: FocusArea[]; userSettings: UserSettings } };

// Provide a default export for the types file
// This is a dummy component to satisfy Expo Router's requirements
export default function Types() {
  return null;
} 