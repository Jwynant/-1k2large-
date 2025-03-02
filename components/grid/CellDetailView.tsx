import React, { useEffect, useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Modal,
  Dimensions,
  Pressable,
  useColorScheme
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';
import { ContentItem, SelectedCell } from '../../app/types';
import { useContentManagement } from '../../app/hooks/useContentManagement';
import { useDateCalculations } from '../../app/hooks/useDateCalculations';
import { BlurView } from 'expo-blur';

interface CellDetailViewProps {
  selectedCell: SelectedCell | null;
  onClose: () => void;
}

// Content type definition for the tabs
type ContentType = 'memory' | 'lesson' | 'goal' | 'reflection';

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
  const { formatDateFromCell, isWeekInPast, isMonthInPast, isYearInPast, isCurrentWeek, isCurrentMonth, isCurrentYear } = useDateCalculations();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<ContentType>('memory');
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  // Get screen dimensions
  const { width: screenWidth } = Dimensions.get('window');

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

  // Handle selecting a content type tab
  const handleTabSelect = (type: ContentType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedType(type);
  };

  // Handle adding new content for the current type
  const handleAddContent = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (selectedCell) {
      // Navigate to the appropriate content creation screen
      router.push({
        pathname: `/content/${selectedType}`,
        params: {
          year: selectedCell.year,
          month: selectedCell.month,
          week: selectedCell.week,
        },
      });
      onClose();
    }
  };

  // Determine if cell is in the past, present, or future
  const getCellState = () => {
    if (!selectedCell) return 'future';
    
    const { year, month, week } = selectedCell;
    
    // Check if cell is current
    if (
      (week !== undefined && isCurrentWeek(year, week)) ||
      (month !== undefined && isCurrentMonth(year, month)) ||
      (week === undefined && month === undefined && isCurrentYear(year))
    ) {
      return 'present';
    }
    
    // Check if cell is in the past
    if (
      (week !== undefined && isWeekInPast(year, week)) ||
      (month !== undefined && isMonthInPast(year, month)) ||
      (week === undefined && month === undefined && isYearInPast(year))
    ) {
      return 'past';
    }
    
    // Otherwise, cell is in the future
    return 'future';
  };

  // Get styling based on cell state - only for present cells special accent
  const cellState = getCellState();
  
  if (!selectedCell) return null;

  const formattedDate = formatDateFromCell(selectedCell);
  const contentForSelectedType = groupedContent[`${selectedType}s` as keyof GroupedContent];
  const hasSelectedContent = contentForSelectedType?.length > 0;

  // Content counts for badges
  const memoriesCount = groupedContent.memories.length;
  const lessonsCount = groupedContent.lessons.length;
  const goalsCount = groupedContent.goals.length;
  const reflectionsCount = groupedContent.reflections.length;

  // Get appropriate empty state message based on content type
  const getEmptyStateMessage = () => {
    const timeText = selectedCell.month !== undefined 
      ? 'month' 
      : selectedCell.week !== undefined 
        ? 'week' 
        : 'year';
    
    switch (selectedType) {
      case 'memory':
        return `No memories recorded for this ${timeText}`;
      case 'lesson':
        return `No lessons learned during this ${timeText}`;
      case 'goal':
        return `No goals set for this ${timeText}`;
      case 'reflection':
        return `No reflections added for this ${timeText}`;
      default:
        return `No content for this ${timeText}`;
    }
  };

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <Pressable 
        style={styles.modalOverlay} 
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onClose();
        }}
      >
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 250 } as any}
          style={[
            styles.modalContainer,
            { width: screenWidth * 0.85 },
            isDarkMode ? styles.darkModeView : styles.lightModeView,
            cellState === 'present' && styles.presentCellView
          ]}
        >
          <Pressable 
            style={{ flex: 1, borderRadius: 14 }}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.dateContainer}>
                <Text 
                  style={[
                    styles.dateTitle,
                    isDarkMode ? styles.darkModeText : styles.lightModeText
                  ]}
                  accessibilityRole="header"
                >
                  {formattedDate}
                </Text>
              </View>
              <TouchableOpacity 
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onClose();
                }} 
                style={styles.closeButton}
                accessibilityLabel="Close cell detail view"
                accessibilityHint="Returns to the main grid view"
              >
                <Ionicons 
                  name="close" 
                  size={24} 
                  color={isDarkMode ? '#FFF' : '#333'} 
                />
              </TouchableOpacity>
            </View>

            {/* Content Type Tabs */}
            <View style={styles.tabsContainer}>
              <MotiView 
                style={[
                  styles.tabsBackground,
                  isDarkMode ? { backgroundColor: 'rgba(30, 30, 30, 0.8)' } : { backgroundColor: '#F2F2F7' }
                ]}
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: 'timing', duration: 300 } as any}
              />
              
              <ScrollView 
                horizontal={true} 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabsScrollContainer}
              >
                <TouchableOpacity 
                  style={[
                    styles.tab, 
                    { minWidth: screenWidth * 0.85 / 4 - 16 },
                    selectedType === 'memory' && styles.activeTab,
                    selectedType === 'memory' && { backgroundColor: 'rgba(10, 132, 255, 0.9)' }
                  ]}
                  onPress={() => handleTabSelect('memory')}
                  accessibilityLabel="Memories tab"
                  accessibilityState={{ selected: selectedType === 'memory' }}
                >
                  <Ionicons 
                    name="image-outline" 
                    size={18} 
                    color={selectedType === 'memory' ? '#FFF' : isDarkMode ? '#8E8E93' : '#666'} 
                  />
                  <Text style={[
                    styles.tabText,
                    selectedType === 'memory' && styles.activeTabText
                  ]}>
                    Memories
                  </Text>
                  {memoriesCount > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{memoriesCount}</Text>
                    </View>
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.tab, 
                    { minWidth: screenWidth * 0.85 / 4 - 16 },
                    selectedType === 'lesson' && styles.activeTab,
                    selectedType === 'lesson' && { backgroundColor: 'rgba(48, 209, 88, 0.9)' }
                  ]}
                  onPress={() => handleTabSelect('lesson')}
                  accessibilityLabel="Lessons tab"
                  accessibilityState={{ selected: selectedType === 'lesson' }}
                >
                  <Ionicons 
                    name="bulb-outline" 
                    size={18} 
                    color={selectedType === 'lesson' ? '#FFF' : isDarkMode ? '#8E8E93' : '#666'} 
                  />
                  <Text style={[
                    styles.tabText,
                    selectedType === 'lesson' && styles.activeTabText
                  ]}>
                    Lessons
                  </Text>
                  {lessonsCount > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{lessonsCount}</Text>
                    </View>
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.tab, 
                    { minWidth: screenWidth * 0.85 / 4 - 16 },
                    selectedType === 'goal' && styles.activeTab,
                    selectedType === 'goal' && { backgroundColor: 'rgba(255, 159, 10, 0.9)' }
                  ]}
                  onPress={() => handleTabSelect('goal')}
                  accessibilityLabel="Goals tab"
                  accessibilityState={{ selected: selectedType === 'goal' }}
                >
                  <Ionicons 
                    name="flag-outline" 
                    size={18} 
                    color={selectedType === 'goal' ? '#FFF' : isDarkMode ? '#8E8E93' : '#666'} 
                  />
                  <Text style={[
                    styles.tabText,
                    selectedType === 'goal' && styles.activeTabText
                  ]}>
                    Goals
                  </Text>
                  {goalsCount > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{goalsCount}</Text>
                    </View>
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.tab, 
                    { minWidth: screenWidth * 0.85 / 4 - 16 },
                    selectedType === 'reflection' && styles.activeTab,
                    selectedType === 'reflection' && { backgroundColor: 'rgba(191, 90, 242, 0.9)' }
                  ]}
                  onPress={() => handleTabSelect('reflection')}
                  accessibilityLabel="Reflections tab"
                  accessibilityState={{ selected: selectedType === 'reflection' }}
                >
                  <Ionicons 
                    name="journal-outline" 
                    size={18} 
                    color={selectedType === 'reflection' ? '#FFF' : isDarkMode ? '#8E8E93' : '#666'} 
                  />
                  <Text style={[
                    styles.tabText,
                    selectedType === 'reflection' && styles.activeTabText
                  ]}>
                    Reflections
                  </Text>
                  {reflectionsCount > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{reflectionsCount}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </ScrollView>
            </View>

            {/* Content Area */}
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator 
                  size="large" 
                  color="#0A84FF" 
                />
              </View>
            ) : (
              <View style={styles.contentArea}>
                {!hasSelectedContent ? (
                  <MotiView 
                    style={styles.emptyState}
                    from={{ opacity: 0, translateY: 10 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 300, delay: 100 } as any}
                  >
                    <View style={styles.emptyStateIconContainer}>
                      <Ionicons 
                        name={
                          selectedType === 'memory' ? 'images-outline' :
                          selectedType === 'lesson' ? 'school-outline' :
                          selectedType === 'goal' ? 'trophy-outline' : 'book-outline'
                        } 
                        size={56} 
                        color={getContentTypeColor(selectedType, 0.7)}
                      />
                    </View>
                    <Text style={[
                      styles.emptyStateText,
                      isDarkMode ? styles.darkModeText : styles.lightModeText
                    ]}>
                      {getEmptyStateMessage()}
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.emptyStateButton,
                        { backgroundColor: getContentTypeColor(selectedType) }
                      ]}
                      onPress={handleAddContent}
                      accessibilityLabel={`Add a new ${selectedType}`}
                      accessibilityHint={`Creates a new ${selectedType} for this time period`}
                    >
                      <Text style={styles.emptyStateButtonText}>
                        {`Add ${selectedType === 'memory' ? 'a' : selectedType === 'lesson' ? 'a' : selectedType === 'reflection' ? 'a' : 'a'} ${selectedType}`}
                      </Text>
                    </TouchableOpacity>
                  </MotiView>
                ) : (
                  <ScrollView 
                    style={styles.contentScrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 70 }}
                  >
                    {contentForSelectedType.map((item, index) => (
                      <MotiView
                        key={item.id}
                        from={{ opacity: 0, translateY: 10 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ 
                          type: 'timing', 
                          duration: 250, 
                          delay: index * 50 
                        } as any}
                        style={[
                          styles.contentItem,
                          isDarkMode ? styles.darkModeContentItem : styles.lightModeContentItem,
                          { 
                            shadowColor: getContentTypeColor(selectedType),
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 2
                          }
                        ]}
                      >
                        <TouchableOpacity 
                          onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            router.push({
                              pathname: `/content/view`,
                              params: { id: item.id }
                            });
                            onClose();
                          }}
                          style={styles.contentItemTouchable}
                          accessibilityLabel={`View ${item.title}`}
                          accessibilityHint={`Opens the detail view for ${item.title}`}
                        >
                          <View style={styles.contentItemHeader}>
                            <Text style={[
                              styles.contentTitle,
                              isDarkMode ? styles.darkModeText : styles.lightModeText
                            ]}>
                              {item.title}
                            </Text>
                            
                            {item.emoji && (
                              <Text style={styles.contentEmoji}>{item.emoji}</Text>
                            )}
                          </View>
                          
                          {item.notes && (
                            <Text 
                              style={[
                                styles.contentNotes,
                                isDarkMode ? styles.darkModeNotes : styles.lightModeNotes
                              ]}
                              numberOfLines={2}
                              ellipsizeMode="tail"
                            >
                              {item.notes}
                            </Text>
                          )}
                          
                          <View style={styles.contentFooter}>
                            <Text style={[
                              styles.viewDetailsText,
                              { color: getContentTypeColor(selectedType) }
                            ]}>
                              View Details
                            </Text>
                            
                            {item.media && item.media.length > 0 && (
                              <View style={styles.mediaIndicator}>
                                <Ionicons 
                                  name="images-outline" 
                                  size={14} 
                                  color={isDarkMode ? '#AEAEB2' : '#8E8E93'}
                                />
                                <Text style={[
                                  styles.mediaCount,
                                  isDarkMode ? styles.darkModeText : styles.lightModeText
                                ]}>
                                  {item.media.length}
                                </Text>
                              </View>
                            )}
                          </View>
                        </TouchableOpacity>
                      </MotiView>
                    ))}
                  </ScrollView>
                )}
              </View>
            )}

            {/* Add Button */}
            <MotiView
              from={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 150, damping: 15 } as any}
              style={[
                styles.addButtonContainer
              ]}
            >
              <TouchableOpacity 
                style={[
                  styles.addButton,
                  { backgroundColor: getContentTypeColor(selectedType) }
                ]}
                onPress={handleAddContent}
                accessibilityLabel={`Add ${selectedType}`}
                accessibilityHint={`Creates a new ${selectedType} entry`}
              >
                <Ionicons name="add" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </MotiView>
          </Pressable>
        </MotiView>
      </Pressable>
    </Modal>
  );
}

// Helper function to get color based on content type
function getContentTypeColor(type: string, opacity: number = 1): string {
  switch (type) {
    case 'memory':
      return `rgba(10, 132, 255, ${opacity})`; // iOS blue
    case 'lesson':
      return `rgba(48, 209, 88, ${opacity})`; // iOS green
    case 'goal':
      return `rgba(255, 159, 10, ${opacity})`; // iOS orange
    case 'reflection':
      return `rgba(191, 90, 242, ${opacity})`; // iOS purple
    default:
      return `rgba(142, 142, 147, ${opacity})`; // iOS gray
  }
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    height: '70%',
    maxHeight: 600,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  // Dark/Light mode styles
  darkModeView: {
    backgroundColor: '#121212',
    borderColor: '#FFFFFF',
    borderWidth: 1,
  },
  lightModeView: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E5EA',
    borderWidth: 1,
  },
  // Present cell special styling
  presentCellView: {
    borderColor: '#0A84FF',
    borderWidth: 2,
  },
  // Text styles based on color scheme
  darkModeText: {
    color: '#FFFFFF',
  },
  lightModeText: {
    color: '#1C1C1E',
  },
  darkModeNotes: {
    color: '#EBEBF5',
  },
  lightModeNotes: {
    color: '#3C3C43',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(142, 142, 147, 0.2)', // Subtle separator
  },
  dateContainer: {
    flex: 1,
  },
  dateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 6,
    borderRadius: 20,
    marginLeft: 8,
  },
  // Tabs styling
  tabsContainer: {
    position: 'relative',
    height: 56,
  },
  tabsBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(142, 142, 147, 0.1)',
  },
  tabsScrollContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
    height: '100%',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: '#0A84FF',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#8E8E93',
    marginLeft: 5,
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  badge: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  // Content area
  contentArea: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateIconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(142, 142, 147, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 8,
    maxWidth: '80%',
  },
  emptyStateButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 18,
    marginTop: 16,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  contentScrollView: {
    flex: 1,
  },
  contentItem: {
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
  },
  darkModeContentItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
  },
  lightModeContentItem: {
    backgroundColor: '#f5f5f5',
    borderColor: '#E5E5EA',
    borderWidth: 1,
  },
  contentItemTouchable: {
    padding: 16,
  },
  contentItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  contentNotes: {
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 20,
  },
  contentEmoji: {
    fontSize: 24,
    marginLeft: 8,
  },
  contentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '500',
  },
  mediaIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(142, 142, 147, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mediaCount: {
    fontSize: 12,
    marginLeft: 4,
  },
  // Add button
  addButtonContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    zIndex: 10,
  },
  addButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
}); 