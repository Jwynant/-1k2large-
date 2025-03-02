import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  SectionList, 
  Pressable, 
  useColorScheme,
  useWindowDimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Goal, Priority, SortOption, TimeframeCategory } from './types';
import GoalCard from './GoalCard';

type GoalListProps = {
  goals: Goal[];
  priorities: Priority[];
  onGoalPress?: (goalId: string) => void;
  showSections?: boolean;
  showSortOptions?: boolean;
};

/**
 * A unified goal list component with smart sorting and filtering
 */
export default function GoalList({
  goals,
  priorities,
  onGoalPress,
  showSections = true,
  showSortOptions = true,
}: GoalListProps) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const { width } = useWindowDimensions();
  
  // State for sorting
  const [sortOption, setSortOption] = useState<SortOption>('priority');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    today: true,
    thisWeek: true,
    thisMonth: true,
    future: true,
    completed: false,
  });
  
  // Get priority details by ID
  const getPriorityById = (priorityId: string): Priority => {
    return priorities.find(p => p.id === priorityId) || {
      id: 'unknown',
      title: 'Unknown',
      level: 'low',
      goals: [],
      color: '#8E8E93',
      icon: 'help-circle',
      sortOrder: 999,
    };
  };
  
  // Helper to categorize goals by timeframe
  const categorizeGoals = (goalsList: Goal[]): Record<TimeframeCategory, Goal[]> => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    
    const nextWeek = new Date(now);
    nextWeek.setDate(now.getDate() + 7);
    
    const nextMonth = new Date(now);
    nextMonth.setMonth(now.getMonth() + 1);
    
    return {
      today: goalsList.filter(goal => {
        if (goal.status === 'completed' || goal.status === 'abandoned') return false;
        if (!goal.deadline) return false;
        const deadlineDate = new Date(goal.deadline);
        return deadlineDate.toDateString() === now.toDateString();
      }),
      thisWeek: goalsList.filter(goal => {
        if (goal.status === 'completed' || goal.status === 'abandoned') return false;
        if (!goal.deadline) return false;
        const deadlineDate = new Date(goal.deadline);
        return deadlineDate > tomorrow && 
               deadlineDate <= nextWeek && 
               deadlineDate.toDateString() !== now.toDateString();
      }),
      thisMonth: goalsList.filter(goal => {
        if (goal.status === 'completed' || goal.status === 'abandoned') return false;
        if (!goal.deadline) return false;
        const deadlineDate = new Date(goal.deadline);
        return deadlineDate > nextWeek && deadlineDate <= nextMonth;
      }),
      future: goalsList.filter(goal => {
        if (goal.status === 'completed' || goal.status === 'abandoned') return false;
        if (!goal.deadline) return true; // No deadline = future/ongoing
        const deadlineDate = new Date(goal.deadline);
        return deadlineDate > nextMonth;
      }),
      completed: goalsList.filter(goal => goal.status === 'completed')
    };
  };
  
  // Sort goals based on current sort option
  const sortGoals = (goalsList: Goal[]): Goal[] => {
    return [...goalsList].sort((a, b) => {
      switch (sortOption) {
        case 'deadline':
          // Sort by deadline (earliest first), then by priority level
          if (!a.deadline && !b.deadline) {
            return getPriorityLevelValue(getPriorityById(b.priorityId).level) - 
                   getPriorityLevelValue(getPriorityById(a.priorityId).level);
          }
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          
          const dateA = new Date(a.deadline);
          const dateB = new Date(b.deadline);
          if (dateA.getTime() === dateB.getTime()) {
            return getPriorityLevelValue(getPriorityById(b.priorityId).level) - 
                   getPriorityLevelValue(getPriorityById(a.priorityId).level);
          }
          return dateA.getTime() - dateB.getTime();
          
        case 'priority':
          // Sort by priority level (high to low), then by deadline if available
          const priorityDiff = getPriorityLevelValue(getPriorityById(b.priorityId).level) - 
                              getPriorityLevelValue(getPriorityById(a.priorityId).level);
          
          if (priorityDiff === 0 && a.deadline && b.deadline) {
            return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
          }
          return priorityDiff;
          
        case 'progress':
          // Sort by progress (highest first)
          return b.progress - a.progress;
          
        case 'impact':
          // Sort by impact level (high to low)
          return getImpactValue(b.impact) - getImpactValue(a.impact);
          
        case 'title':
          // Sort alphabetically by title
          return a.title.localeCompare(b.title);
          
        case 'created':
          // Sort by creation date (newest first)
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          
        default:
          return 0;
      }
    });
  };
  
  // Helper to get numeric value for priority levels
  const getPriorityLevelValue = (level: string): number => {
    switch (level) {
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 0;
    }
  };
  
  // Helper to get numeric value for impact levels
  const getImpactValue = (impact: string): number => {
    switch (impact) {
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 0;
    }
  };
  
  // Create the sections data for SectionList
  const sections = useMemo(() => {
    const categorized = categorizeGoals(goals);
    
    return [
      {
        key: 'today',
        title: 'Today',
        data: sortGoals(categorized.today),
        isExpanded: expandedSections.today,
      },
      {
        key: 'thisWeek',
        title: 'This Week',
        data: sortGoals(categorized.thisWeek),
        isExpanded: expandedSections.thisWeek,
      },
      {
        key: 'thisMonth',
        title: 'This Month',
        data: sortGoals(categorized.thisMonth),
        isExpanded: expandedSections.thisMonth,
      },
      {
        key: 'future',
        title: 'Future & Ongoing',
        data: sortGoals(categorized.future),
        isExpanded: expandedSections.future,
      },
      {
        key: 'completed',
        title: 'Completed',
        data: sortGoals(categorized.completed),
        isExpanded: expandedSections.completed,
      },
    ].filter(section => section.data.length > 0);
  }, [goals, sortOption, expandedSections]);
  
  // Toggle a section's expanded state
  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };
  
  // Sort options for the dropdown
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'priority', label: 'Priority' },
    { value: 'deadline', label: 'Deadline' },
    { value: 'progress', label: 'Progress' },
    { value: 'impact', label: 'Impact' },
    { value: 'title', label: 'Title' },
    { value: 'created', label: 'Recently Added' },
  ];
  
  // If showing as a flat list without sections
  if (!showSections) {
    return (
      <View style={styles.container}>
        {showSortOptions && (
          <View style={styles.sortOptionsContainer}>
            <Text style={[styles.sortByText, isDarkMode && styles.darkTertiaryText]}>
              Sort by:
            </Text>
            <View style={styles.sortOptions}>
              {sortOptions.map(option => (
                <Pressable
                  key={option.value}
                  style={[
                    styles.sortOptionButton, 
                    sortOption === option.value && styles.activeSortOptionButton,
                    isDarkMode && sortOption === option.value && styles.darkActiveSortOptionButton
                  ]}
                  onPress={() => setSortOption(option.value)}
                >
                  <Text 
                    style={[
                      styles.sortOptionText,
                      sortOption === option.value && styles.activeSortOptionText,
                      isDarkMode && styles.darkText
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}
        
        <FlatList
          data={sortGoals(goals)}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <GoalCard
              goal={item}
              priority={getPriorityById(item.priorityId)}
              onPress={onGoalPress ? () => onGoalPress(item.id) : undefined}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }
  
  // With sections (default)
  return (
    <View style={styles.container}>
      {showSortOptions && (
        <View style={styles.sortOptionsContainer}>
          <Text style={[styles.sortByText, isDarkMode && styles.darkTertiaryText]}>
            Sort by:
          </Text>
          <View style={styles.sortOptions}>
            {sortOptions.map(option => (
              <Pressable
                key={option.value}
                style={[
                  styles.sortOptionButton, 
                  sortOption === option.value && styles.activeSortOptionButton,
                  isDarkMode && sortOption === option.value && styles.darkActiveSortOptionButton
                ]}
                onPress={() => setSortOption(option.value)}
              >
                <Text 
                  style={[
                    styles.sortOptionText,
                    sortOption === option.value && styles.activeSortOptionText,
                    isDarkMode && styles.darkText
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
      
      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        renderItem={({ item }) => 
          expandedSections[item.status === 'completed' ? 'completed' : getTimeframeCategory(item)] ? (
            <GoalCard
              goal={item}
              priority={getPriorityById(item.priorityId)}
              onPress={onGoalPress ? () => onGoalPress(item.id) : undefined}
            />
          ) : null
        }
        renderSectionHeader={({ section }) => (
          <Pressable 
            style={styles.sectionHeader}
            onPress={() => toggleSection(section.key)}
          >
            <View style={styles.sectionTitleContainer}>
              <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
                {section.title}
              </Text>
              <View style={styles.sectionCount}>
                <Text style={styles.sectionCountText}>
                  {section.data.length}
                </Text>
              </View>
            </View>
            <Ionicons 
              name={expandedSections[section.key] ? 'chevron-up' : 'chevron-down'} 
              size={18} 
              color={isDarkMode ? '#EBEBF5' : '#8E8E93'} 
            />
          </Pressable>
        )}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

// Helper to determine the timeframe category for a goal
function getTimeframeCategory(goal: Goal): TimeframeCategory {
  if (goal.status === 'completed') return 'completed';
  
  if (!goal.deadline) return 'future';
  
  const deadlineDate = new Date(goal.deadline);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  
  const nextWeek = new Date(now);
  nextWeek.setDate(now.getDate() + 7);
  
  const nextMonth = new Date(now);
  nextMonth.setMonth(now.getMonth() + 1);
  
  if (deadlineDate.toDateString() === now.toDateString()) {
    return 'today';
  } else if (deadlineDate <= nextWeek) {
    return 'thisWeek';
  } else if (deadlineDate <= nextMonth) {
    return 'thisMonth';
  } else {
    return 'future';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  // Sort options
  sortOptionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortByText: {
    fontSize: 14,
    color: '#8E8E93',
    marginRight: 10,
  },
  sortOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sortOptionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#F2F2F7',
  },
  activeSortOptionButton: {
    backgroundColor: '#0A84FF',
  },
  darkActiveSortOptionButton: {
    backgroundColor: '#0A84FF',
  },
  sortOptionText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#8E8E93',
  },
  activeSortOptionText: {
    color: '#FFFFFF',
  },
  darkText: {
    color: '#FFFFFF',
  },
  darkTertiaryText: {
    color: '#8E8E93',
  },
  // Section headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(142, 142, 147, 0.1)',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginRight: 10,
  },
  sectionCount: {
    backgroundColor: '#0A84FF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  sectionCountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
}); 