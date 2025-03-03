import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Define a type for the goal object
export interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  priorityColor: string;
  deadline?: string;
  // New fields for enhanced goal tracking
  category?: string;
  intent?: string;
  focusArea?: string;
  priorityLevel?: 'low' | 'medium' | 'high';
  trackingMethod?: 'percentage' | 'binary' | 'milestone';
}

interface GoalItemProps {
  goal: Goal;
  isDarkMode: boolean;
}

export const GoalItem: React.FC<GoalItemProps> = ({ goal, isDarkMode }) => (
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

const styles = StyleSheet.create({
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
  darkCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
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
  darkText: {
    color: '#FFFFFF',
  },
  darkSecondaryText: {
    color: '#EBEBF5',
  },
  darkTertiaryText: {
    color: '#8E8E93',
  },
});

export default GoalItem; 