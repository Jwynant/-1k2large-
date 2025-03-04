import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { useStyles } from '../../hooks';

interface ThemedCardProps {
  title: string;
  description: string;
  type?: 'neutral' | 'positive' | 'negative';
  children?: React.ReactNode;
}

/**
 * A themed card component that demonstrates the use of our theme system
 */
export const ThemedCard: React.FC<ThemedCardProps> = ({
  title,
  description,
  type = 'neutral',
  children,
}) => {
  const theme = useTheme();
  
  // Get the appropriate border color based on type
  const getBorderColor = () => {
    switch (type) {
      case 'positive':
        return theme.colors.positive;
      case 'negative':
        return theme.colors.negative;
      default:
        return theme.colors.accent;
    }
  };
  
  // Use the useStyles hook for themed styles
  const styles = useStyles(theme => ({
    container: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borders.radius.md,
      borderLeftWidth: theme.borders.width.accent,
      borderLeftColor: getBorderColor(),
      borderTopWidth: 1,
      borderRightWidth: 1,
      borderBottomWidth: 1,
      borderTopColor: theme.colors.border.light,
      borderRightColor: theme.colors.border.light,
      borderBottomColor: theme.colors.border.light,
      padding: theme.spacing.lg,
      marginVertical: theme.spacing.md,
      ...theme.borders.shadow.sm,
    },
    title: {
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.semibold,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.xs,
    },
    description: {
      fontSize: theme.typography.sizes.md,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.md,
    },
    badge: {
      position: 'absolute',
      top: theme.spacing.sm,
      right: theme.spacing.sm,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs / 2,
      borderRadius: theme.borders.radius.sm,
      backgroundColor: type === 'positive' 
        ? theme.colors.positive 
        : type === 'negative' 
          ? theme.colors.negative 
          : theme.colors.accent,
    },
    badgeText: {
      color: theme.colors.text.inverse,
      fontSize: theme.typography.sizes.xs,
      fontWeight: theme.typography.weights.semibold,
    },
    childrenContainer: {
      marginTop: theme.spacing.md,
    },
  }));
  
  // Badge label based on type
  const getBadgeLabel = () => {
    switch (type) {
      case 'positive':
        return 'Positive';
      case 'negative':
        return 'Negative';
      default:
        return 'Neutral';
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{getBadgeLabel()}</Text>
      </View>
      
      {children && (
        <View style={styles.childrenContainer}>
          {children}
        </View>
      )}
    </View>
  );
};

export default ThemedCard; 