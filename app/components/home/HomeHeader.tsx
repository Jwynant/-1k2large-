import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FilterTabs, FilterOption } from './FilterTabs';

interface HomeHeaderProps {
  selectedFilter: FilterOption;
  onSelectFilter: (filter: FilterOption) => void;
  isDarkMode: boolean;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  selectedFilter,
  onSelectFilter,
  isDarkMode,
}) => {
  return (
    <View style={[styles.header, isDarkMode && styles.darkHeader]}>
      <FilterTabs
        selectedFilter={selectedFilter}
        onSelectFilter={onSelectFilter}
        isDarkMode={isDarkMode}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  darkHeader: {
    backgroundColor: '#1C1C1E',
    borderBottomColor: '#2C2C2E',
  },
});

export default HomeHeader; 