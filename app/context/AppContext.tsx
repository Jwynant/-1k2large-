import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { StorageService } from '../services/StorageService';
import { 
  AppState, 
  AppAction, 
  ContentItem, 
  Season, 
  ViewMode, 
  ViewState,
  DisplayMode,
  SelectedCell,
  FocusArea,
  UserSettings,
} from '../types';
import { migrateFocusAreas, needsFocusAreaMigration } from '../utils/migrations';
import { DEFAULT_CATEGORIES } from '../hooks/useCategories';

// Create the context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({
  state: {
    isLoading: true,
    userBirthDate: null,
    accentColor: '#007AFF',
    viewMode: 'months',
    viewState: 'grid',
    displayMode: 'grid', // Default to grid view only
    selectedYear: null,
    selectedMonth: null,
    selectedWeek: null,
    selectedCell: null,
    contentItems: [],
    seasons: [],
    focusAreas: [],
    categories: [],
    userSettings: {
      lifeExpectancy: 83, // Default 83 years (approximately 1000 months)
      notifications: {
        goalDeadlines: true,
        priorityReminders: true,
        memoryCapture: true
      },
      notificationsEnabled: true,
      showCompletedGoals: true,
      weekStartsOnMonday: false,
      gridAlignment: 'birth' // Default to birth date alignment
    },
    theme: 'dark',
  },
  dispatch: () => null,
});

// Initial state
const initialState: AppState = {
  isLoading: true,
  userBirthDate: null,
  accentColor: '#007AFF',
  viewMode: 'months',
  viewState: 'grid',
  displayMode: 'grid', // Always grid view
  selectedYear: null,
  selectedMonth: null,
  selectedWeek: null,
  selectedCell: null,
  contentItems: [],
  seasons: [],
  focusAreas: [],
  categories: [],
  userSettings: {
    lifeExpectancy: 83, // Default 83 years (approximately 1000 months)
    notifications: {
      goalDeadlines: true,
      priorityReminders: true,
      memoryCapture: true
    },
    notificationsEnabled: true,
    showCompletedGoals: true,
    weekStartsOnMonday: false,
    gridAlignment: 'birth' // Default to birth date alignment
  },
  theme: 'dark',
};

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER_BIRTH_DATE':
      return { ...state, userBirthDate: action.payload };
    case 'SET_ACCENT_COLOR':
      return { ...state, accentColor: action.payload };
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };
    case 'SET_VIEW_STATE':
      return { ...state, viewState: action.payload };
    case 'SET_DISPLAY_MODE':
      return { ...state, displayMode: action.payload };
    case 'SELECT_YEAR':
      return { ...state, selectedYear: action.payload };
    case 'SELECT_MONTH':
      return { ...state, selectedMonth: action.payload };
    case 'SELECT_WEEK':
      return { ...state, selectedWeek: action.payload };
    case 'SELECT_CELL':
      return { ...state, selectedCell: action.payload };
    case 'ADD_CONTENT_ITEM':
      return { 
        ...state, 
        contentItems: [...state.contentItems, action.payload] 
      };
    case 'UPDATE_CONTENT_ITEM':
      return { 
        ...state, 
        contentItems: state.contentItems.map(item => 
          item.id === action.payload.id ? action.payload : item
        ) 
      };
    case 'DELETE_CONTENT_ITEM':
      return { 
        ...state, 
        contentItems: state.contentItems.filter(item => item.id !== action.payload) 
      };
    case 'ADD_SEASON':
      return { 
        ...state, 
        seasons: [...state.seasons, action.payload] 
      };
    case 'UPDATE_SEASON':
      return { 
        ...state, 
        seasons: state.seasons.map(season => 
          season.id === action.payload.id ? action.payload : season
        ) 
      };
    case 'DELETE_SEASON':
      return { 
        ...state, 
        seasons: state.seasons.filter(season => season.id !== action.payload) 
      };
    case 'ADD_FOCUS_AREA':
      return { 
        ...state, 
        focusAreas: [...state.focusAreas, action.payload] 
      };
    case 'UPDATE_FOCUS_AREA':
      return { 
        ...state, 
        focusAreas: state.focusAreas.map(area => 
          area.id === action.payload.id ? action.payload : area
        ) 
      };
    case 'DELETE_FOCUS_AREA':
      return { 
        ...state, 
        focusAreas: state.focusAreas.filter(area => area.id !== action.payload) 
      };
    case 'REORDER_FOCUS_AREAS':
      const reorderedAreas = action.payload.map(id => 
        state.focusAreas.find(area => area.id === id)
      ).filter(area => area !== undefined) as FocusArea[];
      
      return {
        ...state,
        focusAreas: reorderedAreas
      };
    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [...state.categories, action.payload]
      };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(category =>
          category.id === action.payload.id ? action.payload : category
        )
      };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(category => category.id !== action.payload)
      };
    case 'LOAD_CATEGORIES':
      return {
        ...state,
        categories: action.payload
      };
    case 'UPDATE_USER_SETTINGS':
      return {
        ...state,
        userSettings: {
          ...state.userSettings,
          ...action.payload
        }
      };
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload
      };
    case 'LOAD_DATA':
      return {
        ...state,
        contentItems: action.payload.contentItems,
        seasons: action.payload.seasons,
        focusAreas: action.payload.focusAreas,
        userSettings: action.payload.userSettings,
        categories: action.payload.categories || state.categories,
        isLoading: false
      };
    default:
      return state;
  }
}

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // Load data from storage on initial render
  useEffect(() => {
    async function loadData() {
      try {
        // Load content items
        const contentItems = await StorageService.getContentItems();
        
        // Load seasons
        const seasons = await StorageService.getSeasons();
        
        // Load focus areas
        let focusAreas = await StorageService.getFocusAreas();
        
        // Check if focus areas need migration
        if (needsFocusAreaMigration(focusAreas)) {
          focusAreas = migrateFocusAreas(focusAreas);
          await StorageService.saveFocusAreas(focusAreas);
        }
        
        // Load user settings
        const userSettings = await StorageService.getUserSettings();
        
        // Load categories
        const categories = await StorageService.getCategories();
        
        // Load user birth date
        const userBirthDate = await StorageService.getUserBirthDate();
        if (userBirthDate) {
          dispatch({ type: 'SET_USER_BIRTH_DATE', payload: userBirthDate });
        }
        
        // Load theme
        const theme = await StorageService.getTheme();
        if (theme) {
          dispatch({ type: 'SET_THEME', payload: theme });
        }
        
        // Dispatch loaded data
        dispatch({ 
          type: 'LOAD_DATA', 
          payload: { 
            contentItems: contentItems || [], 
            seasons: seasons || [], 
            focusAreas: focusAreas || [],
            userSettings: userSettings || initialState.userSettings,
            categories: categories || DEFAULT_CATEGORIES
          } 
        });
      } catch (error) {
        console.error('Error loading data:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }
    
    loadData();
  }, []);
  
  // Save data to storage when state changes
  useEffect(() => {
    if (!state.isLoading) {
      StorageService.saveContentItems(state.contentItems);
      StorageService.saveSeasons(state.seasons);
      StorageService.saveFocusAreas(state.focusAreas);
      StorageService.saveUserSettings(state.userSettings);
      StorageService.saveCategories(state.categories);
      
      if (state.userBirthDate) {
        StorageService.saveUserBirthDate(state.userBirthDate);
      }
      
      StorageService.saveTheme(state.theme);
    }
  }, [state]);
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook for using the app context
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

// Export the provider as default to satisfy Expo Router
export default AppProvider; 