import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  useColorScheme
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { MediaService } from '../../services/MediaService';

interface MediaUploadFieldProps {
  label: string;
  onAddMedia: (uri: string) => void;
  onAddMultipleMedia?: (uris: string[]) => void;
  mediaCount: number;
  required?: boolean;
  maxSelection?: number;
}

export default function MediaUploadField({ 
  label, 
  onAddMedia,
  onAddMultipleMedia,
  mediaCount,
  required = false,
  maxSelection = 10
}: MediaUploadFieldProps) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  const handlePickImage = async () => {
    try {
      // Use the MediaService to pick images
      const mediaItems = await MediaService.pickImage({
        allowsMultipleSelection: !!onAddMultipleMedia,
        maxSelection,
        allowsEditing: !onAddMultipleMedia,
      });
      
      if (mediaItems.length === 0) {
        return;
      }
      
      // Handle single or multiple selection
      if (mediaItems.length === 1) {
        onAddMedia(mediaItems[0].uri);
      } else if (onAddMultipleMedia) {
        onAddMultipleMedia(mediaItems.map(item => item.uri));
      }
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to add photo. Please try again.');
    }
  };
  
  const handleTakePhoto = async () => {
    try {
      // Use the MediaService to take a photo
      const mediaItem = await MediaService.takePhoto();
      
      if (!mediaItem) {
        return;
      }
      
      onAddMedia(mediaItem.uri);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={[
          styles.label,
          isDarkMode ? styles.darkLabel : styles.lightLabel
        ]}>
          {label}
          {required && <Text style={styles.requiredStar}>*</Text>}
        </Text>
        {mediaCount > 0 && (
          <Text style={styles.mediaCount}>
            {mediaCount} {mediaCount === 1 ? 'photo' : 'photos'} added
          </Text>
        )}
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[
            styles.uploadButton,
            isDarkMode ? styles.darkUploadButton : styles.lightUploadButton
          ]}
          onPress={handlePickImage}
          accessibilityLabel="Choose photos from library"
        >
          <Ionicons 
            name="images" 
            size={24} 
            color={isDarkMode ? "#FFFFFF" : "#000000"} 
            style={styles.uploadIcon}
          />
          <Text style={[
            styles.uploadText,
            isDarkMode ? styles.darkUploadText : styles.lightUploadText
          ]}>
            {onAddMultipleMedia ? 'Choose Multiple Photos' : 'Choose from Library'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.uploadButton,
            isDarkMode ? styles.darkUploadButton : styles.lightUploadButton,
            { marginTop: 8 }
          ]}
          onPress={handleTakePhoto}
          accessibilityLabel="Take a photo with camera"
        >
          <Ionicons 
            name="camera" 
            size={24} 
            color={isDarkMode ? "#FFFFFF" : "#000000"} 
            style={styles.uploadIcon}
          />
          <Text style={[
            styles.uploadText,
            isDarkMode ? styles.darkUploadText : styles.lightUploadText
          ]}>
            Take Photo
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  darkLabel: {
    color: '#FFFFFF',
  },
  lightLabel: {
    color: '#000000',
  },
  requiredStar: {
    color: '#FF3B30',
    marginLeft: 4,
  },
  mediaCount: {
    fontSize: 14,
    color: '#8E8E93',
  },
  buttonContainer: {
    flexDirection: 'column',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  darkUploadButton: {
    backgroundColor: '#2C2C2E',
    borderColor: '#3A3A3C',
  },
  lightUploadButton: {
    backgroundColor: '#F2F2F7',
    borderColor: '#C7C7CC',
  },
  uploadIcon: {
    marginRight: 8,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '500',
  },
  darkUploadText: {
    color: '#FFFFFF',
  },
  lightUploadText: {
    color: '#000000',
  },
}); 