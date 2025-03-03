import React, { useState, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  useColorScheme,
  Pressable,
  useWindowDimensions,
  SafeAreaView,
  Platform,
  Image
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';

type FilterOption = 'all' | 'goals' | 'memories' | 'lessons';

// Empty state components
const EmptyGoals = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <View style={styles.emptyStateContainer}>
    <View style={[styles.emptyStateIconContainer, isDarkMode && { backgroundColor: '#2C2C2E' }]}>
      <Ionicons name="flag" size={40} color={isDarkMode ? '#0A84FF' : '#007AFF'} />
    </View>
    <Text style={[styles.emptyStateTitle, isDarkMode && styles.darkText]}>No Goals Yet</Text>
    <Text style={[styles.emptyStateDescription, isDarkMode && styles.darkSecondaryText]}>
      Set your intentions and track progress towards your goals.
    </Text>
    <Pressable style={styles.emptyStateButton}>
      <Text style={styles.emptyStateButtonText}>Create Your First Goal</Text>
    </Pressable>
  </View>
);

const EmptyMemories = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <View style={styles.emptyStateContainer}>
    <View style={[styles.emptyStateIconContainer, isDarkMode && { backgroundColor: '#2C2C2E' }]}>
      <Ionicons name="images" size={40} color={isDarkMode ? '#30D158' : '#34C759'} />
    </View>
    <Text style={[styles.emptyStateTitle, isDarkMode && styles.darkText]}>No Memories Yet</Text>
    <Text style={[styles.emptyStateDescription, isDarkMode && styles.darkSecondaryText]}>
      Capture and revisit meaningful moments from your life journey.
    </Text>
    <Pressable style={styles.emptyStateButton}>
      <Text style={styles.emptyStateButtonText}>Record a Memory</Text>
    </Pressable>
  </View>
);

const EmptyLessons = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <View style={styles.emptyStateContainer}>
    <View style={[styles.emptyStateIconContainer, isDarkMode && { backgroundColor: '#2C2C2E' }]}>
      <Ionicons name="sparkles" size={40} color={isDarkMode ? '#BF5AF2' : '#AF52DE'} />
    </View>
    <Text style={[styles.emptyStateTitle, isDarkMode && styles.darkText]}>No Lessons Yet</Text>
    <Text style={[styles.emptyStateDescription, isDarkMode && styles.darkSecondaryText]}>
      Document insights and lessons learned throughout your experiences.
    </Text>
    <Pressable style={styles.emptyStateButton}>
      <Text style={styles.emptyStateButtonText}>Capture Your First Insight</Text>
    </Pressable>
  </View>
);

// Content Components
const GoalItem = ({ goal, isDarkMode }: { goal: any; isDarkMode: boolean }) => (
  <View style={[styles.contentCard, isDarkMode && styles.darkCard]}>
    <View style={styles.goalHeader}>
      <View style={[styles.priorityIndicator, { backgroundColor: goal.priorityColor }]} />
      <Text style={[styles.goalTitle, isDarkMode && styles.darkText]}>{goal.title}</Text>
    </View>
    <Text style={[styles.goalDescription, isDarkMode && styles.darkSecondaryText]}>
      {goal.description}
    </Text>
    <View style={styles.goalFooter}>
      <View style={styles.goalMetrics}>
        <View style={styles.goalProgressContainer}>
          <View style={styles.goalProgressBar}>
            <View style={[styles.goalProgress, { width: `${goal.progress}%`, backgroundColor: goal.priorityColor }]} />
          </View>
          <Text style={[styles.goalProgressText, isDarkMode && styles.darkTertiaryText]}>{goal.progress}%</Text>
        </View>
      </View>
      <Text style={[styles.goalDeadline, isDarkMode && styles.darkTertiaryText]}>
        {goal.deadline ? `Due: ${goal.deadline}` : 'No deadline'}
      </Text>
    </View>
  </View>
);

const MemoryItem = ({ memory, isDarkMode }: { memory: any; isDarkMode: boolean }) => (
  <View style={[styles.contentCard, isDarkMode && styles.darkCard]}>
    {memory.imageUrl && (
      <View style={styles.memoryImageContainer}>
        <Image source={{ uri: memory.imageUrl }} style={styles.memoryImage} />
      </View>
    )}
    <View style={styles.memoryContent}>
      <Text style={[styles.memoryDate, isDarkMode && styles.darkTertiaryText]}>{memory.date}</Text>
      <Text style={[styles.memoryTitle, isDarkMode && styles.darkText]}>{memory.title}</Text>
      <Text style={[styles.memoryDescription, isDarkMode && styles.darkSecondaryText]} numberOfLines={3}>
        {memory.description}
      </Text>
      {memory.tags && (
        <View style={styles.tagContainer}>
          {memory.tags.map((tag: string, index: number) => (
            <View key={index} style={[styles.tag, isDarkMode && styles.darkTag]}>
              <Text style={[styles.tagText, isDarkMode && styles.darkTagText]}>{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  </View>
);

const LessonItem = ({ lesson, isDarkMode }: { lesson: any; isDarkMode: boolean }) => (
  <View style={[styles.contentCard, isDarkMode && styles.darkCard]}>
    <View style={styles.lessonHeader}>
      <View style={styles.lessonMeta}>
        <Text style={[styles.lessonDate, isDarkMode && styles.darkTertiaryText]}>{lesson.date}</Text>
        <View style={styles.importanceIndicator}>
          {Array.from({ length: lesson.importance }).map((_, i) => (
            <View key={i} style={[styles.importanceDot, { backgroundColor: isDarkMode ? '#BF5AF2' : '#AF52DE' }]} />
          ))}
        </View>
      </View>
      <Text style={[styles.lessonTitle, isDarkMode && styles.darkText]}>{lesson.title}</Text>
      {lesson.source && (
        <Text style={[styles.lessonSource, isDarkMode && styles.darkTertiaryText]}>From: {lesson.source}</Text>
      )}
    </View>
  </View>
);

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const { state } = useAppContext();
  const isDarkMode = state.theme === 'light' ? false : colorScheme === 'dark';
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  
  // State for filter selection
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('all');

  // Example data for dashboard - would be fetched from actual data sources
  const stats = {
    activeIntentions: 5,
    completedToday: 2,
    upcomingDeadlines: 3,
    recentInsights: 4,
  };
  
  // Filter options
  const filterOptions: { id: FilterOption; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'goals', label: 'Goals' },
    { id: 'memories', label: 'Memories' },
    { id: 'lessons', label: 'Lessons' },
  ];

  // Sample data
  const sampleGoals = [
    {
      id: '1',
      title: 'Complete Project Milestone',
      description: 'Finish the presentation slides for the client meeting tomorrow.',
      progress: 65,
      priorityColor: '#FF9F0A', // Orange for high priority
      deadline: 'Tomorrow',
    },
    {
      id: '2',
      title: 'Daily Meditation',
      description: 'Practice mindfulness for 15 minutes each morning.',
      progress: 80,
      priorityColor: '#30D158', // Green for medium priority
      deadline: 'Recurring',
    }
  ];

  const sampleMemories = [
    {
      id: '1',
      title: 'Weekend Trip to the Mountains',
      description: 'We hiked to the summit and enjoyed breathtaking views of the valley below. The weather was perfect with clear skies and a gentle breeze.',
      date: 'May 15, 2023',
      imageUrl: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606', 
      tags: ['Nature', 'Adventure', 'Friends']
    },
    {
      id: '2',
      title: 'Birthday Celebration',
      description: 'Celebrated with close friends at our favorite restaurant. It was a wonderful evening filled with laughter and good food.',
      date: 'April 3, 2023',
      tags: ['Celebration', 'Friends']
    }
  ];

  const sampleLessons = [
    {
      id: '1',
      title: 'Always validate assumptions early',
      date: 'January 15, 2024',
      importance: 5,
      source: 'Project Retrospective',
    },
    {
      id: '2',
      title: 'Regular exercise improves focus',
      date: 'January 10, 2024',
      importance: 4,
    }
  ];

  // Determine if we have data for each section
  const hasGoals = sampleGoals.length > 0;
  const hasMemories = sampleMemories.length > 0;
  const hasLessons = sampleLessons.length > 0;

  // Determine what content to show based on filter
  const shouldShowGoals = selectedFilter === 'all' || selectedFilter === 'goals';
  const shouldShowMemories = selectedFilter === 'all' || selectedFilter === 'memories';
  const shouldShowLessons = selectedFilter === 'all' || selectedFilter === 'lessons';

  // Combine all content for "All" view
  const showAllContent = selectedFilter === 'all';

  return (
    <SafeAreaView style={[
      styles.container, 
      isDarkMode && styles.darkContainer,
      { paddingTop: Platform.OS === 'android' ? insets.top : 0 }
    ]}>
      <View style={[styles.header, isDarkMode && styles.darkHeader]}>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>Dashboard</Text>
        
        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          {filterOptions.map((option) => (
            <Pressable
              key={option.id}
              style={[
                styles.filterTab,
                selectedFilter === option.id && styles.selectedFilterTab,
                isDarkMode && selectedFilter === option.id && styles.darkSelectedFilterTab
              ]}
              onPress={() => setSelectedFilter(option.id)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  selectedFilter === option.id && styles.selectedFilterTabText,
                  isDarkMode && styles.darkFilterTabText,
                  isDarkMode && selectedFilter === option.id && styles.darkSelectedFilterTabText
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Overview - Only show in All view */}
        {showAllContent && (
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, isDarkMode && styles.darkCard]}>
              <Ionicons name="flag" size={24} color={isDarkMode ? '#0A84FF' : '#007AFF'} />
              <Text style={[styles.statValue, isDarkMode && styles.darkText]}>{stats.activeIntentions}</Text>
              <Text style={[styles.statLabel, isDarkMode && styles.darkSecondaryText]}>Active Goals</Text>
            </View>
            
            <View style={[styles.statCard, isDarkMode && styles.darkCard]}>
              <Ionicons name="checkmark-circle" size={24} color={isDarkMode ? '#30D158' : '#34C759'} />
              <Text style={[styles.statValue, isDarkMode && styles.darkText]}>{stats.completedToday}</Text>
              <Text style={[styles.statLabel, isDarkMode && styles.darkSecondaryText]}>Completed Today</Text>
            </View>
            
            <View style={[styles.statCard, isDarkMode && styles.darkCard]}>
              <Ionicons name="images" size={24} color={isDarkMode ? '#FF9F0A' : '#FF9500'} />
              <Text style={[styles.statValue, isDarkMode && styles.darkText]}>{sampleMemories.length}</Text>
              <Text style={[styles.statLabel, isDarkMode && styles.darkSecondaryText]}>Memories</Text>
            </View>
            
            <View style={[styles.statCard, isDarkMode && styles.darkCard]}>
              <Ionicons name="sparkles" size={24} color={isDarkMode ? '#BF5AF2' : '#AF52DE'} />
              <Text style={[styles.statValue, isDarkMode && styles.darkText]}>{stats.recentInsights}</Text>
              <Text style={[styles.statLabel, isDarkMode && styles.darkSecondaryText]}>Insights</Text>
            </View>
          </View>
        )}

        {/* Goals Section */}
        {shouldShowGoals && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Goals</Text>
              <Pressable>
                <Text style={styles.seeAllText}>See All</Text>
              </Pressable>
            </View>
            
            {hasGoals ? (
              <View>
                {sampleGoals.map(goal => (
                  <GoalItem key={goal.id} goal={goal} isDarkMode={isDarkMode} />
                ))}
              </View>
            ) : (
              <EmptyGoals isDarkMode={isDarkMode} />
            )}
          </View>
        )}
        
        {/* Memories Section */}
        {shouldShowMemories && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Memories</Text>
              <Pressable>
                <Text style={styles.seeAllText}>See All</Text>
              </Pressable>
            </View>
            
            {hasMemories ? (
              <View>
                {sampleMemories.map(memory => (
                  <MemoryItem key={memory.id} memory={memory} isDarkMode={isDarkMode} />
                ))}
              </View>
            ) : (
              <EmptyMemories isDarkMode={isDarkMode} />
            )}
          </View>
        )}
        
        {/* Lessons Section */}
        {shouldShowLessons && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Lessons & Insights</Text>
              <Pressable>
                <Text style={styles.seeAllText}>See All</Text>
              </Pressable>
            </View>
            
            {hasLessons ? (
              <View>
                {sampleLessons.map(lesson => (
                  <LessonItem key={lesson.id} lesson={lesson} isDarkMode={isDarkMode} />
                ))}
              </View>
            ) : (
              <EmptyLessons isDarkMode={isDarkMode} />
            )}
          </View>
        )}
        
        {/* Only show Today's Reflection in All view or Lessons view */}
        {(showAllContent || selectedFilter === 'lessons') && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Today's Reflection</Text>
            </View>
            
            <Pressable style={[styles.reflectionCard, isDarkMode && styles.darkCard]}>
              <Text style={[styles.reflectionPrompt, isDarkMode && styles.darkSecondaryText]}>
                How are you feeling today? Take a moment to reflect and record your thoughts.
              </Text>
              <View style={styles.reflectionButton}>
                <Text style={styles.reflectionButtonText}>Start Reflection</Text>
              </View>
            </Pressable>
          </View>
        )}
        
        {/* Only show Recent Activities in All view */}
        {showAllContent && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Recent Activities</Text>
              <Pressable>
                <Text style={styles.seeAllText}>See All</Text>
              </Pressable>
            </View>
            
            <View style={[styles.activityCard, isDarkMode && styles.darkCard]}>
              <View style={styles.activityIcon}>
                <Ionicons name="checkmark-circle" size={20} color={isDarkMode ? '#30D158' : '#34C759'} />
              </View>
              <View style={styles.activityContent}>
                <Text style={[styles.activityTitle, isDarkMode && styles.darkText]}>Completed: Morning Workout</Text>
                <Text style={[styles.activityTime, isDarkMode && styles.darkTertiaryText]}>2 hours ago</Text>
              </View>
            </View>
            
            <View style={[styles.activityCard, isDarkMode && styles.darkCard]}>
              <View style={styles.activityIcon}>
                <Ionicons name="add-circle" size={20} color={isDarkMode ? '#0A84FF' : '#007AFF'} />
              </View>
              <View style={styles.activityContent}>
                <Text style={[styles.activityTitle, isDarkMode && styles.darkText]}>Added: Weekly Planning Session</Text>
                <Text style={[styles.activityTime, isDarkMode && styles.darkTertiaryText]}>Yesterday</Text>
              </View>
            </View>
            
            <View style={[styles.activityCard, isDarkMode && styles.darkCard]}>
              <View style={styles.activityIcon}>
                <Ionicons name="sparkles" size={20} color={isDarkMode ? '#BF5AF2' : '#AF52DE'} />
              </View>
              <View style={styles.activityContent}>
                <Text style={[styles.activityTitle, isDarkMode && styles.darkText]}>New Insight: Better Focus After Meditation</Text>
                <Text style={[styles.activityTime, isDarkMode && styles.darkTertiaryText]}>2 days ago</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7', // iOS light background
  },
  darkContainer: {
    backgroundColor: '#121212', // Dark background
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  darkHeader: {
    backgroundColor: '#1C1C1E',
    borderBottomColor: '#2C2C2E',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  selectedFilterTab: {
    backgroundColor: '#007AFF',
  },
  darkSelectedFilterTab: {
    backgroundColor: '#0A84FF',
  },
  filterTabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8E8E93',
  },
  selectedFilterTabText: {
    color: '#FFFFFF',
  },
  darkFilterTabText: {
    color: '#8E8E93',
  },
  darkSelectedFilterTabText: {
    color: '#FFFFFF',
  },
  darkText: {
    color: '#FFFFFF',
  },
  darkSubtitleText: {
    color: '#8E8E93',
  },
  darkSecondaryText: {
    color: '#EBEBF5',
  },
  darkTertiaryText: {
    color: '#8E8E93',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
    gap: 16,
  },
  statCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  darkCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 10,
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  section: {
    marginTop: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  seeAllText: {
    fontSize: 14,
    color: '#007AFF',
  },
  // Empty state styles
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: 'transparent',
  },
  emptyStateIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  emptyStateButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  // Content card styles
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  // Goal item styles
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  priorityIndicator: {
    width: 4,
    height: 16,
    borderRadius: 2,
    marginRight: 12,
  },
  goalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  goalDescription: {
    fontSize: 15,
    color: '#3C3C43',
    marginBottom: 16,
    lineHeight: 20,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalMetrics: {
    flex: 1,
  },
  goalProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E5EA',
    borderRadius: 3,
    overflow: 'hidden',
  },
  goalProgress: {
    height: '100%',
    borderRadius: 3,
  },
  goalProgressText: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 8,
    width: 35,
  },
  goalDeadline: {
    fontSize: 13,
    color: '#8E8E93',
    marginLeft: 10,
  },
  // Memory item styles
  memoryImageContainer: {
    height: 160,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  memoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  memoryContent: {
    gap: 6,
  },
  memoryDate: {
    fontSize: 13,
    color: '#8E8E93',
  },
  memoryTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  memoryDescription: {
    fontSize: 15,
    color: '#3C3C43',
    lineHeight: 20,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 6,
  },
  tag: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  darkTag: {
    backgroundColor: '#2C2C2E',
  },
  tagText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  darkTagText: {
    color: '#D1D1D6',
  },
  // Lesson item styles
  lessonHeader: {
    gap: 8,
  },
  lessonMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lessonDate: {
    fontSize: 14,
    color: '#8E8E93',
  },
  importanceIndicator: {
    flexDirection: 'row',
    gap: 4,
  },
  importanceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  lessonTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  lessonSource: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  // Reflection card styles  
  reflectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  reflectionPrompt: {
    fontSize: 15,
    color: '#3C3C43',
    lineHeight: 20,
    marginBottom: 16,
  },
  reflectionButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  reflectionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  // Activity card styles
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(142, 142, 147, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 13,
    color: '#8E8E93',
  },
}); 