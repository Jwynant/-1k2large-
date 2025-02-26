import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Pressable, 
  SafeAreaView 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useContentManagement } from '../hooks/useContentManagement';
import { useDateCalculations } from '../hooks/useDateCalculations';
import { ContentItem } from '../context/AppContext';

export default function ContentViewScreen() {
  const router = useRouter();
  const { getCellContent } = useContentManagement();
  const { formatDate } = useDateCalculations();
  const [content, setContent] = useState<ContentItem | null>(null);
  
  const params = useLocalSearchParams<{ 
    year: string;
    month?: string;
    week?: string;
    id: string;
  }>();
  
  // Parse parameters
  const selectedCell = {
    year: parseInt(params.year || '0', 10),
    month: params.month ? parseInt(params.month, 10) : undefined,
    week: params.week ? parseInt(params.week, 10) : undefined,
  };
  
  const contentId = params.id;
  
  // Load content on mount
  useEffect(() => {
    if (selectedCell.year > 0 && contentId) {
      const cellContent = getCellContent(
        selectedCell.year, 
        selectedCell.month, 
        selectedCell.week
      );
      
      const foundContent = cellContent.find(item => item.id === contentId);
      if (foundContent) {
        setContent(foundContent);
      }
    }
  }, [selectedCell, contentId, getCellContent]);
  
  // Get content type details
  const getContentTypeDetails = (type: string) => {
    switch (type) {
      case 'memory':
        return {
          title: 'Memory',
          icon: 'camera',
          color: '#4A90E2',
        };
      case 'lesson':
        return {
          title: 'Lesson',
          icon: 'school',
          color: '#50C878',
        };
      case 'goal':
        return {
          title: 'Goal',
          icon: 'flag',
          color: '#FF9500',
        };
      case 'reflection':
        return {
          title: 'Reflection',
          icon: 'sparkles',
          color: '#9B59B6',
        };
      default:
        return {
          title: 'Content',
          icon: 'document',
          color: '#999',
        };
    }
  };
  
  if (!content) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Content</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Content not found</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  const contentDetails = getContentTypeDetails(content.type);
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </Pressable>
        <Text style={styles.headerTitle}>{contentDetails.title}</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{content.title}</Text>
            {content.emoji && (
              <Text style={styles.emoji}>{content.emoji}</Text>
            )}
          </View>
          
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.date}>{formatDate(content.date)}</Text>
          </View>
          
          <View style={[styles.typeBadge, { backgroundColor: contentDetails.color }]}>
            <Ionicons name={contentDetails.icon as any} size={14} color="#fff" />
            <Text style={styles.typeText}>{contentDetails.title}</Text>
          </View>
          
          {content.notes && (
            <View style={styles.notesContainer}>
              <Text style={styles.notes}>{content.notes}</Text>
            </View>
          )}
          
          {content.media && content.media.length > 0 && (
            <View style={styles.mediaContainer}>
              <Text style={styles.sectionTitle}>Media</Text>
              <Text style={styles.mediaPlaceholder}>
                Media attachments will be displayed here
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    flex: 1,
  },
  emoji: {
    fontSize: 32,
    marginLeft: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 20,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 4,
  },
  notesContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  notes: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  mediaContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  mediaPlaceholder: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
}); 