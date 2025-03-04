import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStyles } from '../../../hooks';
import { useTheme } from '../../../theme';
import { Button } from '../../ui/Button';

export const EmptyGoals: React.FC = () => {
  const theme = useTheme();
  const styles = useStyles(theme => ({
    emptyStateContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.xl,
      backgroundColor: 'transparent',
    },
    emptyStateIconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.background.secondary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.md,
    },
    emptyStateTitle: {
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.semibold,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    emptyStateDescription: {
      fontSize: theme.typography.sizes.md,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
      paddingHorizontal: theme.spacing.md,
    },
  }));

  return (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyStateIconContainer}>
        <Ionicons name="flag" size={40} color={theme.colors.accent} />
      </View>
      <Text style={styles.emptyStateTitle}>No Goals Yet</Text>
      <Text style={styles.emptyStateDescription}>
        Set your intentions and track progress towards your goals.
      </Text>
      <Button 
        label="Create Your First Goal"
        onPress={() => {}}
        variant="primary"
      />
    </View>
  );
};

export default EmptyGoals; 