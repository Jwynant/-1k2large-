import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
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
    <View style={styles.section}>
      <TouchableOpacity 
        style={styles.goalsDashboardContainer}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={styles.goalsDashboardHeader}>
          <Text style={styles.sectionTitle}>Goals at a Glance</Text>
          <Ionicons 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={16} 
            color="#AEAEB2" 
          />
        </View>

        {!isExpanded ? (
          // Compact View
          <View style={styles.goalsDashboardContent}>
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
                  <View style={styles.progressBar}>
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
          <View style={styles.goalsDashboardExpandedContent}>
            {activeGoals.length > 0 ? (
              <>
                <View style={styles.expandedSection}>
                  <Text style={styles.expandedSectionTitle}>Overall Progress</Text>
                  <View style={styles.progressBar}>
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
                          <View style={styles.progressBar}>
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
                          <Text style={styles.progressPercentage}>{areaCompletionPercentage}%</Text>
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
      </TouchableOpacity>
    </View>
  );
}

export default function TodayScreen() {
  // Get current date info and app state
  const { getPreciseAge, getLifeProgress } = useDateCalculations();
  const { state } = useAppContext();
  const { orderedFocusAreas, focusAreas } = useFocusAreas();
  const { getGoals } = useContentManagement();
  
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.dayOfWeek}>{dayOfWeek}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>
      
      <ScrollView style={styles.content}>
        {/* Life Progress Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Life Progress</Text>
          <View style={styles.progressCard}>
            <Text style={styles.ageText}>{preciseAge}</Text>
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: `${lifeProgressPercentage}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {Math.round(lifeProgressPercentage)}% of life lived 
              ({Math.round(100 - lifeProgressPercentage)}% remaining)
            </Text>
          </View>
        </View>

        {/* Goals Dashboard Section */}
        <GoalsDashboard 
          activeGoals={activeGoals}
          focusAreas={focusAreas}
        />
         
        {/* Focus Areas Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Focus Areas</Text>
          <View style={styles.focusAreasContainer}>
            <SimplifiedFocusAreas />
          </View>
        </View>
        
        {/* Quick Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            <AddGoalButton 
              label="Add Goal"
              icon="flag-outline"
              color="#007AFF"
            />
            
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="image-outline" size={24} color="#4CD964" />
              <Text style={styles.actionText}>Add Memory</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="bulb-outline" size={24} color="#FF9500" />
              <Text style={styles.actionText}>Add Insight</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#1C1C1E',
  },
  dayOfWeek: {
    fontSize: 16,
    color: '#AEAEB2',
    marginBottom: 4,
  },
  date: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  progressCard: {
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    padding: 16,
  },
  ageText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  progressContainer: {
    height: 12,
    backgroundColor: '#3A3A3C',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#0A84FF',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: '#AEAEB2',
  },
  // Goals Dashboard Styles
  goalsDashboardContainer: {
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    padding: 16,
  },
  goalsDashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalsDashboardContent: {
    gap: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
    marginTop: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0A84FF',
    borderRadius: 2,
  },
  focusAreaSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
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
  emptyStateSubtext: {
    fontSize: 12,
    color: '#AEAEB2',
    marginTop: 4,
  },
  addGoalButton: {
    backgroundColor: '#0A84FF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginTop: 8,
  },
  addGoalIcon: {
    marginRight: 6,
  },
  addGoalButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 14,
  },
  // Expanded Goals Dashboard Styles
  goalsDashboardExpandedContent: {
    gap: 16,
  },
  expandedSection: {
    marginTop: 8,
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
  progressPercentage: {
    fontSize: 12,
    color: '#AEAEB2',
    marginLeft: 8,
  },
  // Quick Actions Styles
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  actionText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 8,
  },
  // Focus Areas Styles
  focusAreasContainer: {
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    minHeight: 200,
  },
}); 