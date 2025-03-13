import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Pressable, 
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ContentItem, SelectedCell } from '../../../app/types';
import { useContentManagement } from '../../../app/hooks/useContentManagement';
import LessonCard from './LessonCard';

type CellLessonsViewProps = {
  selectedCell: SelectedCell;
  onAddLesson?: () => void;
};

export default function CellLessonsView({ selectedCell, onAddLesson }: CellLessonsViewProps) {
  const { getCellContent, deleteContentItem } = useContentManagement();
  
  // Get lessons for this cell
  const cellContent = getCellContent(
    selectedCell.year, 
    selectedCell.month, 
    selectedCell.week
  );
  
  // Filter to only lessons
  const lessons = cellContent.filter(item => item.type === 'lesson');
  
  // Handle edit lesson
  const handleEditLesson = (lesson: ContentItem) => {
    // For now, just log the action
    console.log('Edit lesson:', lesson.id);
    // TODO: Implement lesson edit navigation when routes are available
  };
  
  // Handle delete lesson
  const handleDeleteLesson = (lesson: ContentItem) => {
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
  };
  
  // Render a lesson item
  const renderLessonItem = ({ item }: { item: ContentItem }) => {
    return (
      <LessonCard
        lesson={item}
        onPress={() => handleEditLesson(item)}
        onEdit={() => handleEditLesson(item)}
        onDelete={() => handleDeleteLesson(item)}
      />
    );
  };
  
  // Render empty state
  const renderEmptyState = () => {
    // Get timeframe string for display
    const getTimeframeString = () => {
      if (selectedCell.month !== undefined) {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                            'July', 'August', 'September', 'October', 'November', 'December'];
        return `${monthNames[selectedCell.month]} ${selectedCell.year}`;
      } else if (selectedCell.week !== undefined) {
        return `Week ${selectedCell.week + 1}, ${selectedCell.year}`;
      } else {
        return `${selectedCell.year}`;
      }
    };
    
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="school-outline" size={48} color="#8E8E93" />
        <Text style={styles.emptyTitle}>No Lessons Yet</Text>
        <Text style={styles.emptyText}>
          Add lessons to keep track of what you've learned during {getTimeframeString()}.
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
  
  // Item separator component
  const ItemSeparator = () => <View style={styles.itemSeparator} />;
  
  return (
    <View style={styles.container}>
      {lessons.length > 0 ? (
        <FlatList
          data={lessons}
          renderItem={renderLessonItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={ItemSeparator}
          ListHeaderComponent={
            <View style={styles.header}>
              <View style={styles.headerTitleContainer}>
                <Ionicons name="school" size={18} color="#FFCC00" />
                <Text style={styles.headerTitle}>Lessons</Text>
              </View>
              <Pressable 
                style={styles.addIconButton}
                onPress={onAddLesson}
                hitSlop={8}
              >
                <Ionicons name="add-circle" size={24} color="#FFCC00" />
              </Pressable>
            </View>
          }
        />
      ) : (
        renderEmptyState()
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  listContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(142, 142, 147, 0.2)',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  itemSeparator: {
    height: 1,
    backgroundColor: 'rgba(142, 142, 147, 0.1)',
    marginVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: 'rgba(28, 28, 30, 0.4)',
    borderRadius: 12,
    margin: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
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
  addIconButton: {
    padding: 4,
  },
}); 