import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  useColorScheme,
  Alert
} from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { useIcons } from '../shared/IconProvider';

interface MediaUploadFieldProps {
  label: string;
  onAddMedia: (uri: string) => void;
  mediaCount: number;
  required?: boolean;
}

export default function MediaUploadField({ 
  label, 
  onAddMedia,
  mediaCount,
  required = false
}: MediaUploadFieldProps) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const { Icon } = useIcons();
  
  const handleAddMedia = async () => {
    try {
      // Request permission to access the photo library
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow access to your photo library to add photos.');
        return;
      }
      
      // Launch the image picker with optimized settings
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8, // Reduced quality for better performance
        allowsMultipleSelection: false, // Ensure single selection for better UX
        exif: false, // Don't need EXIF data, reduces memory usage
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Add the selected image to the form state
        onAddMedia(result.assets[0].uri);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to add photo. Please try again.');
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
      
      <TouchableOpacity 
        style={[
          styles.uploadButton,
          isDarkMode ? styles.darkUploadButton : styles.lightUploadButton
        ]}
        onPress={handleAddMedia}
      >
        <Icon 
          name="camera" 
          size={24} 
          color={isDarkMode ? "#FFFFFF" : "#000000"} 
          style={styles.uploadIcon}
        />
        <Text style={[
          styles.uploadText,
          isDarkMode ? styles.darkUploadText : styles.lightUploadText
        ]}>
          Choose from Library
        </Text>
      </TouchableOpacity>
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