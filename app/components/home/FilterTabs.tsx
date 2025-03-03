import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export type FilterOption = 'all' | 'goals' | 'memories' | 'lessons';

interface FilterTabsProps {
  selectedFilter: FilterOption;
  onSelectFilter: (filter: FilterOption) => void;
  isDarkMode: boolean;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({ 
  selectedFilter, 
  onSelectFilter,
  isDarkMode 
}) => {
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
            isDarkMode && selectedFilter === option.id && styles.darkSelectedFilterTab
          ]}
          onPress={() => onSelectFilter(option.id)}
        >
          <Text
            style={[
              styles.filterTabText,
              selectedFilter === option.id && styles.selectedFilterTabText,
              isDarkMode && styles.darkFilterTabText,
              isDarkMode && selectedFilter === option.id && styles.darkSelectedFilterTabText
            ]}
          >
            {option.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  selectedFilterTab: {
    backgroundColor: '#007AFF',
  },
  darkSelectedFilterTab: {
    backgroundColor: '#0A84FF',
  },
  filterTabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8E8E93',
  },
  selectedFilterTabText: {
    color: '#FFFFFF',
  },
  darkFilterTabText: {
    color: '#8E8E93',
  },
  darkSelectedFilterTabText: {
    color: '#FFFFFF',
  },
});

export default FilterTabs; 