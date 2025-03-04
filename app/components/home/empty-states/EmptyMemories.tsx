import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStyles } from '../../../hooks';
import { useTheme } from '../../../theme';
import { Button } from '../../ui/Button';

export const EmptyMemories: React.FC = () => {
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
        <Ionicons name="images" size={40} color={theme.colors.positive} />
      </View>
      <Text style={styles.emptyStateTitle}>No Memories Yet</Text>
      <Text style={styles.emptyStateDescription}>
        Capture and revisit meaningful moments from your life journey.
      </Text>
      <Button 
        label="Record a Memory"
        onPress={() => {}}
        variant="primary"
      />
    </View>
  );
};

export default EmptyMemories; 