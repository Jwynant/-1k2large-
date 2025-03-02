import React, { useState, useCallback, useMemo } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  useColorScheme, 
  useWindowDimensions,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import new components and types
import PrioritySelector from '../components/intentions/PrioritySelector';
import DashboardSummary from '../components/intentions/DashboardSummary';
import GoalList from '../components/intentions/GoalList';
import { FilterOption, Goal, Priority, GoalStats } from '../components/intentions/types';

// Import mock data
import { goals, priorities } from '../components/intentions/mockData';

export default function IntentionsScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  
  // State for filtering
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('all');
  
  // Filter goals based on selected filter
  const filteredGoals = useMemo(() => {
    if (selectedFilter === 'all') {
      return goals;
    } else if (selectedFilter === 'high' || selectedFilter === 'medium' || selectedFilter === 'low') {
      // Filter by priority level
      return goals.filter(goal => {
        const priority = priorities.find(p => p.id === goal.priorityId);
        return priority && priority.level === selectedFilter;
      });
    } else {
      // Filter by specific priority ID
      return goals.filter(goal => goal.priorityId === selectedFilter);
    }
  }, [selectedFilter]);
  
  // Calculate goals count by priority
  const goalsCountByPriority = useMemo(() => {
    return priorities.reduce((counts, priority) => {
      const activeGoalsCount = goals.filter(
        goal => goal.priorityId === priority.id && goal.status !== 'completed' && goal.status !== 'abandoned'
      ).length;
      
      return {
        ...counts,
        [priority.id]: activeGoalsCount
      };
    }, {} as Record<string, number>);
  }, [priorities, goals]);
  
  // Calculate stats for the dashboard
  const stats = useMemo(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);
    
    // Only consider filtered goals for stats
    const totalGoals = filteredGoals.length;
    const completedGoals = filteredGoals.filter(goal => goal.status === 'completed').length;
    const notStartedGoals = filteredGoals.filter(goal => goal.status === 'not_started').length;
    const inProgressGoals = filteredGoals.filter(goal => goal.status === 'in_progress').length;
    const abandonedGoals = filteredGoals.filter(goal => goal.status === 'abandoned').length;
    const activeGoals = notStartedGoals + inProgressGoals;
    
    const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
    
    // Calculate goals by deadline
    const dueToday = filteredGoals.filter(goal => {
      if (!goal.deadline || goal.status === 'completed' || goal.status === 'abandoned') return false;
      const deadlineDate = new Date(goal.deadline);
      return deadlineDate.toDateString() === today.toDateString();
    }).length;
    
    const dueThisWeek = filteredGoals.filter(goal => {
      if (!goal.deadline || goal.status === 'completed' || goal.status === 'abandoned') return false;
      const deadlineDate = new Date(goal.deadline);
      return deadlineDate > today && deadlineDate <= nextWeek;
    }).length;
    
    const dueThisMonth = filteredGoals.filter(goal => {
      if (!goal.deadline || goal.status === 'completed' || goal.status === 'abandoned') return false;
      const deadlineDate = new Date(goal.deadline);
      return deadlineDate > nextWeek && deadlineDate <= nextMonth;
    }).length;
    
    // Calculate goals by priority level
    const highPriorityGoals = filteredGoals.filter(goal => {
      if (goal.status === 'completed' || goal.status === 'abandoned') return false;
      const priority = priorities.find(p => p.id === goal.priorityId);
      return priority && priority.level === 'high';
    }).length;
    
    const mediumPriorityGoals = filteredGoals.filter(goal => {
      if (goal.status === 'completed' || goal.status === 'abandoned') return false;
      const priority = priorities.find(p => p.id === goal.priorityId);
      return priority && priority.level === 'medium';
    }).length;
    
    const lowPriorityGoals = filteredGoals.filter(goal => {
      if (goal.status === 'completed' || goal.status === 'abandoned') return false;
      const priority = priorities.find(p => p.id === goal.priorityId);
      return priority && priority.level === 'low';
    }).length;
    
    // Calculate goals by impact
    const highImpactGoals = filteredGoals.filter(goal => 
      goal.status !== 'completed' && goal.status !== 'abandoned' && goal.impact === 'high'
    ).length;
    
    return {
      totalGoals,
      completedGoals,
      activeGoals,
      notStartedGoals,
      inProgressGoals,
      abandonedGoals,
      completionRate,
      dueToday,
      dueThisWeek,
      dueThisMonth,
      highPriorityGoals,
      mediumPriorityGoals,
      lowPriorityGoals,
      highImpactGoals,
    } as GoalStats;
  }, [filteredGoals]);
  
  // Get info for selected priority if any
  const selectedPriorityInfo = useMemo(() => {
    if (selectedFilter !== 'all' && selectedFilter !== 'high' && selectedFilter !== 'medium' && selectedFilter !== 'low') {
      const priority = priorities.find(p => p.id === selectedFilter);
      if (priority) {
        return {
          title: priority.title,
          color: priority.color,
        };
      }
    }
    return undefined;
  }, [selectedFilter]);
  
  // Handle goal press
  const handleGoalPress = useCallback((goalId: string) => {
    // TODO: Navigate to goal details or show action sheet
    console.log('Goal pressed:', goalId);
  }, []);
  
  // Handle the "Focus Now" recommendation press
  const handleFocusPress = useCallback(() => {
    // TODO: Implement focus mode or highlight relevant goals
    console.log('Focus mode activated');
  }, []);

  return (
    <SafeAreaView style={[
      styles.container, 
      isDarkMode && styles.darkContainer,
      { paddingTop: insets.top }
    ]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      
      {/* Priority Filter Bar */}
      <PrioritySelector
        priorities={priorities}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        goalsCountByPriority={goalsCountByPriority}
      />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Dashboard Summary */}
        <DashboardSummary
          stats={stats}
          selectedPriorityTitle={selectedPriorityInfo?.title}
          selectedPriorityColor={selectedPriorityInfo?.color}
          onFocusPress={handleFocusPress}
        />
        
        {/* Unified Goal List */}
        <GoalList
          goals={filteredGoals}
          priorities={priorities}
          onGoalPress={handleGoalPress}
        />
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Extra padding for bottom
  },
});