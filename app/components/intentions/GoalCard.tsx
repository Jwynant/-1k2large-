import React from 'react';
import { View, Text, StyleSheet, Pressable, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Goal, Priority, GoalStatus, ImpactLevel } from './types';
import ProgressIndicator from './ProgressIndicator';

type GoalCardProps = {
  goal: Goal;
  priority: Priority;
  onPress?: () => void;
  showActions?: boolean;
  compact?: boolean;
};

/**
 * A reusable goal card component with improved visual hierarchy
 */
export default function GoalCard({
  goal,
  priority,
  onPress,
  showActions = false,
  compact = false,
}: GoalCardProps) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  // Format deadline for display
  const formattedDeadline = goal.deadline ? formatDeadline(goal.deadline) : null;
  
  // Determine urgency based on deadline
  const urgency = getUrgencyFromDeadline(goal.deadline);
  
  // Get status icon
  const getStatusIcon = (status: GoalStatus) => {
    switch (status) {
      case 'not_started':
        return 'ellipse-outline';
      case 'in_progress':
        return 'time-outline';
      case 'completed':
        return 'checkmark-circle';
      case 'abandoned':
        return 'close-circle-outline';
      default:
        return 'help-circle-outline';
    }
  };
  
  // Get impact icon
  const getImpactIcon = (impact: ImpactLevel) => {
    switch (impact) {
      case 'high':
        return 'trending-up';
      case 'medium':
        return 'remove-outline';
      case 'low':
        return 'arrow-down';
      default:
        return 'help-circle-outline';
    }
  };
  
  return (
    <Pressable 
      style={[
        styles.container,
        compact && styles.compactContainer,
        isDarkMode ? styles.darkContainer : styles.lightContainer,
        goal.status === 'completed' && styles.completedContainer
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <View style={styles.statusContainer}>
          <Ionicons 
            name={getStatusIcon(goal.status)} 
            size={20} 
            color={goal.status === 'completed' ? '#4CD964' : priority.color} 
          />
        </View>
        
        <View style={styles.titleContainer}>
          <Text 
            style={[
              styles.title, 
              isDarkMode && styles.darkText,
              goal.status === 'completed' && styles.completedText
            ]}
            numberOfLines={2}
          >
            {goal.title}
          </Text>
          
          <View style={styles.metaContainer}>
            {/* Priority tag */}
            <View style={[styles.priorityTag, { backgroundColor: priority.color + '20' }]}>
              <Text style={[styles.priorityTagText, { color: priority.color }]}>
                {priority.title}
              </Text>
            </View>
            
            {/* Impact indicator */}
            <View style={[styles.impactTag, getImpactStyle(goal.impact)]}>
              <Ionicons 
                name={getImpactIcon(goal.impact)} 
                size={12} 
                color={getImpactColor(goal.impact)} 
              />
              <Text style={[styles.impactText, { color: getImpactColor(goal.impact) }]}>
                {goal.impact.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      </View>
      
      {goal.deadline && (
        <View style={[
          styles.deadlineContainer, 
          urgency === 'urgent' && styles.urgentDeadline,
          urgency === 'soon' && styles.soonDeadline
        ]}>
          <Ionicons 
            name="time-outline" 
            size={14} 
            color={
              urgency === 'urgent' ? '#FF3B30' : 
              urgency === 'soon' ? '#FF9500' : 
              isDarkMode ? '#8E8E93' : '#8E8E93'
            } 
          />
          <Text style={[
            styles.deadlineText, 
            isDarkMode && styles.darkTertiaryText,
            urgency === 'urgent' && styles.urgentText,
            urgency === 'soon' && styles.soonText
          ]}>
            Due {formattedDeadline}
          </Text>
        </View>
      )}
      
      {goal.estimatedTimeMinutes && !compact && (
        <View style={styles.timeEstimateContainer}>
          <Ionicons name="hourglass-outline" size={14} color={isDarkMode ? '#8E8E93' : '#8E8E93'} />
          <Text style={[styles.timeEstimateText, isDarkMode && styles.darkTertiaryText]}>
            Est. {formatTimeEstimate(goal.estimatedTimeMinutes)}
          </Text>
        </View>
      )}
      
      <View style={styles.progressContainer}>
        <ProgressIndicator 
          progress={goal.progress} 
          color={goal.status === 'completed' ? '#4CD964' : priority.color} 
          size="small"
        />
      </View>
      
      {showActions && !compact && (
        <View style={styles.actionsContainer}>
          <Pressable style={styles.actionButton}>
            <Ionicons name="checkmark-circle-outline" size={24} color={isDarkMode ? '#EBEBF5' : '#000000'} />
          </Pressable>
          <Pressable style={styles.actionButton}>
            <Ionicons name="create-outline" size={24} color={isDarkMode ? '#EBEBF5' : '#000000'} />
          </Pressable>
          <Pressable style={styles.actionButton}>
            <Ionicons name="ellipsis-horizontal" size={24} color={isDarkMode ? '#EBEBF5' : '#000000'} />
          </Pressable>
        </View>
      )}
    </Pressable>
  );
}

// Helper function to format deadline date
function formatDeadline(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  
  // Check if the date is today, tomorrow, or the day after
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else if (date.toDateString() === dayAfterTomorrow.toDateString()) {
    return 'In 2 days';
  }
  
  // Check if the date is within 7 days
  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays > 0 && diffDays <= 7) {
    return `In ${diffDays} days`;
  }
  
  // Format the date as month/day for dates further in the future
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

// Helper to determine deadline urgency
function getUrgencyFromDeadline(deadline?: string): 'urgent' | 'soon' | 'normal' {
  if (!deadline) return 'normal';
  
  const date = new Date(deadline);
  const today = new Date();
  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 1) return 'urgent';
  if (diffDays <= 3) return 'soon';
  return 'normal';
}

// Helper to format time estimate
function formatTimeEstimate(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return hours === 1 ? '1 hour' : `${hours} hours`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
}

// Helper to get impact color
function getImpactColor(impact: ImpactLevel): string {
  switch (impact) {
    case 'high':
      return '#FF2D55';
    case 'medium':
      return '#FF9500';
    case 'low':
      return '#8E8E93';
    default:
      return '#8E8E93';
  }
}

// Helper to get impact style
function getImpactStyle(impact: ImpactLevel): object {
  switch (impact) {
    case 'high':
      return { backgroundColor: 'rgba(255, 45, 85, 0.1)' };
    case 'medium':
      return { backgroundColor: 'rgba(255, 149, 0, 0.1)' };
    case 'low':
      return { backgroundColor: 'rgba(142, 142, 147, 0.1)' };
    default:
      return { backgroundColor: 'rgba(142, 142, 147, 0.1)' };
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
    overflow: 'hidden',
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
  },
  compactContainer: {
    padding: 12,
    marginBottom: 8,
  },
  lightContainer: {
    backgroundColor: '#FFFFFF',
  },
  darkContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  completedContainer: {
    opacity: 0.7,
    borderLeftColor: '#4CD964',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  statusContainer: {
    marginRight: 12,
    paddingTop: 2,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  darkText: {
    color: '#FFFFFF',
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.8,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  priorityTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  priorityTagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  impactTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  impactText: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  urgentDeadline: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  soonDeadline: {
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  deadlineText: {
    fontSize: 13,
    color: '#8E8E93',
    marginLeft: 5,
  },
  urgentText: {
    color: '#FF3B30',
    fontWeight: '500',
  },
  soonText: {
    color: '#FF9500',
    fontWeight: '500',
  },
  darkTertiaryText: {
    color: '#8E8E93',
  },
  timeEstimateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeEstimateText: {
    fontSize: 13,
    color: '#8E8E93',
    marginLeft: 5,
  },
  progressContainer: {
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
}); 