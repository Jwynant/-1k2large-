import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  useColorScheme,
  Platform,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';

// Import our new components
import { HomeHeader } from '../components/home/HomeHeader';
import { FocusAreas } from '../components/home/FocusAreas';
import { HomeSection } from '../components/home/HomeSection';
import { FilterOption } from '../components/home/FilterTabs';
import { ContentForm, ContentType, FormData } from '../components/home/ContentForm';

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
  const isDarkMode = state.theme === 'light' ? false : colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  
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
      isDarkMode && styles.darkContainer,
      { paddingTop: Platform.OS === 'android' ? insets.top : 0 }
    ]}>
      <HomeHeader 
        selectedFilter={selectedFilter} 
        onSelectFilter={handleFilterSelect}
        isDarkMode={isDarkMode}
      />
      
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
            <FocusAreas 
              priorities={samplePriorities}
              isDarkMode={isDarkMode}
              onManagePress={() => console.log('Manage priorities')}
            />
          </>
        )}

        {/* Goals Section */}
        {shouldShowGoals && (
          <HomeSection 
            title="Goals" 
            isDarkMode={isDarkMode}
            onSeeAllPress={() => console.log('See all goals')}
          >
            {hasGoals ? (
              <View>
                {sampleGoals.map(goal => (
                  <GoalItem key={goal.id} goal={goal} isDarkMode={isDarkMode} />
                ))}
              </View>
            ) : (
              <EmptyGoals isDarkMode={isDarkMode} />
            )}
          </HomeSection>
        )}
        
        {/* Memories Section */}
        {shouldShowMemories && (
          <HomeSection 
            title="Memories" 
            isDarkMode={isDarkMode}
            onSeeAllPress={() => console.log('See all memories')}
          >
            {hasMemories ? (
              <View>
                {sampleMemories.map(memory => (
                  <MemoryItem key={memory.id} memory={memory} isDarkMode={isDarkMode} />
                ))}
              </View>
            ) : (
              <EmptyMemories isDarkMode={isDarkMode} />
            )}
          </HomeSection>
        )}
        
        {/* Lessons Section */}
        {shouldShowLessons && (
          <HomeSection 
            title="Lessons & Insights" 
            isDarkMode={isDarkMode}
            onSeeAllPress={() => console.log('See all lessons')}
          >
            {hasLessons ? (
              <View>
                {sampleLessons.map(lesson => (
                  <LessonItem key={lesson.id} lesson={lesson} isDarkMode={isDarkMode} />
                ))}
              </View>
            ) : (
              <EmptyLessons isDarkMode={isDarkMode} />
            )}
          </HomeSection>
        )}
        
        {/* Only show Today's Reflection in All view or Lessons view */}
        {(showAllContent || selectedFilter === 'lessons') && (
          <HomeSection 
            title="Today's Reflection" 
            isDarkMode={isDarkMode}
            showSeeAll={false}
          >
            <View style={[styles.reflectionCard, isDarkMode && styles.darkCard]}>
              <Text style={[styles.reflectionPrompt, isDarkMode && styles.darkSecondaryText]}>
                How are you feeling today? Take a moment to reflect and record your thoughts.
              </Text>
              <View style={styles.reflectionButton}>
                <Text style={styles.reflectionButtonText}>Start Reflection</Text>
              </View>
            </View>
          </HomeSection>
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

      {/* Content Form Modal */}
      <ContentForm 
        visible={isContentFormVisible}
        onClose={closeContentForm}
        isDarkMode={isDarkMode}
        onSave={handleSaveContent}
      />
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
  darkText: {
    color: '#FFFFFF',
  },
  darkSecondaryText: {
    color: '#EBEBF5',
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
}); 