import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { ContentItem } from '../types';
import { useContentManagement } from '../hooks/useContentManagement';
import { useAppContext } from '../context/AppContext';

export default function ContentViewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const { contentItems } = useAppContext().state;
  
  const [contentItem, setContentItem] = useState<ContentItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (params.id) {
      setIsLoading(true);
      
      // Find the content item with the given ID
      const foundItem = contentItems.find((item: ContentItem) => item.id === params.id) || null;
      
      setContentItem(foundItem);
      setIsLoading(false);
    }
  }, [params.id, contentItems]);
  
  const handleGoBack = () => {
    router.back();
  };
  
  const handleEdit = () => {
    // Navigate to the edit screen
    if (contentItem) {
      router.push({
        pathname: `/content/${contentItem.type}`,
        params: { id: contentItem.id, edit: 'true' }
      });
    }
  };
  
  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'memory':
        return 'image-outline';
      case 'lesson':
        return 'bulb-outline';
      case 'goal':
        return 'flag-outline';
      case 'reflection':
        return 'journal-outline';
      default:
        return 'document-outline';
    }
  };
  
  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'memory':
        return '#4A90E2';
      case 'lesson':
        return '#50E3C2';
      case 'goal':
        return '#F5A623';
      case 'reflection':
        return '#9013FE';
      default:
        return '#999';
    }
  };
  
  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </SafeAreaView>
    );
  }
  
  if (!contentItem) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Content not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
  
  const formattedDate = new Date(contentItem.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#333" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
          <Ionicons name="create-outline" size={24} color="#4A90E2" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.contentHeader}>
          <View style={[styles.typeTag, { backgroundColor: getContentTypeColor(contentItem.type) }]}>
            <Ionicons name={getContentTypeIcon(contentItem.type)} size={16} color="#fff" />
            <Text style={styles.typeText}>{contentItem.type.charAt(0).toUpperCase() + contentItem.type.slice(1)}</Text>
          </View>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
        
        <View style={styles.titleContainer}>
          {contentItem.emoji && (
            <Text style={styles.emoji}>{contentItem.emoji}</Text>
          )}
          <Text style={styles.title}>{contentItem.title}</Text>
        </View>
        
        {contentItem.notes && (
          <Text style={styles.notes}>{contentItem.notes}</Text>
        )}
        
        {contentItem.media && contentItem.media.length > 0 && (
          <View style={styles.mediaContainer}>
            {contentItem.media.map((mediaUrl, index) => (
              <Image
                key={index}
                source={{ uri: mediaUrl }}
                style={styles.mediaImage}
                resizeMode="cover"
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#FF3B30',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 4,
  },
  editButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  typeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  typeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  titleContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  notes: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 20,
  },
  mediaContainer: {
    marginTop: 20,
  },
  mediaImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
}); 