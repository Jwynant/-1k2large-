import AsyncStorage from '@react-native-async-storage/async-storage';
import { ContentItem, Season } from '../context/AppContext';

// Storage keys
const STORAGE_KEYS = {
  CONTENT: '@1000Months:content',
  SEASONS: '@1000Months:seasons',
  USER_BIRTH_DATE: '@1000Months:userBirthDate',
  VIEW_MODE: '@1000Months:viewMode',
};

/**
 * Service for handling data persistence using AsyncStorage
 */
export class StorageService {
  /**
   * Save content data to AsyncStorage
   */
  static async saveContent(content: Record<string, ContentItem[]>): Promise<void> {
    try {
      const jsonValue = JSON.stringify(content);
      await AsyncStorage.setItem(STORAGE_KEYS.CONTENT, jsonValue);
    } catch (error) {
      console.error('Error saving content:', error);
    }
  }

  /**
   * Load content data from AsyncStorage
   */
  static async loadContent(): Promise<Record<string, ContentItem[]> | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.CONTENT);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error loading content:', error);
      return null;
    }
  }

  /**
   * Save seasons data to AsyncStorage
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
   * Load seasons data from AsyncStorage
   */
  static async loadSeasons(): Promise<Season[] | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.SEASONS);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error loading seasons:', error);
      return null;
    }
  }

  /**
   * Save user birth date to AsyncStorage
   */
  static async saveUserBirthDate(birthDate: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_BIRTH_DATE, birthDate);
    } catch (error) {
      console.error('Error saving user birth date:', error);
    }
  }

  /**
   * Load user birth date from AsyncStorage
   */
  static async loadUserBirthDate(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.USER_BIRTH_DATE);
    } catch (error) {
      console.error('Error loading user birth date:', error);
      return null;
    }
  }

  /**
   * Save view mode to AsyncStorage
   */
  static async saveViewMode(viewMode: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.VIEW_MODE, viewMode);
    } catch (error) {
      console.error('Error saving view mode:', error);
    }
  }

  /**
   * Load view mode from AsyncStorage
   */
  static async loadViewMode(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.VIEW_MODE);
    } catch (error) {
      console.error('Error loading view mode:', error);
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