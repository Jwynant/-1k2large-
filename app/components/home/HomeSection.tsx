import React, { ReactNode } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useStyles } from '../../hooks';
import { useTheme } from '../../theme';

interface HomeSectionProps {
  title: string;
  showSeeAll?: boolean;
  onSeeAllPress?: () => void;
  seeAllText?: string;
  children: ReactNode;
  isHighlighted?: boolean;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  title,
  showSeeAll = true,
  onSeeAllPress,
  seeAllText = 'See All',
  children,
  isHighlighted = false,
}) => {
  const theme = useTheme();
  
  const styles = useStyles(theme => ({
    section: {
      marginTop: theme.spacing.md,
      paddingHorizontal: theme.spacing.screenPadding,
      marginBottom: theme.spacing.lg,
    },
    highlightedSection: {
      borderLeftWidth: theme.borders.width.accent,
      borderLeftColor: theme.colors.accent,
      borderRadius: theme.borders.radius.md,
      borderColor: 'transparent',
      paddingLeft: theme.spacing.sm,
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
  }));

  return (
    <View style={[styles.section, isHighlighted && styles.highlightedSection]}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {showSeeAll && (
          <Pressable onPress={onSeeAllPress}>
            <Text style={styles.seeAllText}>{seeAllText}</Text>
          </Pressable>
        )}
      </View>
      {children}
    </View>
  );
};

export default HomeSection; 