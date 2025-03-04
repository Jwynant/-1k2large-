import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useStyles } from '../../hooks';
import { useTheme } from '../../theme';

export type FilterOption = 'all' | 'goals' | 'memories' | 'lessons';

interface FilterTabsProps {
  selectedFilter: FilterOption;
  onSelectFilter: (filter: FilterOption) => void;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({ 
  selectedFilter, 
  onSelectFilter,
}) => {
  const theme = useTheme();
  const styles = useStyles(theme => ({
    filterContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.spacing.xs,
    },
    filterTab: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borders.radius.lg,
      backgroundColor: 'transparent',
    },
    selectedFilterTab: {
      backgroundColor: theme.colors.accent,
    },
    filterTabText: {
      fontSize: theme.typography.sizes.sm,
      fontWeight: theme.typography.weights.semibold,
      color: theme.colors.text.tertiary,
    },
    selectedFilterTabText: {
      color: theme.colors.text.inverse,
    },
  }));

  const filterOptions: { id: FilterOption; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'goals', label: 'Goals' },
    { id: 'memories', label: 'Memories' },
    { id: 'lessons', label: 'Lessons' },
  ];

  return (
    <View style={styles.filterContainer}>
      {filterOptions.map((option) => (
        <Pressable
          key={option.id}
          style={[
            styles.filterTab,
            selectedFilter === option.id && styles.selectedFilterTab,
          ]}
          onPress={() => onSelectFilter(option.id)}
        >
          <Text
            style={[
              styles.filterTabText,
              selectedFilter === option.id && styles.selectedFilterTabText,
            ]}
          >
            {option.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

export default FilterTabs; 