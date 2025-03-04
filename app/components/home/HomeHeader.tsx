import React from 'react';
import { View } from 'react-native';
import { FilterTabs, FilterOption } from './FilterTabs';
import { useStyles } from '../../hooks';
import { useTheme } from '../../theme';

interface HomeHeaderProps {
  selectedFilter: FilterOption;
  onSelectFilter: (filter: FilterOption) => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  selectedFilter,
  onSelectFilter,
}) => {
  const theme = useTheme();
  const styles = useStyles(theme => ({
    header: {
      backgroundColor: theme.colors.background.primary,
      padding: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
      borderBottomWidth: theme.borders.width.thin,
      borderBottomColor: theme.colors.border.light,
    },
  }));

  return (
    <View style={styles.header}>
      <FilterTabs
        selectedFilter={selectedFilter}
        onSelectFilter={onSelectFilter}
      />
    </View>
  );
};

export default HomeHeader; 