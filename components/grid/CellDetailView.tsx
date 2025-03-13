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
import Animated, { 
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { ContentItem, SelectedCell, ContentType as AppContentType } from '../../app/types';
import { useContentManagement } from '../../app/hooks/useContentManagement';
import { useDateCalculations } from '../../app/hooks/useDateCalculations';
import { useFocusAreas } from '../../app/hooks/useFocusAreas';
import { BlurView } from 'expo-blur';
import CellLessonsView from '../content/lessons/CellLessonsView';

// Local extension of ContentType to include 'insight' which is used in this component
type ContentType = AppContentType | 'insight';

interface CellDetailViewProps {
  selectedCell: SelectedCell | null;
  onClose: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

// Group content by type for better organization
interface GroupedContent {
  memories: ContentItem[];
  goals: ContentItem[];
  insights: ContentItem[];
  lessons: ContentItem[];
}

export default function CellDetailView({ selectedCell, onClose, onBack, showBackButton = false }: CellDetailViewProps) {
  const router = useRouter();
  const { getContentForCell } = useContentManagement();
  const { formatDateFromCell, isWeekInPast, isMonthInPast, isYearInPast, isCurrentWeek, isCurrentMonth, isCurrentYear } = useDateCalculations();
  const { focusAreas } = useFocusAreas();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<ContentType>('memory');
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  // Get screen dimensions
  const { width: screenWidth } = Dimensions.get('window');

  // Animation values for content items
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(10);
  
  // Animate content when it changes
  useEffect(() => {
    if (!isLoading) {
      contentOpacity.value = 0;
      contentTranslateY.value = 10;
      
      contentOpacity.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) });
      contentTranslateY.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.ease) });
    }
  }, [isLoading, content, selectedType]);

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
      goals: [],
      insights: [],
      lessons: []
    };

    content.forEach(item => {
      // Use a switch statement instead of if-else to avoid type comparison issues
      switch (item.type) {
        case 'memory':
          grouped.memories.push(item);
          break;
        case 'goal':
          grouped.goals.push(item);
          break;
        case 'lesson':
          grouped.lessons.push(item);
          break;
        default:
          // Handle 'insight' and any future types
          if (item.type === 'insight') {
            grouped.insights.push(item);
          }
          break;
      }
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
      // First close the modal, then navigate
      onClose();
      
      // Navigate to the appropriate content form based on the selected type
      if (selectedType === 'memory') {
        router.push("/(tabs)/content/memory" as any);
      } else if (selectedType === 'goal') {
        router.push("/(tabs)/content/goal" as any);
      } else if (selectedType === 'lesson') {
        router.push("/(tabs)/content/lesson" as any);
      } else {
        // Default to content tab
        router.push("/(tabs)/content" as any);
      }
    }
  };

  // Handle back button press
  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onBack && showBackButton) {
      onBack();
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

  // Get focus area info for a content item
  const getFocusAreaInfo = (focusAreaId?: string) => {
    if (!focusAreaId) return null;
    return focusAreas.find(area => area.id === focusAreaId);
  };

  // Get styling based on cell state - only for present cells special accent
  const cellState = getCellState();
  
  if (!selectedCell) return null;

  const formattedDate = formatDateFromCell(selectedCell);
  const contentForSelectedType = groupedContent[`${selectedType}s` as keyof GroupedContent];
  const hasSelectedContent = contentForSelectedType?.length > 0;

  // Content counts for badges
  const memoriesCount = groupedContent.memories.length;
  const goalsCount = groupedContent.goals.length;
  const insightsCount = groupedContent.insights.length;
  const lessonsCount = groupedContent.lessons.length;

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
      case 'goal':
        return `No goals set for this ${timeText}`;
      case 'insight':
        return `No insights added for this ${timeText}`;
      case 'lesson':
        return `No lessons added for this ${timeText}`;
      default:
        return `No content for this ${timeText}`;
    }
  };

  // Helper function to get icon name based on content type
  const getIconNameForContentType = (type: ContentType): string => {
    if (type === 'memory') return 'images-outline';
    if (type === 'goal') return 'flag-outline';
    if (type === 'lesson') return 'school-outline';
    if (type === 'insight') return 'bulb-outline';
    return 'document-outline'; // Default
  };

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="none" // We'll handle animations ourselves
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
        <Animated.View
          entering={FadeIn.duration(250).springify()}
          exiting={FadeOut.duration(200)}
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
              {showBackButton && (
                <TouchableOpacity 
                  onPress={handleBackPress} 
                  style={styles.backButton}
                  accessibilityLabel="Back to month view"
                  accessibilityHint="Returns to the month grid view"
                >
                  <Ionicons 
                    name="chevron-back" 
                    size={24} 
                    color={isDarkMode ? '#FFF' : '#333'} 
                  />
                </TouchableOpacity>
              )}
              
              <View style={[styles.dateContainer, showBackButton ? { flex: 1 } : {}]}>
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
              <Animated.View 
                entering={FadeIn.duration(300)}
                style={[
                  styles.tabsBackground,
                  isDarkMode ? { backgroundColor: 'rgba(30, 30, 30, 0.8)' } : { backgroundColor: '#F2F2F7' }
                ]}
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
                    selectedType === 'memory' && { backgroundColor: getContentTypeColor('memory', 0.9) }
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
                    selectedType === 'goal' && styles.activeTab,
                    selectedType === 'goal' && { backgroundColor: getContentTypeColor('goal', 0.9) }
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
                    selectedType === 'lesson' && styles.activeTab,
                    selectedType === 'lesson' && { backgroundColor: getContentTypeColor('lesson', 0.9) }
                  ]}
                  onPress={() => handleTabSelect('lesson')}
                  accessibilityLabel="Lessons tab"
                  accessibilityState={{ selected: selectedType === 'lesson' }}
                >
                  <Ionicons 
                    name="school-outline" 
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
                    selectedType === 'insight' && styles.activeTab,
                    selectedType === 'insight' && { backgroundColor: getContentTypeColor('insight', 0.9) }
                  ]}
                  onPress={() => handleTabSelect('insight')}
                  accessibilityLabel="Insights tab"
                  accessibilityState={{ selected: selectedType === 'insight' }}
                >
                  <Ionicons 
                    name="bulb-outline" 
                    size={18} 
                    color={selectedType === 'insight' ? '#FFF' : isDarkMode ? '#8E8E93' : '#666'} 
                  />
                  <Text style={[
                    styles.tabText,
                    selectedType === 'insight' && styles.activeTabText
                  ]}>
                    Insights
                  </Text>
                  {insightsCount > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{insightsCount}</Text>
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
                {/* Render CellLessonsView when lessons tab is selected */}
                {selectedType === 'lesson' ? (
                  <CellLessonsView 
                    selectedCell={selectedCell} 
                    onAddLesson={handleAddContent}
                  />
                ) : !hasSelectedContent ? (
                  <Animated.View 
                    entering={FadeIn.duration(300).delay(100).springify()}
                    style={styles.emptyState}
                  >
                    <View style={styles.emptyStateIconContainer}>
                      <Ionicons 
                        name={getIconNameForContentType(selectedType)}
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
                        { backgroundColor: getContentTypeColor(selectedType, 0.9) }
                      ]}
                      onPress={handleAddContent}
                      accessibilityLabel={`Add ${selectedType}`}
                      accessibilityHint={`Create new ${selectedType} content`}
                    >
                      <Text style={styles.emptyStateButtonText}>
                        {`Add ${selectedType}`}
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                ) : (
                  <ScrollView 
                    contentContainerStyle={styles.contentList}
                    showsVerticalScrollIndicator={false}
                  >
                    {contentForSelectedType.map((item, index) => {
                      const itemAnimationStyle = useAnimatedStyle(() => {
                        return {
                          opacity: contentOpacity.value,
                          transform: [{ translateY: contentTranslateY.value }]
                        };
                      });
                      
                      return (
                        <Animated.View
                          key={item.id}
                          style={[
                            styles.contentItem,
                            isDarkMode ? styles.darkModeContentItem : styles.lightModeContentItem,
                            { 
                              shadowColor: getContentTypeColor(selectedType),
                              shadowOffset: { width: 0, height: 2 },
                              shadowOpacity: 0.1,
                              shadowRadius: 4,
                              elevation: 2
                            },
                            itemAnimationStyle
                          ]}
                          entering={FadeIn.duration(250).delay(index * 50).springify()
                            .withInitialValues({ transform: [{ translateY: 10 }] })}
                        >
                          <TouchableOpacity 
                            onPress={() => {
                              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                              // First close the modal, then navigate
                              onClose();
                              
                              // Navigate to the content tab
                              router.push("/(tabs)/content" as any);
                              
                              // Could dispatch an action here to view the specific content item
                              // rather than trying to pass parameters through the URL
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
                              {/* For goals with focus areas */}
                              {item.type === 'goal' && item.focusAreaId && (
                                <View style={styles.focusAreaIndicator}>
                                  <View 
                                    style={[
                                      styles.focusAreaDot, 
                                      { backgroundColor: getFocusAreaInfo(item.focusAreaId)?.color || '#8E8E93' }
                                    ]} 
                                  />
                                  <Text style={styles.focusAreaName}>
                                    {getFocusAreaInfo(item.focusAreaId)?.name}
                                  </Text>
                                </View>
                              )}

                              {/* For goals with progress */}
                              {item.type === 'goal' && item.progress !== undefined && (
                                <View style={styles.progressContainer}>
                                  <View 
                                    style={[
                                      styles.progressBar, 
                                      { 
                                        width: `${item.progress}%`,
                                        backgroundColor: getFocusAreaInfo(item.focusAreaId)?.color || getContentTypeColor('goal')
                                      }
                                    ]} 
                                  />
                                </View>
                              )}
                              
                              {/* For memories with media */}
                              {item.type === 'memory' && item.media && item.media.length > 0 && (
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
                              
                              {/* For insights with importance rating */}
                              {item.type === 'insight' && item.importance !== undefined && (
                                <View style={styles.importanceContainer}>
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <View 
                                      key={i}
                                      style={[
                                        styles.importanceDot,
                                        { 
                                          backgroundColor: i < item.importance! ? getContentTypeColor('insight') : '#3A3A3C' 
                                        }
                                      ]}
                                    />
                                  ))}
                                </View>
                              )}
                              
                              <Text style={[
                                styles.viewDetailsText,
                                { color: getContentTypeColor(item.type) }
                              ]}>
                                View Details
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </Animated.View>
                      );
                    })}
                  </ScrollView>
                )}
              </View>
            )}

            {/* Add Button */}
            <Animated.View
              entering={FadeIn.delay(200).duration(300).springify()
                .withInitialValues({ transform: [{ scale: 0.8 }] })}
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
            </Animated.View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

// Helper function to get color based on content type
function getContentTypeColor(type: string, opacity: number = 1): string {
  switch (type) {
    case 'memory':
      return `rgba(10, 132, 255, ${opacity})`; // iOS blue
    case 'goal':
      return `rgba(255, 159, 10, ${opacity})`; // iOS orange
    case 'insight':
      return `rgba(48, 209, 88, ${opacity})`; // iOS green
    case 'lesson':
      return `rgba(52, 199, 89, ${opacity})`; // iOS green for lessons
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
    borderColor: '#2C2C2E',
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
  contentList: {
    paddingBottom: 70,
  },
  contentItem: {
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
  },
  darkModeContentItem: {
    backgroundColor: 'rgba(44, 44, 46, 0.8)',
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
  // Focus area indicator
  focusAreaIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  focusAreaDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 4,
  },
  focusAreaName: {
    fontSize: 12,
    color: '#8E8E93',
  },
  // Progress indicator for goals
  progressContainer: {
    width: 60,
    height: 6,
    backgroundColor: '#3A3A3C',
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#0A84FF',
  },
  // Media indicator for memories
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
  // Importance indicator for insights
  importanceContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  importanceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 1,
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
  backButton: {
    padding: 8,
    borderRadius: 20,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 