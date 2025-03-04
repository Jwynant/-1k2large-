import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStyles } from '../../../hooks';
import { useTheme } from '../../../theme';
import { ThemedCard } from '../../ui/ThemedCard';

// Define a type for the priority object
export interface Priority {
  id: string;
  title: string;
  category: string;
  color: string;
  gradientStart?: string;
  gradientEnd?: string;
  icon: keyof typeof Ionicons.glyphMap;
  intent?: string;
  period?: string;
  isPrimary?: boolean;
  sacrifices?: string[];
}

interface PriorityItemProps {
  priority: Priority;
  isPrimary?: boolean;
}

export const PriorityItem: React.FC<PriorityItemProps> = ({ 
  priority, 
  isPrimary = false 
}) => {
  const theme = useTheme();
  const styles = useStyles(theme => ({
    primaryFocusCard: {
      borderRadius: theme.borders.radius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      backgroundColor: 'transparent',
    },
    focusCard: {
      borderRadius: theme.borders.radius.md,
      padding: theme.spacing.md,
      marginRight: theme.spacing.md,
      backgroundColor: 'transparent',
      width: 240,
      borderLeftWidth: theme.borders.width.normal,
      borderLeftColor: priority.color,
      ...theme.borders.shadow.sm,
    },
    primaryFocusBadgeContainer: {
      position: 'absolute',
      top: theme.spacing.sm,
      right: theme.spacing.sm,
      zIndex: 10,
    },
    primaryFocusBadge: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs / 2,
      borderRadius: theme.borders.radius.sm,
    },
    primaryFocusBadgeText: {
      color: theme.colors.text.inverse,
      fontSize: theme.typography.sizes.xs,
      fontWeight: theme.typography.weights.semibold,
    },
    focusHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
      paddingTop: isPrimary ? theme.spacing.lg : 0,
    },
    focusCategoryIcon: {
      width: isPrimary ? 44 : 36,
      height: isPrimary ? 44 : 36,
      borderRadius: isPrimary ? 22 : 18,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.sm,
    },
    focusTitleContainer: {
      flex: 1,
    },
    primaryFocusTitle: {
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.xs / 2,
    },
    focusTitle: {
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.semibold,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.xs / 2,
    },
    focusCategory: {
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.text.secondary,
      opacity: 0.8,
    },
    focusIntentContainer: {
      marginTop: theme.spacing.sm,
    },
    focusIntentLabel: {
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.xs / 2,
      opacity: 0.8,
    },
    focusIntent: {
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.sm,
    },
    sacrificesContainer: {
      marginTop: theme.spacing.sm,
    },
    sacrificesLabel: {
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.xs / 2,
      opacity: 0.8,
    },
    sacrificesList: {
      marginTop: theme.spacing.xs / 2,
    },
    sacrificeItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    sacrificeIcon: {
      marginRight: theme.spacing.xs,
    },
    sacrificeText: {
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.negative,
      flex: 1,
    },
    periodContainer: {
      marginTop: theme.spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
    },
    periodIcon: {
      marginRight: theme.spacing.xs,
    },
    periodText: {
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.text.primary,
      opacity: 0.9,
    },
  }));

  return (
    <View style={isPrimary ? styles.primaryFocusCard : styles.focusCard}>
      {isPrimary && (
        <View style={styles.primaryFocusBadgeContainer}>
          <View style={styles.primaryFocusBadge}>
            <Text style={styles.primaryFocusBadgeText}>Primary Focus</Text>
          </View>
        </View>
      )}
      
      <View style={styles.focusHeader}>
        <View style={[styles.focusCategoryIcon, { backgroundColor: priority.color }]}>
          <Ionicons name={priority.icon} size={isPrimary ? 24 : 18} color="#FFFFFF" />
        </View>
        <View style={styles.focusTitleContainer}>
          <Text style={isPrimary ? styles.primaryFocusTitle : styles.focusTitle}>
            {priority.title}
          </Text>
          <Text style={styles.focusCategory}>{priority.category}</Text>
        </View>
      </View>
      
      {priority.intent && (
        <View style={styles.focusIntentContainer}>
          <Text style={styles.focusIntentLabel}>INTENT</Text>
          <Text style={styles.focusIntent}>{priority.intent}</Text>
        </View>
      )}
      
      {priority.sacrifices && priority.sacrifices.length > 0 && (
        <View style={styles.sacrificesContainer}>
          <Text style={styles.sacrificesLabel}>INTENTIONAL SACRIFICES</Text>
          <View style={styles.sacrificesList}>
            {priority.sacrifices.map((sacrifice, index) => (
              <View key={index} style={styles.sacrificeItem}>
                <Ionicons 
                  name="remove-circle" 
                  size={16} 
                  color={theme.colors.negative}
                  style={styles.sacrificeIcon} 
                />
                <Text style={styles.sacrificeText}>{sacrifice}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
      
      {priority.period && (
        <View style={styles.periodContainer}>
          <Ionicons 
            name="calendar-outline" 
            size={16} 
            color={theme.colors.text.secondary}
            style={styles.periodIcon} 
          />
          <Text style={styles.periodText}>{priority.period}</Text>
        </View>
      )}
    </View>
  );
};

export default PriorityItem; 