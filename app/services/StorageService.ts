import AsyncStorage from '@react-native-async-storage/async-storage';
import { ContentItem, Season, FocusArea, UserSettings, Category } from '../types';

// Storage keys
const STORAGE_KEYS = {
  USER_DATA: '@1000Months:userData',
  CONTENT_ITEMS: '@1000Months:contentItems',
  SEASONS: '@1000Months:seasons',
  FOCUS_AREAS: '@1000Months:focusAreas',
  USER_SETTINGS: '@1000Months:userSettings',
  CATEGORIES: '@1000Months:categories',
  USER_BIRTH_DATE: '@1000Months:userBirthDate',
  THEME: '@1000Months:theme',
};

// User data interface
interface UserData {
  userBirthDate?: string | null;
  accentColor?: string;
  contentItems?: ContentItem[];
  seasons?: Season[];
  focusAreas?: FocusArea[];
  categories?: Category[];
  userSettings?: UserSettings;
  theme?: 'dark' | 'light' | 'system';
}

/**
 * Service for handling data persistence using AsyncStorage
 */
export class StorageService {
  /**
   * Save all user data to AsyncStorage
   */
  static async saveUserData(userData: UserData): Promise<void> {
    try {
      const jsonValue = JSON.stringify(userData);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, jsonValue);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }

  /**
   * Load all user data from AsyncStorage
   */
  static async getUserData(): Promise<UserData | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error loading user data:', error);
      return null;
    }
  }

  /**
   * Save content items to AsyncStorage
   */
  static async saveContentItems(contentItems: ContentItem[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(contentItems);
      await AsyncStorage.setItem(STORAGE_KEYS.CONTENT_ITEMS, jsonValue);
    } catch (error) {
      console.error('Error saving content items:', error);
    }
  }

  /**
   * Load content items from AsyncStorage
   */
  static async getContentItems(): Promise<ContentItem[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.CONTENT_ITEMS);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error loading content items:', error);
      return [];
    }
  }

  /**
   * Save seasons to AsyncStorage
   */
  static async saveSeasons(seasons: Season[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(seasons);
      await AsyncStorage.setItem(STORAGE_KEYS.SEASONS, jsonValue);
    } catch (error) {
      console.error('Error saving seasons:', error);
    }
  }

  /**
   * Load seasons from AsyncStorage
   */
  static async getSeasons(): Promise<Season[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.SEASONS);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error loading seasons:', error);
      return [];
    }
  }

  /**
   * Save focus areas to AsyncStorage
   */
  static async saveFocusAreas(focusAreas: FocusArea[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(focusAreas);
      await AsyncStorage.setItem(STORAGE_KEYS.FOCUS_AREAS, jsonValue);
    } catch (error) {
      console.error('Error saving focus areas:', error);
    }
  }

  /**
   * Load focus areas from AsyncStorage
   */
  static async getFocusAreas(): Promise<FocusArea[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.FOCUS_AREAS);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error loading focus areas:', error);
      return [];
    }
  }

  /**
   * Save user settings to AsyncStorage
   */
  static async saveUserSettings(userSettings: UserSettings): Promise<void> {
    try {
      const jsonValue = JSON.stringify(userSettings);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_SETTINGS, jsonValue);
    } catch (error) {
      console.error('Error saving user settings:', error);
    }
  }

  /**
   * Load user settings from AsyncStorage
   */
  static async getUserSettings(): Promise<UserSettings | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error loading user settings:', error);
      return null;
    }
  }

  /**
   * Save categories to AsyncStorage
   */
  static async saveCategories(categories: Category[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(categories);
      await AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, jsonValue);
    } catch (error) {
      console.error('Error saving categories:', error);
    }
  }

  /**
   * Load categories from AsyncStorage
   */
  static async getCategories(): Promise<Category[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error loading categories:', error);
      return [];
    }
  }

  /**
   * Save user birth date to AsyncStorage
   */
  static async saveUserBirthDate(userBirthDate: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_BIRTH_DATE, userBirthDate);
    } catch (error) {
      console.error('Error saving user birth date:', error);
    }
  }

  /**
   * Load user birth date from AsyncStorage
   */
  static async getUserBirthDate(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.USER_BIRTH_DATE);
    } catch (error) {
      console.error('Error loading user birth date:', error);
      return null;
    }
  }

  /**
   * Save theme to AsyncStorage
   */
  static async saveTheme(theme: 'dark' | 'light' | 'system'): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }

  /**
   * Load theme from AsyncStorage
   */
  static async getTheme(): Promise<'dark' | 'light' | 'system' | null> {
    try {
      const theme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
      return theme as 'dark' | 'light' | 'system' | null;
    } catch (error) {
      console.error('Error loading theme:', error);
      return null;
    }
  }

  /**
   * Clear all app data from AsyncStorage
   */
  static async clearAllData(): Promise<void> {
    try {
      const keys = Object.values(STORAGE_KEYS);
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  }
}

// Default export for Expo Router compatibility
export default StorageService; 