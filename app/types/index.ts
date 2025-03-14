// View and Navigation Types
export type ViewMode = 'weeks' | 'months' | 'years';
export type ViewState = 'grid' | 'cluster';
export type DisplayMode = 'grid';

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
  isPast: boolean; // Added to indicate if the year is in the past
}

// Focus Area Types
export type PriorityLevel = 'essential' | 'important' | 'supplemental';

// Category type for the global category system
export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
  description?: string;
}

export interface FocusArea {
  id: string;
  name: string;
  color: string; // From predefined palette
  rank: number; // Order of importance within priority level
  priorityLevel: PriorityLevel; // Explicit priority level
  categoryIds?: string[]; // IDs of associated categories
  description?: string; // Keep description for notes
  status?: 'active' | 'dormant'; // Track whether focus area has active goals
  lastUpdated?: string; // Track when the focus area was last updated
}

// Content Types
export type ContentType = 'memory' | 'goal' | 'lesson';

export interface SubGoal {
  id: string;
  title: string;
  isCompleted: boolean;
  deadline?: string;
}

export interface MediaItem {
  uri: string;
  type: 'photo';
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
  categoryIds?: string[]; // NEW: IDs of associated categories
  
  // For memories:
  media?: string[];
  
  // For lessons:
  isFavorite?: boolean;
  reminder?: {
    nextReminder: string; // ISO date string
    recurring: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
    lastSent?: string; // ISO date string
  };
  isTimeless?: boolean; // If true, not tied to a specific date
  
  // For insights (deprecated):
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
    memoryCapture: boolean;
  };
  // Added properties for profile settings
  notificationsEnabled: boolean;
  showCompletedGoals: boolean;
  // Add daily reflection time
  dailyReflectionTime?: {
    hour: number;
    minute: number;
  };
}

// Form Types
export interface ContentFormState {
  title: string;
  notes: string;
  date: Date;
  emoji: string;
  media: string[];
  categoryIds: string[]; // Add category support
  
  // Goal-specific fields
  deadline?: Date;
  progress?: number;
  focusAreaId?: string;
  milestones?: SubGoal[];
  
  // Memory-specific fields
  // Removing mediaType, emotion, isSpecialEvent
  
  // Lesson-specific fields
  isFavorite?: boolean;
  reminder?: {
    nextReminder: Date;
    recurring: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  };
  isTimeless?: boolean;
  
  // Insight-specific fields (deprecated)
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
  displayMode: DisplayMode;
  selectedYear: number | null;
  selectedMonth: number | null;
  selectedWeek: number | null;
  selectedCell: SelectedCell | null;
  contentItems: ContentItem[];
  seasons: Season[];
  focusAreas: FocusArea[];
  categories: Category[]; // NEW: Global categories list
  userSettings: UserSettings;
  theme: 'dark' | 'light' | 'system';
}

export type AppAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER_BIRTH_DATE'; payload: string }
  | { type: 'SET_ACCENT_COLOR'; payload: string }
  | { type: 'SET_VIEW_MODE'; payload: ViewMode }
  | { type: 'SET_VIEW_STATE'; payload: ViewState }
  | { type: 'SET_DISPLAY_MODE'; payload: DisplayMode }
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
  | { type: 'REORDER_FOCUS_AREAS'; payload: string[] }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'LOAD_CATEGORIES'; payload: Category[] }
  | { type: 'UPDATE_USER_SETTINGS'; payload: Partial<UserSettings> }
  | { type: 'SET_THEME'; payload: 'dark' | 'light' | 'system' }
  | { type: 'LOAD_DATA'; payload: { contentItems: ContentItem[]; seasons: Season[]; focusAreas: FocusArea[]; userSettings: UserSettings; categories?: Category[] } }
  | { type: 'INITIALIZE_APP'; payload: { 
      contentItems: ContentItem[]; 
      seasons: Season[]; 
      focusAreas: FocusArea[]; 
      userSettings: UserSettings; 
      categories: Category[];
      userBirthDate: string | null;
      theme: 'dark' | 'light' | 'system';
    } 
  };

// Provide a default export for the types file
// This is a dummy component to satisfy Expo Router's requirements
export default function Types() {
  return null;
} 