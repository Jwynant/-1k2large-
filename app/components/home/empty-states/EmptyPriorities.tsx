import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStyles } from '../../../hooks';
import { useTheme } from '../../../theme';
import { Button } from '../../ui/Button';

export const EmptyPriorities: React.FC = () => {
  const theme = useTheme();
  const styles = useStyles(theme => ({
    emptyPrioritiesContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.lg,
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
    emptyPrioritiesTitle: {
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.semibold,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    emptyPrioritiesDescription: {
      fontSize: theme.typography.sizes.md,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
      paddingHorizontal: theme.spacing.md,
    },
  }));

  return (
    <View style={styles.emptyPrioritiesContainer}>
      <View style={styles.emptyStateIconContainer}>
        <Ionicons name="compass" size={36} color={theme.colors.warning} />
      </View>
      <Text style={styles.emptyPrioritiesTitle}>Define Your Focus Areas</Text>
      <Text style={styles.emptyPrioritiesDescription}>
        What life domains need your attention right now? Set high-level focus areas to guide your daily decisions.
      </Text>
      <Button 
        label="Set Focus Areas"
        onPress={() => {}}
        variant="primary"
      />
    </View>
  );
};

export default EmptyPriorities; 