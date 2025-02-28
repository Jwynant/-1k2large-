import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';
import { ContentItem, SelectedCell } from '../../app/types';
import { useContentManagement } from '../../app/hooks/useContentManagement';
import { useDateCalculations } from '../../app/hooks/useDateCalculations';

interface CellDetailViewProps {
  selectedCell: SelectedCell | null;
  onClose: () => void;
}

// Group content by type for better organization
interface GroupedContent {
  memories: ContentItem[];
  lessons: ContentItem[];
  goals: ContentItem[];
  reflections: ContentItem[];
}

export default function CellDetailView({ selectedCell, onClose }: CellDetailViewProps) {
  const router = useRouter();
  const { getContentForCell } = useContentManagement();
  const { formatDateFromCell } = useDateCalculations();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (selectedCell) {
      setIsLoading(true);
      // Fetch content for the selected cell
      const cellContent = getContentForCell(selectedCell);
      setContent(cellContent);
      setIsLoading(false);
    }
  }, [selectedCell, getContentForCell]);

  // Group content by type
  const groupedContent = useMemo(() => {
    const grouped: GroupedContent = {
      memories: [],
      lessons: [],
      goals: [],
      reflections: []
    };

    content.forEach(item => {
      if (item.type === 'memory') grouped.memories.push(item);
      else if (item.type === 'lesson') grouped.lessons.push(item);
      else if (item.type === 'goal') grouped.goals.push(item);
      else if (item.type === 'reflection') grouped.reflections.push(item);
    });

    return grouped;
  }, [content]);

  const handleAddContent = (type: 'memory' | 'lesson' | 'goal' | 'reflection') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (selectedCell) {
      // Navigate to the appropriate content creation screen
      router.push({
        pathname: `/content/${type}`,
        params: {
          year: selectedCell.year,
          month: selectedCell.month,
          week: selectedCell.week,
        },
      });
    }
  };

  if (!selectedCell) return null;

  const formattedDate = formatDateFromCell(selectedCell);
  const hasContent = content.length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.dateTitle}>{formattedDate}</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {!hasContent ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No content for this time period</Text>
              <Text style={styles.emptyStateSubtext}>Add your first memory, lesson, goal, or reflection</Text>
            </View>
          ) : (
            <ScrollView style={styles.contentContainer}>
              {/* Memories Section */}
              {groupedContent.memories.length > 0 && (
                <View style={styles.contentSection}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="image-outline" size={18} color="#4A90E2" />
                    <Text style={[styles.sectionTitle, { color: '#4A90E2' }]}>
                      Memories {groupedContent.memories.length > 1 && `(${groupedContent.memories.length})`}
                    </Text>
                  </View>
                  {groupedContent.memories.map((item) => (
                    <ContentItemCard 
                      key={item.id} 
                      item={item} 
                      onPress={() => router.push({
                        pathname: `/content/view`,
                        params: { id: item.id }
                      })}
                    />
                  ))}
                </View>
              )}

              {/* Lessons Section */}
              {groupedContent.lessons.length > 0 && (
                <View style={styles.contentSection}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="bulb-outline" size={18} color="#50E3C2" />
                    <Text style={[styles.sectionTitle, { color: '#50E3C2' }]}>
                      Lessons {groupedContent.lessons.length > 1 && `(${groupedContent.lessons.length})`}
                    </Text>
                  </View>
                  {groupedContent.lessons.map((item) => (
                    <ContentItemCard 
                      key={item.id} 
                      item={item} 
                      onPress={() => router.push({
                        pathname: `/content/view`,
                        params: { id: item.id }
                      })}
                    />
                  ))}
                </View>
              )}

              {/* Goals Section */}
              {groupedContent.goals.length > 0 && (
                <View style={styles.contentSection}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="flag-outline" size={18} color="#F5A623" />
                    <Text style={[styles.sectionTitle, { color: '#F5A623' }]}>
                      Goals {groupedContent.goals.length > 1 && `(${groupedContent.goals.length})`}
                    </Text>
                  </View>
                  {groupedContent.goals.map((item) => (
                    <ContentItemCard 
                      key={item.id} 
                      item={item} 
                      onPress={() => router.push({
                        pathname: `/content/view`,
                        params: { id: item.id }
                      })}
                    />
                  ))}
                </View>
              )}

              {/* Reflections Section */}
              {groupedContent.reflections.length > 0 && (
                <View style={styles.contentSection}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="journal-outline" size={18} color="#9013FE" />
                    <Text style={[styles.sectionTitle, { color: '#9013FE' }]}>
                      Reflections {groupedContent.reflections.length > 1 && `(${groupedContent.reflections.length})`}
                    </Text>
                  </View>
                  {groupedContent.reflections.map((item) => (
                    <ContentItemCard 
                      key={item.id} 
                      item={item} 
                      onPress={() => router.push({
                        pathname: `/content/view`,
                        params: { id: item.id }
                      })}
                    />
                  ))}
                </View>
              )}
            </ScrollView>
          )}

          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.memoryButton]} 
              onPress={() => handleAddContent('memory')}
            >
              <Ionicons name="image-outline" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Memory</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.lessonButton]} 
              onPress={() => handleAddContent('lesson')}
            >
              <Ionicons name="bulb-outline" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Lesson</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.goalButton]} 
              onPress={() => handleAddContent('goal')}
            >
              <Ionicons name="flag-outline" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Goal</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.reflectionButton]} 
              onPress={() => handleAddContent('reflection')}
            >
              <Ionicons name="journal-outline" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Reflection</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

// ContentItemCard component for displaying individual content items
function ContentItemCard({ item, onPress }: { item: ContentItem; onPress: () => void }) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 300 } as any}
      style={styles.contentItem}
    >
      <TouchableOpacity onPress={onPress} style={styles.contentItemTouchable}>
        <Text style={styles.contentTitle}>{item.title}</Text>
        {item.notes && (
          <Text 
            style={styles.contentNotes}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {item.notes}
          </Text>
        )}
        {item.emoji && (
          <Text style={styles.contentEmoji}>{item.emoji}</Text>
        )}
        <View style={styles.contentFooter}>
          <Text style={styles.viewDetailsText}>View Details</Text>
          {item.media && item.media.length > 0 && (
            <View style={styles.mediaIndicator}>
              <Ionicons name="images-outline" size={14} color="#666" />
              <Text style={styles.mediaCount}>{item.media.length}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </MotiView>
  );
}

// Helper function to get color based on content type
function getContentTypeColor(type: string): string {
  switch (type) {
    case 'memory':
      return '#0A84FF'; // iOS blue
    case 'lesson':
      return '#30D158'; // iOS green
    case 'goal':
      return '#FF9F0A'; // iOS orange
    case 'reflection':
      return '#BF5AF2'; // iOS purple
    default:
      return '#8E8E93'; // iOS gray
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E', // iOS dark gray
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text for dark mode
  },
  closeButton: {
    padding: 5,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#8E8E93', // iOS gray
    textAlign: 'center',
    marginTop: 10,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    marginBottom: 20,
  },
  contentSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  contentItem: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  contentItemTouchable: {
    padding: 15,
  },
  contentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contentTypeIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  contentType: {
    fontSize: 12,
    fontWeight: '500',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    overflow: 'hidden',
    color: '#FFFFFF',
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#FFFFFF', // White text for dark mode
  },
  contentNotes: {
    fontSize: 14,
    color: '#EBEBF5', // Light gray for dark mode
    marginBottom: 10,
    lineHeight: 20,
  },
  contentEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  contentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewDetailsButton: {
    alignSelf: 'flex-end',
  },
  viewDetailsText: {
    fontSize: 14,
    color: '#0A84FF', // iOS blue
    fontWeight: '500',
  },
  mediaIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mediaCount: {
    fontSize: 12,
    color: '#8E8E93', // iOS gray
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  memoryButton: {
    backgroundColor: '#4A90E2',
  },
  lessonButton: {
    backgroundColor: '#50E3C2',
  },
  goalButton: {
    backgroundColor: '#F5A623',
  },
  reflectionButton: {
    backgroundColor: '#9013FE',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 12,
    marginLeft: 4,
  },
}); 