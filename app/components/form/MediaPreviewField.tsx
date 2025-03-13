import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  Modal,
  Dimensions,
  SafeAreaView,
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
  const [viewerVisible, setViewerVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  if (media.length === 0) {
    return null;
  }
  
  const handleViewImage = (index: number) => {
    setSelectedIndex(index);
    setViewerVisible(true);
  };
  
  return (
    <View style={styles.container}>
      <Text style={[
        styles.label,
        isDarkMode ? styles.darkLabel : styles.lightLabel
      ]}>
        Photos ({media.length})
      </Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.mediaScrollContent}
      >
        {media.map((uri, index) => (
          <View key={index} style={styles.mediaContainer}>
            <TouchableOpacity
              onPress={() => handleViewImage(index)}
              accessibilityLabel={`View photo ${index + 1}`}
            >
              <Image 
                source={{ uri }} 
                style={styles.mediaPreview} 
                resizeMode="cover"
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={() => onRemoveMedia(index)}
              accessibilityLabel={`Remove photo ${index + 1}`}
            >
              <Ionicons name="close-circle" size={24} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      
      {/* Full-screen image viewer */}
      <Modal
        visible={viewerVisible}
        transparent={true}
        onRequestClose={() => setViewerVisible(false)}
      >
        <SafeAreaView style={styles.viewerContainer}>
          <View style={styles.viewerHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setViewerVisible(false)}
              accessibilityLabel="Close image viewer"
            >
              <Ionicons name="close" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentOffset={{ x: selectedIndex * width, y: 0 }}
          >
            {media.map((uri, index) => (
              <View key={index} style={styles.fullImageContainer}>
                <Image
                  source={{ uri }}
                  style={styles.fullImage}
                  resizeMode="contain"
                />
              </View>
            ))}
          </ScrollView>
          
          <View style={styles.viewerFooter}>
            <Text style={styles.imageCounter}>
              {selectedIndex + 1} / {media.length}
            </Text>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const { width, height } = Dimensions.get('window');
const imageSize = width / 3 - 16;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  darkLabel: {
    color: '#FFFFFF',
  },
  lightLabel: {
    color: '#000000',
  },
  mediaScrollContent: {
    paddingVertical: 8,
  },
  mediaContainer: {
    position: 'relative',
    marginRight: 12,
  },
  mediaPreview: {
    width: imageSize,
    height: imageSize,
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
  viewerContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  viewerHeader: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  closeButton: {
    padding: 8,
  },
  fullImageContainer: {
    width,
    height: height - 120, // Account for header and footer
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: width,
    height: height - 120,
  },
  viewerFooter: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageCounter: {
    color: '#FFFFFF',
    fontSize: 16,
  },
}); 