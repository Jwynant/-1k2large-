import React from 'react';
import { View, Text, StyleSheet, Pressable, useColorScheme, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Priority, FilterOption, PriorityLevel } from './types';

type PrioritySelectorProps = {
  priorities: Priority[];
  selectedFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
  goalsCountByPriority: Record<string, number>;
  compact?: boolean;
};

/**
 * A component for selecting and filtering priorities
 */
export default function PrioritySelector({
  priorities,
  selectedFilter,
  onFilterChange,
  goalsCountByPriority,
  compact = false,
}: PrioritySelectorProps) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  // Quick filter options
  const quickFilters: { id: FilterOption; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'high', label: 'High' },
    { id: 'medium', label: 'Medium' },
    { id: 'low', label: 'Low' },
  ];
  
  return (
    <View style={[
      styles.container,
      compact && styles.compactContainer,
      isDarkMode && styles.darkContainer
    ]}>
      {!compact && (
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
          Priorities
        </Text>
      )}
      
      {/* Segmented filter control */}
      <View style={[
        styles.segmentedControl,
        isDarkMode && styles.darkSegmentedControl
      ]}>
        {quickFilters.map(filter => {
          const isSelected = selectedFilter === filter.id;
          return (
            <Pressable
              key={filter.id}
              style={[
                styles.segmentButton,
                isSelected && styles.selectedSegmentButton,
                isSelected && isDarkMode && styles.darkSelectedSegmentButton
              ]}
              onPress={() => onFilterChange(filter.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`Filter by ${filter.label} priority`}
            >
              <Text
                style={[
                  styles.segmentText,
                  isSelected && styles.selectedSegmentText,
                  isDarkMode && (isSelected ? styles.darkSelectedSegmentText : styles.darkSegmentText)
                ]}
              >
                {filter.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      
      {/* Detailed priority cards */}
      {!compact && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.cardsContainer}
          contentContainerStyle={styles.cardsContent}
        >
          {priorities.map(priority => {
            const isSelected = selectedFilter === priority.id;
            const goalsCount = goalsCountByPriority[priority.id] || 0;
            
            return (
              <Pressable 
                key={priority.id}
                style={[
                  styles.priorityCard,
                  isDarkMode ? styles.darkPriorityCard : styles.lightPriorityCard,
                  isSelected && [styles.selectedPriorityCard, { borderColor: priority.color }]
                ]}
                onPress={() => onFilterChange(isSelected ? 'all' : priority.id)}
              >
                <View style={[styles.priorityIconContainer, { backgroundColor: priority.color + '20' }]}>
                  <Ionicons name={priority.icon as any} size={22} color={priority.color} />
                </View>
                <Text 
                  style={[
                    styles.priorityTitle, 
                    isDarkMode && styles.darkText,
                    isSelected && { color: priority.color }
                  ]}
                  numberOfLines={1}
                >
                  {priority.title}
                </Text>
                <View style={styles.priorityMeta}>
                  <View style={[styles.priorityLevel, getPriorityLevelStyle(priority.level)]}>
                    <Text style={styles.priorityLevelText}>
                      {priority.level.toUpperCase()}
                    </Text>
                  </View>
                  
                  <View style={[styles.goalCountBadge, { backgroundColor: priority.color }]}>
                    <Text style={styles.goalCountText}>{goalsCount}</Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

// Helper to get styles for priority level badges
function getPriorityLevelStyle(level: PriorityLevel): object {
  switch (level) {
    case 'high':
      return { backgroundColor: 'rgba(255, 59, 48, 0.1)', borderColor: 'rgba(255, 59, 48, 0.3)' };
    case 'medium':
      return { backgroundColor: 'rgba(255, 149, 0, 0.1)', borderColor: 'rgba(255, 149, 0, 0.3)' };
    case 'low':
      return { backgroundColor: 'rgba(10, 132, 255, 0.1)', borderColor: 'rgba(10, 132, 255, 0.3)' };
    default:
      return { backgroundColor: 'rgba(142, 142, 147, 0.1)', borderColor: 'rgba(142, 142, 147, 0.3)' };
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  compactContainer: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  darkContainer: {
    backgroundColor: '#1C1C1E',
    borderBottomColor: '#2C2C2E',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  darkText: {
    color: '#FFFFFF',
  },
  // Segmented control styles
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 2,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  darkSegmentedControl: {
    backgroundColor: '#2C2C2E',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  selectedSegmentButton: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  darkSelectedSegmentButton: {
    backgroundColor: '#3A3A3C',
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
  },
  selectedSegmentText: {
    fontWeight: '600',
    color: '#000000',
  },
  darkSegmentText: {
    color: '#8E8E93',
  },
  darkSelectedSegmentText: {
    color: '#FFFFFF',
  },
  // Priority cards styles
  cardsContainer: {
    flexGrow: 0,
  },
  cardsContent: {
    paddingHorizontal: 12,
  },
  priorityCard: {
    width: 140,
    marginHorizontal: 4,
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedPriorityCard: {
    borderWidth: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  lightPriorityCard: {
    backgroundColor: '#FFFFFF',
  },
  darkPriorityCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  priorityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  priorityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  priorityMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priorityLevel: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  priorityLevelText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#8E8E93',
  },
  goalCountBadge: {
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  goalCountText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
}); 