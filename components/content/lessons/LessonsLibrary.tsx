import React, { useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  FlatList, 
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ContentItem } from '../../../app/types';
import { useContentManagement } from '../../../app/hooks/useContentManagement';
import LessonCard from './LessonCard';

type LessonsLibraryProps = {
  onAddLesson?: () => void;
  isExpanded?: boolean;
};

export default function LessonsLibrary({ onAddLesson, isExpanded = false }: LessonsLibraryProps) {
  const router = useRouter();
  const { getLessons, getFavoriteLessons, deleteContentItem } = useContentManagement();
  
  // Get all lessons
  const allLessons = getLessons();
  
  // Get favorite lessons
  const favoriteLessons = getFavoriteLessons();
  
  // Get non-favorite lessons
  const regularLessons = allLessons.filter(lesson => !lesson.isFavorite);
  
  // Handle lesson press
  const handleLessonPress = useCallback((lesson: ContentItem) => {
    // For now, just edit the lesson since we don't have a detail view yet
    handleEditLesson(lesson);
  }, [router]);
  
  // Handle edit lesson
  const handleEditLesson = useCallback((lesson: ContentItem) => {
    // We'll need to create these routes later
    // For now, just log the action
    console.log('Edit lesson:', lesson.id);
    // TODO: Implement lesson edit navigation when routes are available
  }, []);
  
  // Handle delete lesson
  const handleDeleteLesson = useCallback((lesson: ContentItem) => {
    Alert.alert(
      'Delete Lesson',
      `Are you sure you want to delete "${lesson.title}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteContentItem(lesson.id);
          }
        }
      ]
    );
  }, [deleteContentItem]);
  
  // Render a lesson item
  const renderLessonItem = useCallback(({ item }: { item: ContentItem }) => {
    return (
      <LessonCard
        lesson={item}
        onPress={() => handleLessonPress(item)}
        onEdit={() => handleEditLesson(item)}
        onDelete={() => handleDeleteLesson(item)}
      />
    );
  }, [handleLessonPress, handleEditLesson, handleDeleteLesson]);
  
  // Render the empty state
  const renderEmptyState = () => {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="school-outline" size={48} color="#8E8E93" />
        <Text style={styles.emptyTitle}>No Lessons Yet</Text>
        <Text style={styles.emptyText}>
          Add lessons to keep track of what you've learned and want to remember.
        </Text>
        <Pressable 
          style={styles.addButton}
          onPress={onAddLesson}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Lesson</Text>
        </Pressable>
      </View>
    );
  };
  
  // If there are no lessons, show the empty state
  if (allLessons.length === 0) {
    return renderEmptyState();
  }
  
  // Render the "Add Lesson" button for when there are no regular lessons
  const renderAddLessonButton = () => {
    return (
      <Pressable 
        style={styles.addLessonButtonContainer}
        onPress={onAddLesson}
      >
        <Ionicons name="add-circle-outline" size={20} color="#FFCC00" />
        <Text style={styles.addLessonButtonText}>Add Lesson</Text>
      </Pressable>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Favorites Section */}
        {favoriteLessons.length > 0 && (
          <View style={styles.favoritesSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="star" size={16} color="#FF9500" />
              <Text style={styles.sectionTitle}>Favorites</Text>
            </View>
            
            <FlatList
              data={favoriteLessons}
              renderItem={renderLessonItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
              contentContainerStyle={styles.listContent}
            />
          </View>
        )}
        
        {/* Regular Lessons Section */}
        {regularLessons.length > 0 && (isExpanded || favoriteLessons.length === 0) ? (
          <View style={styles.regularSection}>
            {favoriteLessons.length > 0 && (
              <View style={styles.divider} />
            )}
            
            <FlatList
              data={regularLessons}
              renderItem={renderLessonItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
              contentContainerStyle={styles.listContent}
            />
          </View>
        ) : regularLessons.length > 0 && !isExpanded ? (
          <View style={styles.collapsedFooter}>
            <Text style={styles.collapsedText}>
              {regularLessons.length} more {regularLessons.length === 1 ? 'lesson' : 'lessons'}
            </Text>
          </View>
        ) : (
          <View style={styles.noRegularLessons}>
            {renderAddLessonButton()}
          </View>
        )}
        
        {/* Add Lesson Button (always visible in the corner) */}
        <Pressable 
          style={styles.floatingAddButton}
          onPress={onAddLesson}
        >
          <Ionicons name="add" size={22} color="#FFCC00" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  content: {
    position: 'relative',
    paddingBottom: 8,
  },
  favoritesSection: {
    backgroundColor: 'rgba(28, 28, 30, 0.6)',
    borderRadius: 8,
    marginBottom: 8,
    paddingBottom: 8,
  },
  regularSection: {
    paddingTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 6,
    opacity: 0.8,
  },
  listContent: {
    paddingHorizontal: 12,
  },
  itemSeparator: {
    height: 1,
    backgroundColor: 'rgba(142, 142, 147, 0.1)',
    marginVertical: 8,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(142, 142, 147, 0.2)',
    marginVertical: 8,
    marginHorizontal: 12,
  },
  floatingAddButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 204, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  collapsedFooter: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  collapsedText: {
    fontSize: 14,
    color: '#8E8E93',
    fontStyle: 'italic',
  },
  noRegularLessons: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  addLessonButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 204, 0, 0.1)',
  },
  addLessonButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFCC00',
    marginLeft: 6,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(28, 28, 30, 0.4)',
    borderRadius: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 24,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFCC00',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
}); 