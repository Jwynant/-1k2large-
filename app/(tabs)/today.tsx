import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import { useDateCalculations } from '../hooks/useDateCalculations';
import { useFocusAreas } from '../hooks/useFocusAreas';
import { useContentManagement } from '../hooks/useContentManagement';
import { format } from 'date-fns';
import { ContentItem, FocusArea } from '../types';
import { useRouter } from 'expo-router';
import AddGoalButton from '../components/goals/AddGoalButton';
import SimplifiedFocusAreas from '../components/focus/SimplifiedFocusAreas';
import SimplifiedContentLibrary from '../components/content/SimplifiedContentLibrary';
import QuickActionButtons from '../components/today/QuickActionButtons';
import { LinearGradient } from 'expo-linear-gradient';

// Simple Goals Dashboard Component
function GoalsDashboard({ activeGoals, focusAreas }: { activeGoals: ContentItem[], focusAreas: FocusArea[] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  
  // Calculate completion percentage
  const completedGoals = activeGoals.filter(goal => goal.isCompleted).length;
  const completionPercentage = activeGoals.length > 0 
    ? Math.round((completedGoals / activeGoals.length) * 100) 
    : 0;
    
  // Get focus area with most goals
  const focusAreaWithMostGoals = React.useMemo(() => {
    if (activeGoals.length === 0 || focusAreas.length === 0) return null;
    
    const goalsByFocusArea = focusAreas.map(area => {
      const goals = activeGoals.filter(goal => goal.focusAreaId === area.id);
      return { area, count: goals.length };
    });
    
    return goalsByFocusArea.sort((a, b) => b.count - a.count)[0];
  }, [activeGoals, focusAreas]);
  
  const handleAddGoal = () => {
    // Navigate to the goal creation form
    router.push("/(tabs)/content/new" as any);
  };
  
  return (
    <View style={styles.card}>
      <TouchableOpacity 
        style={styles.cardHeader}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={styles.cardTitleContainer}>
          <Ionicons name="flag" size={20} color="#0A84FF" style={styles.cardIcon} />
          <Text style={styles.cardTitle}>Goals at a Glance</Text>
        </View>
        <Ionicons 
          name={isExpanded ? "chevron-up" : "chevron-down"} 
          size={16} 
          color="#AEAEB2" 
        />
      </TouchableOpacity>

      {!isExpanded ? (
        // Compact View
        <View style={styles.cardContent}>
          {activeGoals.length > 0 ? (
            <>
              <View style={styles.metricsRow}>
                <View style={styles.metric}>
                  <Text style={styles.metricValue}>{activeGoals.length}</Text>
                  <Text style={styles.metricLabel}>Active</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricValue}>{completionPercentage}%</Text>
                  <Text style={styles.metricLabel}>Complete</Text>
                </View>
              </View>

              <View style={styles.progressSection}>
                <View style={styles.progressBarContainer}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${completionPercentage}%` }
                    ]} 
                  />
                </View>
              </View>

              {focusAreaWithMostGoals && (
                <View style={styles.focusAreaSection}>
                  <Text style={styles.focusAreaLabel}>Most goals in:</Text>
                  <Text 
                    style={[
                      styles.focusAreaName, 
                      { color: focusAreaWithMostGoals.area.color }
                    ]}
                  >
                    {focusAreaWithMostGoals.area.name} ({focusAreaWithMostGoals.count})
                  </Text>
                </View>
              )}
            </>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No active goals</Text>
              <AddGoalButton />
            </View>
          )}
        </View>
      ) : (
        // Expanded View
        <View style={styles.cardContent}>
          {activeGoals.length > 0 ? (
            <>
              <View style={styles.expandedSection}>
                <Text style={styles.expandedSectionTitle}>Overall Progress</Text>
                <View style={styles.progressBarContainer}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${completionPercentage}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>
                  {completedGoals} of {activeGoals.length} goals completed
                </Text>
              </View>
              
              <View style={styles.expandedSection}>
                <Text style={styles.expandedSectionTitle}>Goals by Focus Area</Text>
                {focusAreas.map(area => {
                  const areaGoals = activeGoals.filter(goal => goal.focusAreaId === area.id);
                  if (areaGoals.length === 0) return null;
                  
                  const areaCompletedGoals = areaGoals.filter(goal => goal.isCompleted).length;
                  const areaCompletionPercentage = areaGoals.length > 0 
                    ? Math.round((areaCompletedGoals / areaGoals.length) * 100) 
                    : 0;
                  
                  return (
                    <View key={area.id} style={styles.focusAreaGoalCard}>
                      <View style={styles.focusAreaGoalHeader}>
                        <Text style={[styles.focusAreaGoalName, { color: area.color }]}>
                          {area.name}
                        </Text>
                        <Text style={styles.focusAreaGoalCount}>
                          {areaGoals.length} {areaGoals.length === 1 ? 'goal' : 'goals'}
                        </Text>
                      </View>
                      <View style={styles.focusAreaGoalProgress}>
                        <View style={styles.progressBarContainer}>
                          <View 
                            style={[
                              styles.progressFill, 
                              { 
                                width: `${areaCompletionPercentage}%`,
                                backgroundColor: area.color 
                              }
                            ]} 
                          />
                        </View>
                        <Text style={styles.goalProgressPercentage}>{areaCompletionPercentage}%</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No active goals</Text>
              <AddGoalButton />
            </View>
          )}
        </View>
      )}
    </View>
  );
}

export default function TodayScreen() {
  // Get current date info and app state
  const { getPreciseAge, getLifeProgress } = useDateCalculations();
  const { state } = useAppContext();
  const { orderedFocusAreas, focusAreas } = useFocusAreas();
  const { getGoals } = useContentManagement();
  const router = useRouter();
  
  // State for expanded sections
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  
  // Format current date
  const today = new Date();
  const formattedDate = format(today, 'MMMM d, yyyy');
  const dayOfWeek = format(today, 'EEEE');
  
  // Calculate life progress
  const lifeProgressPercentage = getLifeProgress(state.userSettings.lifeExpectancy);
  const preciseAge = getPreciseAge();

  // Get goals data
  const allGoals = getGoals();
  const activeGoals = allGoals.filter(goal => !goal.isCompleted);
  
  // Handle adding new content
  const handleAddMemory = () => {
    try {
      // Navigate directly to the memory creation form
      router.push("/content/memory");
      console.log("Navigating to memory form");
    } catch (error) {
      console.error("Navigation error:", error);
      // Fallback navigation if needed
      router.push({
        pathname: "/content/memory"
      });
    }
  };
  
  const handleAddGoal = () => {
    try {
      // Navigate directly to the goal creation form
      router.push("/content/goal");
      console.log("Navigating to goal form");
    } catch (error) {
      console.error("Navigation error:", error);
      // Fallback navigation if needed
      router.push({
        pathname: "/content/goal"
      });
    }
  };

  // Calculate time remaining in years, months, and days
  const calculateTimeRemaining = () => {
    if (!state.userBirthDate || !state.userSettings?.lifeExpectancy) return null;
    
    const birthDate = new Date(state.userBirthDate);
    const lifeExpectancy = state.userSettings.lifeExpectancy;
    
    // Calculate end date based on birth date and life expectancy
    const endDate = new Date(birthDate);
    endDate.setFullYear(birthDate.getFullYear() + lifeExpectancy);
    
    // Calculate difference between now and end date
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    
    // If negative, return null
    if (diffTime <= 0) return null;
    
    // Convert to days, then to years, months, days
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = diffDays % 30;
    
    return { years, months, days, totalDays: diffDays };
  };
  
  const timeRemaining = calculateTimeRemaining();
  
  // Get an encouraging message based on time remaining
  const getEncouragingMessage = () => {
    if (!timeRemaining) return "";
    
    const { years, totalDays } = timeRemaining;
    
    // Different messages based on life stage
    if (years > 50) {
      return "Your journey is just beginning. Dream big and build your foundation.";
    } else if (years > 30) {
      return "You have decades ahead to create a meaningful impact on the world.";
    } else if (years > 15) {
      return "There's still plenty of time to pursue your passions and achieve your goals.";
    } else if (years > 5) {
      return "Make each day count. Your experience and wisdom are valuable gifts.";
    } else {
      return "Focus on what truly matters. Every moment is precious.";
    }
  };
  
  const encouragingMessage = getEncouragingMessage();

  return (
    <SafeAreaView style={styles.container}>
      {/* Simplified Header with gradient background */}
      <LinearGradient
        colors={['#1C1C1E', '#2C2C2E']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View style={styles.dateContainer}>
            <Text style={styles.dayOfWeek}>{dayOfWeek}</Text>
            <Text style={styles.date}>{formattedDate}</Text>
            <View style={styles.ageDivider} />
            <View style={styles.ageContainer}>
              <Ionicons name="person" size={12} color="#AEAEB2" style={styles.ageIcon} />
              <Text style={styles.ageValue}>{preciseAge}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Life Progress Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Ionicons name="hourglass" size={20} color="#FF9500" style={styles.cardIcon} />
              <Text style={styles.cardTitle}>Life Progress</Text>
            </View>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${lifeProgressPercentage}%` }
                ]} 
              />
            </View>
            <View style={styles.progressStatsContainer}>
              <Text style={styles.progressPercentage}>{Math.round(lifeProgressPercentage)}%</Text>
              <Text style={styles.progressText}>
                of life lived ({Math.round(100 - lifeProgressPercentage)}% remaining)
              </Text>
            </View>
            
            {timeRemaining && (
              <View style={styles.timeRemainingContainer}>
                <Text style={styles.timeRemainingLabel}>You have approximately:</Text>
                <Text style={styles.timeRemainingValue}>
                  {timeRemaining.years} years, {timeRemaining.months} months
                </Text>
                <View style={styles.timeRemainingMessageContainer}>
                  <Ionicons name="sparkles" size={16} color="#FF9500" style={styles.messageIcon} />
                  <Text style={styles.timeRemainingMessage}>
                    {encouragingMessage}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Quick Action Buttons - Moved below Life Progress */}
        <View style={styles.quickActionsContainer}>
          <QuickActionButtons 
            onAddMemory={handleAddMemory}
            onAddGoal={handleAddGoal}
          />
        </View>

        {/* Goals Dashboard Section */}
        <GoalsDashboard 
          activeGoals={activeGoals}
          focusAreas={focusAreas}
        />
         
        {/* Focus Areas Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Ionicons name="compass" size={20} color="#4CD964" style={styles.cardIcon} />
              <Text style={styles.cardTitle}>Focus Areas</Text>
            </View>
          </View>
          <View style={styles.cardContent}>
            <SimplifiedFocusAreas />
          </View>
        </View>
        
        {/* Content Library Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Ionicons name="library" size={20} color="#5856D6" style={styles.cardIcon} />
              <Text style={styles.cardTitle}>Content Library</Text>
            </View>
            <TouchableOpacity onPress={() => setIsContentExpanded(!isContentExpanded)}>
              <Ionicons 
                name={isContentExpanded ? "chevron-up" : "chevron-down"} 
                size={16} 
                color="#AEAEB2" 
              />
            </TouchableOpacity>
          </View>
          <View style={styles.cardContent}>
            <SimplifiedContentLibrary 
              isExpanded={isContentExpanded}
              onToggleExpand={() => setIsContentExpanded(!isContentExpanded)}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  headerGradient: {
    paddingTop: 10,
    paddingBottom: 12,
  },
  header: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  dateContainer: {
    alignItems: 'center',
  },
  dayOfWeek: {
    fontSize: 14,
    color: '#AEAEB2',
    marginBottom: 2,
  },
  date: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  ageDivider: {
    width: 40,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 6,
  },
  ageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginTop: 2,
  },
  ageIcon: {
    marginRight: 6,
  },
  ageValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  quickActionsContainer: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cardContent: {
    padding: 16,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: '#3A3A3C',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF9500',
    borderRadius: 6,
  },
  progressStatsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF9500',
    marginRight: 6,
  },
  progressText: {
    fontSize: 14,
    color: '#AEAEB2',
  },
  timeRemainingContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 16,
    marginTop: 4,
  },
  timeRemainingLabel: {
    fontSize: 14,
    color: '#AEAEB2',
    marginBottom: 6,
  },
  timeRemainingValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  timeRemainingMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
    borderRadius: 10,
    padding: 12,
  },
  messageIcon: {
    marginRight: 8,
  },
  timeRemainingMessage: {
    fontSize: 14,
    color: '#FFFFFF',
    flex: 1,
    lineHeight: 20,
  },
  // Goals Dashboard Styles
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  metricLabel: {
    fontSize: 12,
    color: '#AEAEB2',
    marginTop: 2,
  },
  progressSection: {
    marginBottom: 12,
  },
  focusAreaSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  focusAreaLabel: {
    fontSize: 12,
    color: '#AEAEB2',
    marginRight: 4,
  },
  focusAreaName: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
    marginBottom: 12,
  },
  // Expanded Goals Dashboard Styles
  expandedSection: {
    marginBottom: 16,
  },
  expandedSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  focusAreaGoalCard: {
    backgroundColor: '#3A3A3C',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  focusAreaGoalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  focusAreaGoalName: {
    fontSize: 14,
    fontWeight: '500',
  },
  focusAreaGoalCount: {
    fontSize: 12,
    color: '#AEAEB2',
  },
  focusAreaGoalProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalProgressPercentage: {
    fontSize: 12,
    color: '#AEAEB2',
    marginLeft: 8,
  },
}); 