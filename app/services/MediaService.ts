import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform } from 'react-native';
import { v4 as uuidv4 } from 'uuid';

// Media directory in app's file system
const MEDIA_DIRECTORY = `${FileSystem.documentDirectory}media/`;

// Media types
export type MediaType = 'photo' | 'video';

// Media item interface
export interface MediaItem {
  uri: string;
  type: MediaType;
  width?: number;
  height?: number;
  fileSize?: number;
}

// Media service class
export class MediaService {
  // Initialize media directory
  static async initialize(): Promise<void> {
    try {
      const dirInfo = await FileSystem.getInfoAsync(MEDIA_DIRECTORY);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(MEDIA_DIRECTORY, { intermediates: true });
        console.log('Created media directory');
      }
    } catch (error) {
      console.error('Error initializing media directory:', error);
    }
  }

  // Request media library permissions
  static async requestMediaLibraryPermissions(): Promise<boolean> {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
  }

  // Request camera permissions
  static async requestCameraPermissions(): Promise<boolean> {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === 'granted';
  }

  // Pick image from library
  static async pickImage(options: {
    allowsMultipleSelection?: boolean;
    maxSelection?: number;
    allowsEditing?: boolean;
  } = {}): Promise<MediaItem[]> {
    const { 
      allowsMultipleSelection = false, 
      maxSelection = 10,
      allowsEditing = true 
    } = options;

    // Request permissions
    if (!await this.requestMediaLibraryPermissions()) {
      Alert.alert(
        'Permission Required', 
        'Please allow access to your photo library to add photos.'
      );
      return [];
    }

    try {
      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: allowsMultipleSelection ? false : allowsEditing,
        allowsMultipleSelection,
        selectionLimit: maxSelection,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return [];
      }

      // Process and save selected images
      const mediaItems: MediaItem[] = [];
      for (const asset of result.assets) {
        const optimizedImage = await this.optimizeImage(asset.uri);
        const savedUri = await this.saveImageToLocalStorage(optimizedImage);
        
        mediaItems.push({
          uri: savedUri,
          type: 'photo',
          width: asset.width,
          height: asset.height,
        });
      }

      return mediaItems;
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to add photo. Please try again.');
      return [];
    }
  }

  // Take photo with camera
  static async takePhoto(): Promise<MediaItem | null> {
    // Request permissions
    if (!await this.requestCameraPermissions()) {
      Alert.alert(
        'Permission Required', 
        'Please allow access to your camera to take photos.'
      );
      return null;
    }

    try {
      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return null;
      }

      // Process and save captured image
      const asset = result.assets[0];
      const optimizedImage = await this.optimizeImage(asset.uri);
      const savedUri = await this.saveImageToLocalStorage(optimizedImage);
      
      return {
        uri: savedUri,
        type: 'photo',
        width: asset.width,
        height: asset.height,
      };
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
      return null;
    }
  }

  // Optimize image (resize and compress)
  static async optimizeImage(uri: string): Promise<string> {
    try {
      // Get image info
      const fileInfo = await FileSystem.getInfoAsync(uri);
      
      // Skip optimization for small images
      if (fileInfo.size && fileInfo.size < 300 * 1024) { // Less than 300KB
        return uri;
      }

      // Resize and compress image
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1200 } }], // Resize to max width of 1200px
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      return result.uri;
    } catch (error) {
      console.error('Error optimizing image:', error);
      return uri; // Return original if optimization fails
    }
  }

  // Save image to local storage
  static async saveImageToLocalStorage(uri: string): Promise<string> {
    await this.initialize();
    
    const fileName = `${uuidv4()}.jpg`;
    const destinationUri = `${MEDIA_DIRECTORY}${fileName}`;
    
    try {
      await FileSystem.copyAsync({
        from: uri,
        to: destinationUri,
      });
      
      console.log(`Saved image to ${destinationUri}`);
      return destinationUri;
    } catch (error) {
      console.error('Error saving image:', error);
      return uri; // Return original if saving fails
    }
  }

  // Delete image from local storage
  static async deleteImage(uri: string): Promise<boolean> {
    try {
      // Only delete if it's in our media directory
      if (uri.startsWith(MEDIA_DIRECTORY)) {
        await FileSystem.deleteAsync(uri);
        console.log(`Deleted image: ${uri}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  }

  // Get image info
  static async getImageInfo(uri: string): Promise<FileSystem.FileInfo> {
    try {
      return await FileSystem.getInfoAsync(uri, { size: true });
    } catch (error) {
      console.error('Error getting image info:', error);
      return { exists: false, isDirectory: false, uri };
    }
  }

  // Clean up unused media files
  static async cleanupUnusedMedia(usedUris: string[]): Promise<void> {
    try {
      const dirInfo = await FileSystem.getInfoAsync(MEDIA_DIRECTORY);
      if (!dirInfo.exists || !dirInfo.isDirectory) {
        return;
      }

      const files = await FileSystem.readDirectoryAsync(MEDIA_DIRECTORY);
      
      for (const file of files) {
        const fileUri = `${MEDIA_DIRECTORY}${file}`;
        if (!usedUris.includes(fileUri)) {
          await FileSystem.deleteAsync(fileUri);
          console.log(`Deleted unused media file: ${fileUri}`);
        }
      }
    } catch (error) {
      console.error('Error cleaning up unused media:', error);
    }
  }
} 