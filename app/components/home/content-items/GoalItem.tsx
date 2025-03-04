import React from 'react';
import { View, Text } from 'react-native';
import { useStyles } from '../../../hooks';
import { useTheme } from '../../../theme';

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
}

export const GoalItem: React.FC<GoalItemProps> = ({ goal }) => {
  const theme = useTheme();
  const styles = useStyles(theme => ({
    contentCard: {
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borders.radius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 2,
      elevation: 1,
      borderWidth: theme.isDark ? 1 : 0,
      borderColor: theme.colors.border.light,
    },
    goalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    goalPriorityIndicator: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: theme.spacing.sm,
    },
    goalTitle: {
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.semibold,
      color: theme.colors.text.primary,
      flex: 1,
    },
    goalDescription: {
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.md,
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
      backgroundColor: theme.colors.background.tertiary,
      borderRadius: 3,
      marginRight: theme.spacing.sm,
    },
    goalProgress: {
      height: '100%',
      borderRadius: 3,
    },
    goalProgressText: {
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.text.tertiary,
      width: 35,
    },
    goalDeadline: {
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.text.tertiary,
    },
  }));

  return (
    <View style={styles.contentCard}>
      <View style={styles.goalHeader}>
        <View style={[styles.goalPriorityIndicator, { backgroundColor: goal.priorityColor }]} />
        <Text style={styles.goalTitle}>{goal.title}</Text>
      </View>
      <Text style={styles.goalDescription}>
        {goal.description}
      </Text>
      <View style={styles.goalFooter}>
        <View style={styles.goalMetrics}>
          <View style={styles.goalProgressContainer}>
            <View style={styles.goalProgressBar}>
              <View style={[styles.goalProgress, { width: `${goal.progress}%`, backgroundColor: goal.priorityColor }]} />
            </View>
            <Text style={styles.goalProgressText}>{goal.progress}%</Text>
          </View>
        </View>
        <Text style={styles.goalDeadline}>
          {goal.deadline ? `Due: ${goal.deadline}` : 'No deadline'}
        </Text>
      </View>
    </View>
  );
};

export default GoalItem; 