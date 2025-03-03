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
  Image,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';

type FilterOption = 'all' | 'goals' | 'memories' | 'lessons';
type ContentType = 'goal' | 'memory' | 'lesson' | 'reflection' | 'planning' | 'season' | null;

// Helper function to get greeting based on time of day
const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
};

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

const EmptyPriorities = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <View style={styles.emptyPrioritiesContainer}>
    <View style={[styles.emptyStateIconContainer, isDarkMode && { backgroundColor: '#2C2C2E' }]}>
      <Ionicons name="compass" size={36} color={isDarkMode ? '#FF9F0A' : '#FF9500'} />
    </View>
    <Text style={[styles.emptyPrioritiesTitle, isDarkMode && styles.darkText]}>Define Your Focus Areas</Text>
    <Text style={[styles.emptyPrioritiesDescription, isDarkMode && styles.darkSecondaryText]}>
      What life domains need your attention right now? Set high-level focus areas to guide your daily decisions.
    </Text>
    <Pressable style={styles.emptyStateButton}>
      <Text style={styles.emptyStateButtonText}>Set Focus Areas</Text>
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
      <View style={[styles.goalPriorityIndicator, { backgroundColor: goal.priorityColor }]} />
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

const PriorityItem = ({ priority, isDarkMode, isPrimary = false }: { priority: any; isDarkMode: boolean; isPrimary?: boolean }) => (
  <View 
    style={[
      isPrimary ? styles.primaryFocusCard : styles.focusCard, 
      isDarkMode && styles.darkCard,
      isPrimary && { backgroundColor: priority.gradientStart }
    ]}
  >
    {isPrimary && (
      <View style={styles.primaryFocusBadgeContainer}>
        <View style={styles.primaryFocusBadge}>
          <Text style={styles.primaryFocusBadgeText}>Primary Focus</Text>
        </View>
      </View>
    )}
    
    <View style={styles.focusHeader}>
      <View style={[styles.focusCategoryIcon, { backgroundColor: priority.color }]}>
        <Ionicons name={priority.icon} size={isPrimary ? 24 : 18} color="#FFFFFF" />
      </View>
      <View style={styles.focusTitleContainer}>
        <Text style={[
          isPrimary ? styles.primaryFocusTitle : styles.focusTitle, 
          isDarkMode && styles.darkText
        ]}>
          {priority.title}
        </Text>
        <Text style={[
          styles.focusCategory, 
          isDarkMode && styles.darkTertiaryText
        ]}>
          {priority.category}
        </Text>
      </View>
    </View>
    
    {priority.intent && (
      <Text style={[
        isPrimary ? styles.primaryFocusIntent : styles.focusIntent, 
        isDarkMode && styles.darkSecondaryText
      ]}>
        "{priority.intent}"
      </Text>
    )}
    
    {priority.period && (
      <Text style={[
        styles.focusPeriod, 
        isDarkMode && styles.darkTertiaryText,
        isPrimary && styles.primaryFocusPeriod
      ]}>
        Focus period: {priority.period}
      </Text>
    )}
    
    {priority.sacrifices && priority.sacrifices.length > 0 && (
      <View style={styles.sacrificesContainer}>
        <Text style={[
          styles.sacrificesTitle, 
          isDarkMode && styles.darkText,
          isPrimary && styles.primarySacrificesTitle
        ]}>
          Intentional Sacrifices:
        </Text>
        {priority.sacrifices.map((sacrifice: string, index: number) => (
          <View key={index} style={styles.sacrificeItem}>
            <Ionicons 
              name="remove-circle" 
              size={14} 
              color={isPrimary ? "#FFFFFF" : isDarkMode ? "#FF453A" : "#FF3B30"} 
            />
            <Text style={[
              styles.sacrificeText, 
              isDarkMode && styles.darkSecondaryText,
              isPrimary && styles.primarySacrificeText
            ]}>
              {sacrifice}
            </Text>
          </View>
        ))}
      </View>
    )}
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
  
  // State for content form modal
  const [isContentFormVisible, setIsContentFormVisible] = useState(false);
  const [selectedContentType, setSelectedContentType] = useState<ContentType>(null);

  // Function to open the content form
  const openContentForm = () => {
    setSelectedContentType(null);
    setIsContentFormVisible(true);
  };

  // Function to close the content form
  const closeContentForm = () => {
    setIsContentFormVisible(false);
    setSelectedContentType(null);
  };

  // Function to select content type
  const selectContentType = (type: ContentType) => {
    setSelectedContentType(type);
  };

  // Example data for dashboard - would be fetched from actual data sources
  const stats = {
    activeIntentions: 5,
    completedToday: 2,
    upcomingDeadlines: 3,
    recentInsights: 4,
  };

  // User name - would come from user profile
  const userName = "James";
  
  // Get time-appropriate greeting
  const greeting = getGreeting();
  
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

  // Sample priorities (typically would be a subset of goals marked as priority)
  const samplePriorities = [
    {
      id: '1',
      title: 'Complete PhD Research',
      category: 'Career',
      color: '#FF2D55',
      gradientStart: '#FF2D55',
      gradientEnd: '#FF375F',
      icon: 'school',
      intent: 'Deep focus on advancing knowledge in my field',
      period: 'Next 3 months',
      isPrimary: true,
      sacrifices: [
        'Reducing social media time to 30 min/day',
        'Postponing travel plans until completion'
      ]
    },
    {
      id: '2',
      title: 'Physical Wellbeing',
      category: 'Health',
      color: '#30D158',
      icon: 'fitness',
      period: 'Ongoing',
      sacrifices: ['Morning Netflix sessions', 'Late night snacking']
    },
    {
      id: '3',
      title: 'Family Connections',
      category: 'Relationships',
      color: '#5E5CE6',
      icon: 'people',
      period: 'Weekly',
      intent: 'Nurture what matters most'
    },
    {
      id: '4',
      title: 'Mindfulness Practice',
      category: 'Personal Growth',
      color: '#BF5AF2',
      icon: 'leaf',
      period: 'Daily'
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
  const hasPriorities = samplePriorities.length > 0;
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
        {/* Personalized Greeting and Focus Areas - Only show in All view */}
        {showAllContent && (
          <>
            <View style={styles.greetingContainer}>
              <Text style={[styles.greeting, isDarkMode && styles.darkText]}>
                {greeting}, {userName}
              </Text>
              <Text style={[styles.greetingSubtext, isDarkMode && styles.darkSecondaryText]}>
                Focus on what truly matters
              </Text>
            </View>

            {/* Focus Areas Section */}
            <View style={styles.focusAreasSection}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
                  Focus Areas
                </Text>
                <Pressable>
                  <Text style={styles.seeAllText}>Manage</Text>
                </Pressable>
              </View>
              
              {hasPriorities ? (
                <View>
                  {/* Primary Focus */}
                  {samplePriorities.filter(p => p.isPrimary).map(priority => (
                    <PriorityItem 
                      key={priority.id} 
                      priority={priority} 
                      isPrimary={true}
                      isDarkMode={isDarkMode} 
                    />
                  ))}
                  
                  {/* Secondary Focus Areas */}
                  <Text style={[styles.secondaryFocusHeading, isDarkMode && styles.darkSecondaryText]}>
                    Supporting Focus Areas
                  </Text>
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.secondaryFocusScrollContent}
                  >
                    {samplePriorities.filter(p => !p.isPrimary).map(priority => (
                      <PriorityItem 
                        key={priority.id} 
                        priority={priority} 
                        isDarkMode={isDarkMode} 
                      />
                    ))}
                  </ScrollView>
                </View>
              ) : (
                <EmptyPriorities isDarkMode={isDarkMode} />
              )}
            </View>
          </>
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

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={[
          styles.fab, 
          isDarkMode && styles.fabDark,
          { bottom: insets.bottom + 16 }
        ]} 
        onPress={openContentForm}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* New Content Form Modal */}
      <Modal
        visible={isContentFormVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeContentForm}
      >
        <TouchableWithoutFeedback onPress={closeContentForm}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        
        <View style={[
          styles.modalContainer, 
          isDarkMode && styles.modalContainerDark,
          { paddingBottom: insets.bottom + 20 }
        ]}>
          <View style={styles.modalHandle} />
          
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>
              Create New Content
            </Text>
            <TouchableOpacity onPress={closeContentForm}>
              <Ionicons 
                name="close" 
                size={24} 
                color={isDarkMode ? '#FFFFFF' : '#000000'} 
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.contentTypeSelector}>
            <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>
              Content Type
            </Text>
            <View style={styles.contentTypeButtons}>
              <TouchableOpacity 
                style={[
                  styles.contentTypeButton,
                  selectedContentType === 'goal' && styles.selectedContentTypeButton,
                  isDarkMode && styles.contentTypeButtonDark,
                  selectedContentType === 'goal' && isDarkMode && styles.selectedContentTypeButtonDark
                ]}
                onPress={() => selectContentType('goal')}
              >
                <Ionicons 
                  name="flag" 
                  size={20} 
                  color={selectedContentType === 'goal' ? '#FFFFFF' : isDarkMode ? '#FFFFFF' : '#007AFF'} 
                />
                <Text 
                  style={[
                    styles.contentTypeText,
                    selectedContentType === 'goal' && styles.selectedContentTypeText,
                    isDarkMode && styles.darkText
                  ]}
                >
                  Goal
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.contentTypeButton,
                  selectedContentType === 'memory' && styles.selectedContentTypeButton,
                  isDarkMode && styles.contentTypeButtonDark,
                  selectedContentType === 'memory' && isDarkMode && styles.selectedContentTypeButtonDark
                ]}
                onPress={() => selectContentType('memory')}
              >
                <Ionicons 
                  name="images" 
                  size={20} 
                  color={selectedContentType === 'memory' ? '#FFFFFF' : isDarkMode ? '#FFFFFF' : '#30D158'} 
                />
                <Text 
                  style={[
                    styles.contentTypeText,
                    selectedContentType === 'memory' && styles.selectedContentTypeText,
                    isDarkMode && styles.darkText
                  ]}
                >
                  Memory
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.contentTypeButton,
                  selectedContentType === 'lesson' && styles.selectedContentTypeButton,
                  isDarkMode && styles.contentTypeButtonDark,
                  selectedContentType === 'lesson' && isDarkMode && styles.selectedContentTypeButtonDark
                ]}
                onPress={() => selectContentType('lesson')}
              >
                <Ionicons 
                  name="sparkles" 
                  size={20} 
                  color={selectedContentType === 'lesson' ? '#FFFFFF' : isDarkMode ? '#FFFFFF' : '#BF5AF2'} 
                />
                <Text 
                  style={[
                    styles.contentTypeText,
                    selectedContentType === 'lesson' && styles.selectedContentTypeText,
                    isDarkMode && styles.darkText
                  ]}
                >
                  Lesson
                </Text>
              </TouchableOpacity>
            </View>
            
            {/* Additional content types row */}
            <View style={[styles.contentTypeButtons, { marginTop: 12 }]}>
              <TouchableOpacity 
                style={[
                  styles.contentTypeButton,
                  selectedContentType === 'reflection' && styles.selectedContentTypeButton,
                  isDarkMode && styles.contentTypeButtonDark,
                  selectedContentType === 'reflection' && isDarkMode && styles.selectedContentTypeButtonDark
                ]}
                onPress={() => selectContentType('reflection')}
              >
                <Ionicons 
                  name="journal" 
                  size={20} 
                  color={selectedContentType === 'reflection' ? '#FFFFFF' : isDarkMode ? '#FFFFFF' : '#FF9500'} 
                />
                <Text 
                  style={[
                    styles.contentTypeText,
                    selectedContentType === 'reflection' && styles.selectedContentTypeText,
                    isDarkMode && styles.darkText
                  ]}
                >
                  Reflection
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.contentTypeButton,
                  selectedContentType === 'planning' && styles.selectedContentTypeButton,
                  isDarkMode && styles.contentTypeButtonDark,
                  selectedContentType === 'planning' && isDarkMode && styles.selectedContentTypeButtonDark
                ]}
                onPress={() => selectContentType('planning')}
              >
                <Ionicons 
                  name="calendar" 
                  size={20} 
                  color={selectedContentType === 'planning' ? '#FFFFFF' : isDarkMode ? '#FFFFFF' : '#5856D6'} 
                />
                <Text 
                  style={[
                    styles.contentTypeText,
                    selectedContentType === 'planning' && styles.selectedContentTypeText,
                    isDarkMode && styles.darkText
                  ]}
                >
                  Planning
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.contentTypeButton,
                  selectedContentType === 'season' && styles.selectedContentTypeButton,
                  isDarkMode && styles.contentTypeButtonDark,
                  selectedContentType === 'season' && isDarkMode && styles.selectedContentTypeButtonDark
                ]}
                onPress={() => selectContentType('season')}
              >
                <Ionicons 
                  name="leaf" 
                  size={20} 
                  color={selectedContentType === 'season' ? '#FFFFFF' : isDarkMode ? '#FFFFFF' : '#FF2D55'} 
                />
                <Text 
                  style={[
                    styles.contentTypeText,
                    selectedContentType === 'season' && styles.selectedContentTypeText,
                    isDarkMode && styles.darkText
                  ]}
                >
                  Season
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Dynamic form fields based on content type */}
          {selectedContentType === 'goal' && (
            <View style={styles.formFields}>
              <View style={styles.formField}>
                <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>Title</Text>
                <TextInput
                  style={[styles.textInput, isDarkMode && styles.textInputDark]}
                  placeholder="What do you want to achieve?"
                  placeholderTextColor={isDarkMode ? '#8E8E93' : '#C7C7CC'}
                />
              </View>
              
              <View style={styles.formField}>
                <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>Category</Text>
                <TextInput
                  style={[styles.textInput, isDarkMode && styles.textInputDark]}
                  placeholder="e.g., Career, Health, Personal Growth"
                  placeholderTextColor={isDarkMode ? '#8E8E93' : '#C7C7CC'}
                />
              </View>
              
              <View style={styles.formField}>
                <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>Intent</Text>
                <TextInput
                  style={[styles.textInput, isDarkMode && styles.textInputDark]}
                  placeholder="Why is this important to you?"
                  placeholderTextColor={isDarkMode ? '#8E8E93' : '#C7C7CC'}
                  multiline
                />
              </View>
            </View>
          )}
          
          {selectedContentType === 'memory' && (
            <View style={styles.formFields}>
              <View style={styles.formField}>
                <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>Title</Text>
                <TextInput
                  style={[styles.textInput, isDarkMode && styles.textInputDark]}
                  placeholder="Name this memory"
                  placeholderTextColor={isDarkMode ? '#8E8E93' : '#C7C7CC'}
                />
              </View>
              
              <View style={styles.formField}>
                <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>Description</Text>
                <TextInput
                  style={[styles.textArea, isDarkMode && styles.textInputDark]}
                  placeholder="Describe what happened..."
                  placeholderTextColor={isDarkMode ? '#8E8E93' : '#C7C7CC'}
                  multiline
                />
              </View>
              
              <View style={styles.formField}>
                <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>Tags</Text>
                <TextInput
                  style={[styles.textInput, isDarkMode && styles.textInputDark]}
                  placeholder="Add comma-separated tags"
                  placeholderTextColor={isDarkMode ? '#8E8E93' : '#C7C7CC'}
                />
              </View>
            </View>
          )}
          
          {selectedContentType === 'lesson' && (
            <View style={styles.formFields}>
              <View style={styles.formField}>
                <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>Lesson Title</Text>
                <TextInput
                  style={[styles.textInput, isDarkMode && styles.textInputDark]}
                  placeholder="What did you learn?"
                  placeholderTextColor={isDarkMode ? '#8E8E93' : '#C7C7CC'}
                />
              </View>
              
              <View style={styles.formField}>
                <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>Source</Text>
                <TextInput
                  style={[styles.textInput, isDarkMode && styles.textInputDark]}
                  placeholder="Where/how did you learn this?"
                  placeholderTextColor={isDarkMode ? '#8E8E93' : '#C7C7CC'}
                />
              </View>
              
              <View style={styles.formField}>
                <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>Importance</Text>
                <View style={styles.importanceSelector}>
                  {[1, 2, 3, 4, 5].map(value => (
                    <TouchableOpacity 
                      key={value} 
                      style={[
                        styles.importanceDot, 
                        { backgroundColor: isDarkMode ? '#BF5AF2' : '#AF52DE', opacity: value <= 3 ? 1 : 0.3 }
                      ]}
                    />
                  ))}
                </View>
              </View>
            </View>
          )}
          
          {/* New form for Reflection type */}
          {selectedContentType === 'reflection' && (
            <View style={styles.formFields}>
              <View style={styles.formField}>
                <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>How are you feeling?</Text>
                <View style={styles.moodSelector}>
                  {['😔', '😐', '🙂', '😊', '😄'].map((emoji, index) => (
                    <TouchableOpacity 
                      key={index} 
                      style={[
                        styles.moodOption,
                        index === 2 && styles.selectedMoodOption,
                        isDarkMode && styles.moodOptionDark
                      ]}
                    >
                      <Text style={styles.moodEmoji}>{emoji}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.formField}>
                <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>Today's Highlights</Text>
                <TextInput
                  style={[styles.textArea, isDarkMode && styles.textInputDark]}
                  placeholder="What went well today?"
                  placeholderTextColor={isDarkMode ? '#8E8E93' : '#C7C7CC'}
                  multiline
                />
              </View>
              
              <View style={styles.formField}>
                <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>Challenges</Text>
                <TextInput
                  style={[styles.textArea, isDarkMode && styles.textInputDark]}
                  placeholder="What could have gone better?"
                  placeholderTextColor={isDarkMode ? '#8E8E93' : '#C7C7CC'}
                  multiline
                />
              </View>
              
              <View style={styles.formField}>
                <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>Gratitude</Text>
                <TextInput
                  style={[styles.textInput, isDarkMode && styles.textInputDark]}
                  placeholder="What are you grateful for today?"
                  placeholderTextColor={isDarkMode ? '#8E8E93' : '#C7C7CC'}
                />
              </View>
            </View>
          )}
          
          {/* New form for Planning type */}
          {selectedContentType === 'planning' && (
            <View style={styles.formFields}>
              <View style={styles.formField}>
                <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>Tomorrow's Date</Text>
                <TextInput
                  style={[styles.textInput, isDarkMode && styles.textInputDark]}
                  placeholder="MM/DD/YYYY"
                  placeholderTextColor={isDarkMode ? '#8E8E93' : '#C7C7CC'}
                />
              </View>
              
              <View style={styles.formField}>
                <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>Top 3 Priorities</Text>
                <TextInput
                  style={[styles.textInput, isDarkMode && styles.textInputDark]}
                  placeholder="Priority #1"
                  placeholderTextColor={isDarkMode ? '#8E8E93' : '#C7C7CC'}
                />
                <View style={{ height: 8 }} />
                <TextInput
                  style={[styles.textInput, isDarkMode && styles.textInputDark]}
                  placeholder="Priority #2"
                  placeholderTextColor={isDarkMode ? '#8E8E93' : '#C7C7CC'}
                />
                <View style={{ height: 8 }} />
                <TextInput
                  style={[styles.textInput, isDarkMode && styles.textInputDark]}
                  placeholder="Priority #3"
                  placeholderTextColor={isDarkMode ? '#8E8E93' : '#C7C7CC'}
                />
              </View>
              
              <View style={styles.formField}>
                <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>Potential Challenges</Text>
                <TextInput
                  style={[styles.textArea, isDarkMode && styles.textInputDark]}
                  placeholder="What challenges might you face tomorrow?"
                  placeholderTextColor={isDarkMode ? '#8E8E93' : '#C7C7CC'}
                  multiline
                />
              </View>
            </View>
          )}
          
          {/* New form for Season type */}
          {selectedContentType === 'season' && (
            <View style={styles.formFields}>
              <View style={styles.formField}>
                <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>Season Name</Text>
                <TextInput
                  style={[styles.textInput, isDarkMode && styles.textInputDark]}
                  placeholder="Give this season of life a name"
                  placeholderTextColor={isDarkMode ? '#8E8E93' : '#C7C7CC'}
                />
              </View>
              
              <View style={styles.formField}>
                <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>Timeframe</Text>
                <View style={styles.dateRangeContainer}>
                  <TextInput
                    style={[styles.dateInput, isDarkMode && styles.textInputDark]}
                    placeholder="Start date"
                    placeholderTextColor={isDarkMode ? '#8E8E93' : '#C7C7CC'}
                  />
                  <Text style={[styles.dateRangeSeparator, isDarkMode && styles.darkText]}>to</Text>
                  <TextInput
                    style={[styles.dateInput, isDarkMode && styles.textInputDark]}
                    placeholder="End date"
                    placeholderTextColor={isDarkMode ? '#8E8E93' : '#C7C7CC'}
                  />
                </View>
              </View>
              
              <View style={styles.formField}>
                <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>Season Theme</Text>
                <TextInput
                  style={[styles.textInput, isDarkMode && styles.textInputDark]}
                  placeholder="What defines this season? (e.g., Growth, Transition)"
                  placeholderTextColor={isDarkMode ? '#8E8E93' : '#C7C7CC'}
                />
              </View>
              
              <View style={styles.formField}>
                <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>Description</Text>
                <TextInput
                  style={[styles.textArea, isDarkMode && styles.textInputDark]}
                  placeholder="Describe this season of life..."
                  placeholderTextColor={isDarkMode ? '#8E8E93' : '#C7C7CC'}
                  multiline
                />
              </View>
            </View>
          )}
          
          {selectedContentType && (
            <TouchableOpacity 
              style={[styles.saveButton, { backgroundColor: 
                selectedContentType === 'goal' ? '#007AFF' : 
                selectedContentType === 'memory' ? '#30D158' :
                selectedContentType === 'lesson' ? '#BF5AF2' :
                selectedContentType === 'reflection' ? '#FF9500' :
                selectedContentType === 'planning' ? '#5856D6' :
                selectedContentType === 'season' ? '#FF2D55' : '#007AFF'
              }]}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          )}
        </View>
      </Modal>
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
  darkCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
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
  // Greeting styles
  greetingContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 6,
  },
  greetingSubtext: {
    fontSize: 17,
    color: '#8E8E93',
  },
  // Priorities section
  focusAreasSection: {
    marginTop: 4,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  // Priority card styles
  primaryFocusCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  focusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: 240,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  secondaryFocusHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
    marginVertical: 12,
  },
  secondaryFocusScrollContent: {
    paddingBottom: 8,
    paddingRight: 16,
  },
  focusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  focusCategoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  focusTitleContainer: {
    flex: 1,
  },
  focusTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  primaryFocusTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  focusCategory: {
    fontSize: 14,
    color: '#8E8E93',
  },
  focusIntent: {
    fontSize: 15,
    fontStyle: 'italic',
    color: '#3C3C43',
    marginBottom: 12,
    lineHeight: 20,
  },
  primaryFocusIntent: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#FFFFFF',
    marginBottom: 16,
    lineHeight: 22,
    opacity: 0.9,
  },
  focusPeriod: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 6,
  },
  primaryFocusPeriod: {
    color: '#FFFFFF',
    opacity: 0.85,
  },
  primaryFocusBadgeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  primaryFocusBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  primaryFocusBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  sacrificesContainer: {
    marginTop: 12,
  },
  sacrificesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  primarySacrificesTitle: {
    color: '#FFFFFF',
    opacity: 0.9,
  },
  sacrificeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  sacrificeText: {
    fontSize: 14,
    color: '#3C3C43',
    marginLeft: 6,
    flex: 1,
  },
  primarySacrificeText: {
    color: '#FFFFFF',
    opacity: 0.85,
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
  // Goal priority indicator (renamed to avoid conflict)
  goalPriorityIndicator: {
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
  // Empty priorities styles
  emptyPrioritiesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'transparent',
  },
  emptyPrioritiesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyPrioritiesDescription: {
    fontSize: 15,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  // FAB Styles
  fab: {
    position: 'absolute',
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    zIndex: 1000,
  },
  fabDark: {
    backgroundColor: '#0A84FF',
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 20,
  },
  modalContainerDark: {
    backgroundColor: '#1C1C1E',
  },
  modalHandle: {
    alignSelf: 'center',
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E5E5EA',
    marginBottom: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  
  // Content Type Selector
  contentTypeSelector: {
    marginBottom: 20,
  },
  contentTypeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  contentTypeButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingVertical: 12,
    marginHorizontal: 4,
  },
  contentTypeButtonDark: {
    backgroundColor: '#2C2C2E',
  },
  selectedContentTypeButton: {
    backgroundColor: '#007AFF',
  },
  selectedContentTypeButtonDark: {
    backgroundColor: '#0A84FF',
  },
  contentTypeText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginLeft: 6,
  },
  selectedContentTypeText: {
    color: '#FFFFFF',
  },
  
  // Form Fields
  formFields: {
    marginBottom: 20,
  },
  formField: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#000',
  },
  textInputDark: {
    backgroundColor: '#2C2C2E',
    color: '#FFFFFF',
  },
  textArea: {
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#000',
    height: 100,
    textAlignVertical: 'top',
  },
  importanceSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 40,
  },
  
  // Save Button
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Mood selector styles
  moodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 8,
  },
  moodOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  moodOptionDark: {
    backgroundColor: '#2C2C2E',
  },
  selectedMoodOption: {
    borderColor: '#007AFF',
  },
  moodEmoji: {
    fontSize: 24,
  },
  
  // Date range picker styles
  dateRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateInput: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#000',
  },
  dateRangeSeparator: {
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#8E8E93',
  },
}); 