import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  useColorScheme,
  Platform,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../theme';
import { useStyles } from '../hooks';

// Import our new components
import { HomeHeader } from '../components/home/HomeHeader';
import { HomeSection } from '../components/home/HomeSection';
import { FilterOption } from '../components/home/FilterTabs';
import { ContentForm, ContentType, FormData } from '../components/home/ContentForm';
import { TimePrioritizedSections } from '../components/home/TimePrioritizedSections';

// Import our content item components
import { 
  GoalItem, Goal,
  MemoryItem, Memory,
  LessonItem, Lesson,
  Priority
} from '../components/home/content-items';

// Import our empty state components
import {
  EmptyGoals,
  EmptyMemories,
  EmptyLessons
} from '../components/home/empty-states';

// Helper function to get greeting based on time of day
const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
};

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const { state } = useAppContext();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  
  // State for filter selection
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('all');
  
  // State for content form modal
  const [isContentFormVisible, setIsContentFormVisible] = useState(false);

  // Function to open the content form
  const openContentForm = () => {
    setIsContentFormVisible(true);
  };

  // Function to close the content form
  const closeContentForm = () => {
    setIsContentFormVisible(false);
  };

  const styles = useStyles(theme => ({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 100, // Space for FAB
    },
    greetingContainer: {
      paddingHorizontal: theme.spacing.screenPadding, // Match HomeSection padding
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.xs, // Reduced bottom padding for better flow
    },
    greeting: {
      fontSize: theme.typography.sizes.xl,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.xs,
    },
    greetingSubtext: {
      fontSize: theme.typography.sizes.md,
      color: theme.colors.text.secondary,
    },
    reflectionCard: {
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borders.radius.lg,
      padding: theme.spacing.lg,
      marginTop: theme.spacing.md,
    },
    reflectionPrompt: {
      fontSize: theme.typography.sizes.md,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
      lineHeight: 22,
    },
    reflectionButton: {
      backgroundColor: theme.colors.accent,
      alignSelf: 'center',
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borders.radius.md,
    },
    reflectionButtonText: {
      color: theme.colors.text.inverse,
      fontWeight: theme.typography.weights.semibold,
      fontSize: theme.typography.sizes.md,
    },
    fab: {
      position: 'absolute',
      right: theme.spacing.md,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme.isDark ? 0.3 : 0.2,
      shadowRadius: 4,
      elevation: 5,
    },
  }));

  // Function to handle saving of content from the form
  const handleSaveContent = (data: FormData, type: ContentType) => {
    console.log('Saving content:', type, data);
    
    // Here you would normally save the data to your backend or local storage
    // For this demo, we'll just show a confirmation
    
    // Close the form
    closeContentForm();
    
    // You could add the new content to your local state if needed
    // For example, for a new goal:
    if (type === 'goal' && data.title) {
      // Determine priority color based on priorityLevel
      let priorityColor = '#FF9F0A'; // Default color (medium)
      
      if (data.priorityLevel === 'low') {
        priorityColor = '#30D158'; // Green for low priority
      } else if (data.priorityLevel === 'high') {
        priorityColor = '#FF453A'; // Red for high priority
      }
      
      // Set initial progress (default to 0 if not provided)
      const progress = data.progress !== undefined ? data.progress : 0;
      
      // Here you would create and add a new goal to your state
      // This is just an example and won't actually update the display
      const newGoal: Goal = {
        id: Date.now().toString(), // Simple temporary ID
        title: data.title,
        description: data.description || '',
        progress: progress, // Use the specified initial progress
        priorityColor: priorityColor, // Color based on priority
        deadline: data.deadline,
        // Additional goal fields
        category: data.category,
        intent: data.intent,
        focusArea: data.focusArea,
        priorityLevel: data.priorityLevel as 'low' | 'medium' | 'high',
        trackingMethod: data.trackingMethod as 'percentage' | 'binary' | 'milestone',
      };
      
      console.log('New goal created:', newGoal);
      // In a real app, you would add it to state:
      // setGoals(prevGoals => [...prevGoals, newGoal]);
    }
  };

  // User name - would come from user profile
  const userName = "James";
  
  // Get time-appropriate greeting
  const greeting = getGreeting();

  // Sample data
  const sampleGoals: Goal[] = [
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
  const samplePriorities: Priority[] = [
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

  const sampleMemories: Memory[] = [
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

  const sampleLessons: Lesson[] = [
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

  // Handle filter selection
  const handleFilterSelect = (filter: FilterOption) => {
    setSelectedFilter(filter);
  };

  return (
    <SafeAreaView style={[
      styles.container, 
      { paddingTop: Platform.OS === 'android' ? insets.top : 0 }
    ]}>
      <HomeHeader 
        selectedFilter={selectedFilter} 
        onSelectFilter={handleFilterSelect}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Personalized Greeting - Always show this */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>
            {greeting}, {userName}
          </Text>
          <Text style={styles.greetingSubtext}>
            Focus on what truly matters
          </Text>
        </View>
    
        {/* All View: Use TimePrioritizedSections component */}
        {showAllContent ? (
          <TimePrioritizedSections
            goals={sampleGoals}
            memories={sampleMemories}
            lessons={sampleLessons}
            priorities={samplePriorities}
            onManagePriorities={() => console.log('Manage priorities')}
            onSeeAllGoals={() => console.log('See all goals')}
            onSeeAllMemories={() => console.log('See all memories')}
            onSeeAllLessons={() => console.log('See all lessons')}
            onStartReflection={() => console.log('Start reflection')}
          />
        ) : (
          // Filtered Views: Show regular sections
          <>
            {/* Goals Section */}
            {shouldShowGoals && (
              <HomeSection 
                title="Goals" 
                onSeeAllPress={() => console.log('See all goals')}
              >
                {hasGoals ? (
                  <View>
                    {sampleGoals.map(goal => (
                      <GoalItem key={goal.id} goal={goal} />
                    ))}
                  </View>
                ) : (
                  <EmptyGoals />
                )}
              </HomeSection>
            )}
            
            {/* Memories Section */}
            {shouldShowMemories && (
              <HomeSection 
                title="Memories" 
                onSeeAllPress={() => console.log('See all memories')}
              >
                {hasMemories ? (
                  <View>
                    {sampleMemories.map(memory => (
                      <MemoryItem key={memory.id} memory={memory} />
                    ))}
                  </View>
                ) : (
                  <EmptyMemories />
                )}
              </HomeSection>
            )}
            
            {/* Lessons Section */}
            {shouldShowLessons && (
              <HomeSection 
                title="Lessons & Insights" 
                onSeeAllPress={() => console.log('See all lessons')}
              >
                {hasLessons ? (
                  <View>
                    {sampleLessons.map(lesson => (
                      <LessonItem key={lesson.id} lesson={lesson} />
                    ))}
                  </View>
                ) : (
                  <EmptyLessons />
                )}
              </HomeSection>
            )}
            
            {/* Today's Reflection in Lessons view */}
            {selectedFilter === 'lessons' && (
              <HomeSection 
                title="Today's Reflection" 
                showSeeAll={false}
              >
                <View style={styles.reflectionCard}>
                  <Text style={styles.reflectionPrompt}>
                    How are you feeling today? Take a moment to reflect and record your thoughts.
                  </Text>
                  <TouchableOpacity style={styles.reflectionButton}>
                    <Text style={styles.reflectionButtonText}>Start Reflection</Text>
                  </TouchableOpacity>
                </View>
              </HomeSection>
            )}
          </>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={[
          styles.fab, 
          { bottom: insets.bottom + 16 }
        ]} 
        onPress={openContentForm}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={24} color={theme.colors.text.inverse} />
      </TouchableOpacity>

      {/* Content Form Modal */}
      <ContentForm 
        visible={isContentFormVisible}
        onClose={closeContentForm}
        onSave={handleSaveContent}
      />
    </SafeAreaView>
  );
} 