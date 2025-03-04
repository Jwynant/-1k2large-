import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { PriorityItem, Priority } from './content-items';
import { EmptyPriorities } from './empty-states';
import { useStyles } from '../../hooks';
import { useTheme } from '../../theme';
import { GradientBorder } from '../ui/GradientBorder';

interface FocusAreasProps {
  priorities: Priority[];
  onManagePress?: () => void;
}

export const FocusAreas: React.FC<FocusAreasProps> = ({
  priorities,
  onManagePress,
}) => {
  const theme = useTheme();
  const styles = useStyles(theme => ({
    focusAreasSection: {
      marginTop: theme.spacing.xs,
      marginBottom: theme.spacing.lg,
      paddingHorizontal: theme.spacing.screenPadding,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    sectionTitle: {
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.semibold,
      color: theme.colors.text.primary,
    },
    seeAllText: {
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.accent,
    },
    secondaryFocusHeading: {
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.semibold,
      color: theme.colors.text.secondary,
      marginVertical: theme.spacing.md,
    },
    secondaryFocusScrollContent: {
      paddingBottom: theme.spacing.sm,
      paddingRight: theme.spacing.screenPadding,
    },
    gradientBorderContainer: {
      marginTop: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
      borderRadius: theme.borders.radius.md,
    },
  }));

  const hasPriorities = priorities.length > 0;
  const primaryFocus = priorities.find(p => p.isPrimary);
  const secondaryFocus = priorities.filter(p => !p.isPrimary);

  return (
    <View style={styles.focusAreasSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Focus Areas
        </Text>
        <Pressable onPress={onManagePress}>
          <Text style={styles.seeAllText}>Manage</Text>
        </Pressable>
      </View>
      
      {hasPriorities ? (
        <View>
          {/* Primary Focus with gradient border */}
          {primaryFocus && (
            <GradientBorder 
              gradientType="blueTeal"
              width={2}
              radius={theme.borders.radius.md}
              style={styles.gradientBorderContainer}
            >
              <PriorityItem 
                priority={primaryFocus} 
                isPrimary={true}
              />
            </GradientBorder>
          )}
          
          {/* Secondary Focus Areas */}
          {secondaryFocus.length > 0 && (
            <>
              <Text style={styles.secondaryFocusHeading}>
                Supporting Focus Areas
              </Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.secondaryFocusScrollContent}
              >
                {secondaryFocus.map(priority => (
                  <PriorityItem 
                    key={priority.id} 
                    priority={priority} 
                  />
                ))}
              </ScrollView>
            </>
          )}
        </View>
      ) : (
        <EmptyPriorities />
      )}
    </View>
  );
};

export default FocusAreas; 