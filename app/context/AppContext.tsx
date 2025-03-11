import React, { createContext, useContext, useReducer, ReactNode, useEffect, useRef } from 'react';
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
      console.log('AppContext - ADD_CONTENT_ITEM action received:', action.payload.id);
      console.log('AppContext - Current contentItems count:', state.contentItems.length);
      const newState = { 
        ...state, 
        contentItems: [...state.contentItems, action.payload] 
      };
      console.log('AppContext - New contentItems count:', newState.contentItems.length);
      return newState;
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
    case 'INITIALIZE_APP':
      return {
        ...state,
        ...action.payload,
        isLoading: false
      };
    default:
      return state;
  }
}

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevStateRef = useRef<AppState>(initialState);
  
  // Load data from storage on initial render - optimized to load in parallel
  useEffect(() => {
    async function loadData() {
      try {
        console.log('Loading app data...');
        
        // Load all data in parallel for better performance
        const [
          contentItems,
          seasons,
          focusAreas,
          userSettings,
          categories,
          userBirthDate,
          theme
        ] = await Promise.all([
          StorageService.getContentItems(),
          StorageService.getSeasons(),
          StorageService.getFocusAreas(),
          StorageService.getUserSettings(),
          StorageService.getCategories(),
          StorageService.getUserBirthDate(),
          StorageService.getTheme()
        ]);
        
        // Process focus areas if needed
        let processedFocusAreas = focusAreas;
        if (needsFocusAreaMigration(focusAreas)) {
          processedFocusAreas = migrateFocusAreas(focusAreas);
          await StorageService.saveFocusAreas(processedFocusAreas);
        }
        
        // Batch all state updates into a single dispatch
        dispatch({ 
          type: 'INITIALIZE_APP', 
          payload: { 
            contentItems: contentItems || [], 
            seasons: seasons || [], 
            focusAreas: processedFocusAreas || [],
            userSettings: userSettings || initialState.userSettings,
            categories: categories || DEFAULT_CATEGORIES,
            userBirthDate: userBirthDate || null,
            theme: theme || 'dark'
          } 
        });
        
        console.log('App data loaded successfully');
      } catch (error) {
        console.error('Error loading data:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }
    
    loadData();
  }, []);
  
  // Save data to storage when state changes, with debounce and change detection
  useEffect(() => {
    if (state.isLoading) return;
    
    // Clear any existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Set a new timeout to save data after a delay
    saveTimeoutRef.current = setTimeout(async () => {
      const prevState = prevStateRef.current;
      const savePromises = [];
      
      // Only save data that has actually changed
      if (JSON.stringify(prevState.contentItems) !== JSON.stringify(state.contentItems)) {
        savePromises.push(StorageService.saveContentItems(state.contentItems));
      }
      
      if (JSON.stringify(prevState.seasons) !== JSON.stringify(state.seasons)) {
        savePromises.push(StorageService.saveSeasons(state.seasons));
      }
      
      if (JSON.stringify(prevState.focusAreas) !== JSON.stringify(state.focusAreas)) {
        savePromises.push(StorageService.saveFocusAreas(state.focusAreas));
      }
      
      if (JSON.stringify(prevState.userSettings) !== JSON.stringify(state.userSettings)) {
        savePromises.push(StorageService.saveUserSettings(state.userSettings));
      }
      
      if (JSON.stringify(prevState.categories) !== JSON.stringify(state.categories)) {
        savePromises.push(StorageService.saveCategories(state.categories));
      }
      
      if (prevState.userBirthDate !== state.userBirthDate && state.userBirthDate) {
        savePromises.push(StorageService.saveUserBirthDate(state.userBirthDate));
      }
      
      if (prevState.theme !== state.theme) {
        savePromises.push(StorageService.saveTheme(state.theme));
      }
      
      // Only log and execute if there are changes to save
      if (savePromises.length > 0) {
        console.log(`Saving ${savePromises.length} changed data items to storage...`);
        
        try {
          await Promise.all(savePromises);
          console.log('App state saved successfully');
        } catch (error) {
          console.error('Error saving app state:', error);
        }
      }
      
      // Update the previous state reference
      prevStateRef.current = { ...state };
    }, 500); // 500ms debounce
    
    // Cleanup function to clear the timeout if the component unmounts
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
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