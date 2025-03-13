import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  useColorScheme
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MediaPreviewFieldProps {
  media: string[];
  onRemoveMedia: (index: number) => void;
}

export default function MediaPreviewField({ 
  media, 
  onRemoveMedia 
}: MediaPreviewFieldProps) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  if (media.length === 0) {
    return null;
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Photos ({media.length})</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.mediaScrollContent}
      >
        {media.map((uri, index) => (
          <View key={index} style={styles.mediaContainer}>
            <Image 
              source={{ uri }} 
              style={styles.mediaPreview} 
              resizeMode="cover"
            />
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={() => onRemoveMedia(index)}
            >
              <Ionicons name="close-circle" size={24} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  mediaScrollContent: {
    paddingVertical: 8,
  },
  mediaContainer: {
    position: 'relative',
    marginRight: 12,
  },
  mediaPreview: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#3A3A3C',
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 0,
  },
}); 