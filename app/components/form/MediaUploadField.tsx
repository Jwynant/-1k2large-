import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  useColorScheme,
  Image,
  ScrollView,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

interface MediaUploadFieldProps {
  label: string;
  onAddMedia: (uri: string) => void;
  onRemoveMedia?: (index: number) => void;
  mediaItems?: string[];
  mediaCount?: number;
  required?: boolean;
}

export default function MediaUploadField({ 
  label, 
  onAddMedia,
  onRemoveMedia,
  mediaItems = [],
  mediaCount,
  required = false
}: MediaUploadFieldProps) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const screenWidth = Dimensions.get('window').width;
  const imageSize = (screenWidth - 64) / 3; // 3 images per row with padding
  
  // Calculate media count
  const count = mediaItems?.length || mediaCount || 0;
  
  // Handle media upload
  const handleAddMedia = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }
    
    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      onAddMedia(result.assets[0].uri);
    }
  };
  
  // Handle remove media
  const handleRemoveMedia = (index: number) => {
    if (onRemoveMedia) {
      onRemoveMedia(index);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={[
          styles.label,
          isDarkMode ? styles.lightText : styles.darkText
        ]}>
          {label}
          {required && <Text style={styles.requiredStar}>*</Text>}
        </Text>
      </View>
      
      {/* Media preview */}
      {count > 0 && mediaItems && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.mediaPreviewContainer}
          contentContainerStyle={styles.mediaPreviewContent}
        >
          {mediaItems.map((uri, index) => (
            <View key={index} style={styles.mediaItem}>
              <Image 
                source={{ uri }} 
                style={[styles.mediaPreview, { width: imageSize, height: imageSize }]} 
              />
              {onRemoveMedia && (
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => handleRemoveMedia(index)}
                >
                  <Ionicons name="close-circle" size={24} color="#FF453A" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>
      )}
      
      <TouchableOpacity
        style={[
          styles.uploadButton,
          isDarkMode ? styles.darkUploadButton : styles.lightUploadButton
        ]}
        onPress={handleAddMedia}
      >
        <Ionicons 
          name="camera" 
          size={24} 
          color={isDarkMode ? '#FFFFFF' : '#000000'} 
        />
        <Text style={[
          styles.uploadText,
          isDarkMode ? styles.lightText : styles.darkText
        ]}>
          {count > 0 
            ? `${count} photo${count !== 1 ? 's' : ''} added - Add more` 
            : 'Add photos'}
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
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  lightText: {
    color: '#FFFFFF',
  },
  darkText: {
    color: '#000000',
  },
  requiredStar: {
    color: '#FF453A',
    marginLeft: 4,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  darkUploadButton: {
    backgroundColor: '#2C2C2E',
    borderColor: '#3A3A3C',
  },
  lightUploadButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D1D1D6',
  },
  uploadText: {
    fontSize: 16,
    marginLeft: 8,
  },
  mediaPreviewContainer: {
    marginBottom: 12,
  },
  mediaPreviewContent: {
    paddingBottom: 8,
  },
  mediaItem: {
    marginRight: 8,
    position: 'relative',
  },
  mediaPreview: {
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
  },
}); 