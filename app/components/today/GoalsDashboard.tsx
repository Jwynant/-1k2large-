import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ContentItem, FocusArea } from '../../types';
import { useRouter } from 'expo-router';
import AddGoalButton from '../goals/AddGoalButton';
import Card from '../shared/Card';
import { useToast } from '../../context/ToastContext';
import { format, isToday, isTomorrow, differenceInDays } from 'date-fns';

interface GoalsDashboardProps {
  activeGoals: ContentItem[];
  focusAreas: FocusArea[];
}

export default function GoalsDashboard({ activeGoals, focusAreas }: GoalsDashboardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();
  
  // Get upcoming goals sorted by deadline
  const upcomingGoals = useMemo(() => {
    // Filter goals with deadlines and sort by closest deadline
    return [...activeGoals]
      .filter(goal => goal.deadline && !goal.isCompleted)
      .sort((a, b) => {
        const dateA = new Date(a.deadline || '');
        const dateB = new Date(b.deadline || '');
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 3); // Show only the 3 most urgent goals
  }, [activeGoals]);
  
  // Get the next upcoming deadline
  const nextDeadline = useMemo(() => {
    if (upcomingGoals.length === 0) return null;
    return upcomingGoals[0];
  }, [upcomingGoals]);
  
  // Format deadline for display
  const formatDeadline = (dateString: string) => {
    const date = new Date(dateString);
    
    if (isToday(date)) {
      return 'Today';
    } else if (isTomorrow(date)) {
      return 'Tomorrow';
    } else {
      const daysUntil = differenceInDays(date, new Date());
      if (daysUntil < 7) {
        return `${daysUntil} day${daysUntil !== 1 ? 's' : ''} left`;
      } else {
        return format(date, 'MMM d');
      }
    }
  };
  
  // Get focus area color
  const getFocusAreaColor = (focusAreaId?: string) => {
    if (!focusAreaId) return '#0A84FF'; // Default blue
    const area = focusAreas.find(area => area.id === focusAreaId);
    return area ? area.color : '#0A84FF';
  };
  
  const handleGoalPress = (goal: ContentItem) => {
    // Navigate to the goal detail/edit view
    router.push({
      pathname: `/content/${goal.type}`,
      params: { id: goal.id, edit: 'true' }
    });
    showToast('Viewing goal details', 'info');
  };
  
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
        // Compact View - Actionable Information
        <View>
          {activeGoals.length > 0 ? (
            <>
              {nextDeadline ? (
                <View style={styles.nextDeadlineContainer}>
                  <View style={styles.deadlineHeader}>
                    <Text style={styles.nextDeadlineLabel}>Next Deadline</Text>
                    <Text 
                      style={[
                        styles.deadlineDate, 
                        isToday(new Date(nextDeadline.deadline || '')) && styles.urgentDeadline
                      ]}
                    >
                      {formatDeadline(nextDeadline.deadline || '')}
                    </Text>
                  </View>
                  
                  <TouchableOpacity 
                    style={[
                      styles.goalCard, 
                      { borderLeftColor: getFocusAreaColor(nextDeadline.focusAreaId) }
                    ]}
                    onPress={() => handleGoalPress(nextDeadline)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.goalTitle} numberOfLines={2}>
                      {nextDeadline.title}
                    </Text>
                    
                    {nextDeadline.progress !== undefined && (
                      <View style={styles.goalProgressContainer}>
                        <View style={styles.progressBarContainer}>
                          <View 
                            style={[
                              styles.progressFill, 
                              { 
                                width: `${nextDeadline.progress}%`,
                                backgroundColor: getFocusAreaColor(nextDeadline.focusAreaId)
                              }
                            ]} 
                          />
                        </View>
                        <Text style={styles.progressText}>{nextDeadline.progress}%</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.noDeadlinesContainer}>
                  <Text style={styles.noDeadlinesText}>No upcoming deadlines</Text>
                </View>
              )}
              
              {upcomingGoals.length > 1 && (
                <View style={styles.otherGoalsContainer}>
                  <Text style={styles.otherGoalsLabel}>
                    {upcomingGoals.length > 1 ? 'Other Upcoming Goals' : 'Other Goals'}
                  </Text>
                  
                  {upcomingGoals.slice(1).map(goal => (
                    <TouchableOpacity 
                      key={goal.id}
                      style={styles.otherGoalItem}
                      onPress={() => handleGoalPress(goal)}
                      activeOpacity={0.7}
                    >
                      <View 
                        style={[
                          styles.goalColorIndicator, 
                          { backgroundColor: getFocusAreaColor(goal.focusAreaId) }
                        ]} 
                      />
                      <Text style={styles.otherGoalTitle} numberOfLines={1}>
                        {goal.title}
                      </Text>
                      <Text 
                        style={[
                          styles.otherGoalDeadline,
                          isToday(new Date(goal.deadline || '')) && styles.urgentDeadline
                        ]}
                      >
                        {formatDeadline(goal.deadline || '')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={toggleExpand}
                activeOpacity={0.7}
              >
                <Text style={styles.viewAllText}>
                  View All {activeGoals.length} Goals
                </Text>
                <Ionicons name="chevron-down" size={14} color="#0A84FF" />
              </TouchableOpacity>
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
                <Text style={styles.expandedSectionTitle}>All Goals ({activeGoals.length})</Text>
                
                {activeGoals.map(goal => {
                  const hasDeadline = !!goal.deadline;
                  const deadlineText = hasDeadline ? formatDeadline(goal.deadline || '') : 'No deadline';
                  
                  return (
                    <TouchableOpacity 
                      key={goal.id}
                      style={[
                        styles.expandedGoalCard, 
                        { borderLeftColor: getFocusAreaColor(goal.focusAreaId) }
                      ]}
                      onPress={() => handleGoalPress(goal)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.expandedGoalHeader}>
                        <Text style={styles.expandedGoalTitle} numberOfLines={2}>
                          {goal.title}
                        </Text>
                        {hasDeadline && (
                          <Text 
                            style={[
                              styles.expandedGoalDeadline,
                              isToday(new Date(goal.deadline || '')) && styles.urgentDeadline
                            ]}
                          >
                            {deadlineText}
                          </Text>
                        )}
                      </View>
                      
                      {goal.progress !== undefined && (
                        <View style={styles.goalProgressContainer}>
                          <View style={styles.progressBarContainer}>
                            <View 
                              style={[
                                styles.progressFill, 
                                { 
                                  width: `${goal.progress}%`,
                                  backgroundColor: getFocusAreaColor(goal.focusAreaId)
                                }
                              ]} 
                            />
                          </View>
                          <Text style={styles.progressText}>{goal.progress}%</Text>
                        </View>
                      )}
                    </TouchableOpacity>
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
  // Next Deadline Section
  nextDeadlineContainer: {
    marginBottom: 16,
  },
  deadlineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nextDeadlineLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  deadlineDate: {
    fontSize: 14,
    color: '#AEAEB2',
    fontWeight: '500',
  },
  urgentDeadline: {
    color: '#FF453A',
    fontWeight: '600',
  },
  goalCard: {
    backgroundColor: 'rgba(44, 44, 46, 0.3)',
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 3,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  goalProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#3A3A3C',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0A84FF',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#AEAEB2',
    width: 30,
    textAlign: 'right',
  },
  
  // No Deadlines
  noDeadlinesContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  noDeadlinesText: {
    fontSize: 14,
    color: '#AEAEB2',
    fontStyle: 'italic',
  },
  
  // Other Goals Section
  otherGoalsContainer: {
    marginBottom: 12,
  },
  otherGoalsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  otherGoalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(142, 142, 147, 0.1)',
  },
  goalColorIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  otherGoalTitle: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
  },
  otherGoalDeadline: {
    fontSize: 12,
    color: '#AEAEB2',
    marginLeft: 8,
  },
  
  // View All Button
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  viewAllText: {
    fontSize: 14,
    color: '#0A84FF',
    marginRight: 4,
  },
  
  // Expanded View
  expandedSection: {
    marginBottom: 16,
  },
  expandedSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  expandedGoalCard: {
    backgroundColor: 'rgba(44, 44, 46, 0.3)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
  },
  expandedGoalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  expandedGoalTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
  expandedGoalDeadline: {
    fontSize: 12,
    color: '#AEAEB2',
  },
  
  // Empty State
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
}); 