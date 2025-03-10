import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ContentItem, FocusArea } from '../../types';
import { useRouter } from 'expo-router';
import AddGoalButton from '../goals/AddGoalButton';
import Card from '../shared/Card';
import { useToast } from '../../context/ToastContext';

interface GoalsDashboardProps {
  activeGoals: ContentItem[];
  focusAreas: FocusArea[];
}

export default function GoalsDashboard({ activeGoals, focusAreas }: GoalsDashboardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();
  
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
    showToast('Creating a new goal', 'info');
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    
    // Show toast when expanding/collapsing
    if (!isExpanded && activeGoals.length > 0) {
      showToast(`Showing details for ${activeGoals.length} goals`, 'info', 2000);
    }
  };

  const toggleIcon = (
    <Ionicons 
      name={isExpanded ? "chevron-up" : "chevron-down"} 
      size={16} 
      color="#AEAEB2" 
    />
  );
  
  return (
    <Card
      title="Goals at a Glance"
      iconName="flag"
      iconColor="#0A84FF"
      onHeaderPress={toggleExpand}
      rightHeaderContent={toggleIcon}
      testID="goals-dashboard"
    >
      {!isExpanded ? (
        // Compact View
        <View>
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
        <View>
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
    </Card>
  );
}

const styles = StyleSheet.create({
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
  progressBarContainer: {
    height: 12,
    backgroundColor: '#3A3A3C',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0A84FF',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: '#AEAEB2',
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