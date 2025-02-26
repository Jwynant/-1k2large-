import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { StorageService } from '../services/StorageService';

// Define types for our content items
export type ContentType = 'memory' | 'lesson' | 'goal' | 'reflection';

export type ContentItem = {
  id: string;
  title: string;
  date: string;
  type: ContentType;
  notes?: string;
  emoji?: string;
  media?: string[];
};

export type Season = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  memories: number;
};

// Define view modes
export type ViewMode = 'weeks' | 'months' | 'years';
export type ViewState = 'grid' | 'cluster';

// Define the state shape
type AppState = {
  viewMode: ViewMode;
  viewState: ViewState;
  selectedYear: number | null;
  selectedMonth: number | null;
  selectedWeek: number | null;
  selectedCell: { year: number; month?: number; week?: number } | null;
  content: Record<string, ContentItem[]>;
  seasons: Season[];
  userBirthDate: string | null;
  userAge: number;
  isLoading: boolean;
};

// Define action types
type Action =
  | { type: 'SET_VIEW_MODE'; payload: ViewMode }
  | { type: 'SET_VIEW_STATE'; payload: ViewState }
  | { type: 'SELECT_YEAR'; payload: number | null }
  | { type: 'SELECT_MONTH'; payload: number | null }
  | { type: 'SELECT_WEEK'; payload: number | null }
  | { type: 'SELECT_CELL'; payload: { year: number; month?: number; week?: number } | null }
  | { type: 'ADD_CONTENT'; payload: { key: string; item: ContentItem } }
  | { type: 'SET_BIRTH_DATE'; payload: string }
  | { type: 'SET_CONTENT'; payload: Record<string, ContentItem[]> }
  | { type: 'SET_SEASONS'; payload: Season[] }
  | { type: 'SET_LOADING'; payload: boolean };

// Initial state
const initialState: AppState = {
  viewMode: 'months',
  viewState: 'grid',
  selectedYear: null,
  selectedMonth: null,
  selectedWeek: null,
  selectedCell: null,
  content: {},
  seasons: [],
  userBirthDate: null,
  userAge: 36, // Default age until birth date is set
  isLoading: true,
};

// Reducer function
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };
    case 'SET_VIEW_STATE':
      return { ...state, viewState: action.payload };
    case 'SELECT_YEAR':
      return { ...state, selectedYear: action.payload };
    case 'SELECT_MONTH':
      return { ...state, selectedMonth: action.payload };
    case 'SELECT_WEEK':
      return { ...state, selectedWeek: action.payload };
    case 'SELECT_CELL':
      return { ...state, selectedCell: action.payload };
    case 'ADD_CONTENT': {
      const { key, item } = action.payload;
      const existingContent = state.content[key] || [];
      const newContent = {
        ...state.content,
        [key]: [...existingContent, item],
      };
      
      // Save to storage
      StorageService.saveContent(newContent);
      
      return {
        ...state,
        content: newContent,
      };
    }
    case 'SET_BIRTH_DATE': {
      // Calculate age based on birth date
      const birthDate = new Date(action.payload);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      // Save to storage
      StorageService.saveUserBirthDate(action.payload);
      
      return {
        ...state,
        userBirthDate: action.payload,
        userAge: age,
      };
    }
    case 'SET_CONTENT':
      return { ...state, content: action.payload };
    case 'SET_SEASONS':
      return { ...state, seasons: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

// Create context
type AppContextType = {
  state: AppState;
  dispatch: React.Dispatch<Action>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from storage on initial mount
  useEffect(() => {
    const loadData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        // Load content
        const content = await StorageService.loadContent();
        if (content) {
          dispatch({ type: 'SET_CONTENT', payload: content });
        }
        
        // Load seasons
        const seasons = await StorageService.loadSeasons();
        if (seasons) {
          dispatch({ type: 'SET_SEASONS', payload: seasons });
        }
        
        // Load birth date
        const birthDate = await StorageService.loadUserBirthDate();
        if (birthDate) {
          dispatch({ type: 'SET_BIRTH_DATE', payload: birthDate });
        }
        
        // Load view mode
        const viewMode = await StorageService.loadViewMode();
        if (viewMode && (viewMode === 'weeks' || viewMode === 'months' || viewMode === 'years')) {
          dispatch({ type: 'SET_VIEW_MODE', payload: viewMode as ViewMode });
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    
    loadData();
  }, []);
  
  // Save view mode when it changes
  useEffect(() => {
    StorageService.saveViewMode(state.viewMode);
  }, [state.viewMode]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook for using the context
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
} 