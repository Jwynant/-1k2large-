import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const WeekExpandedView = ({ year, onWeekPress, onClose }: WeekExpandedViewProps) => {
  const renderWeek = (weekNumber: number) => {
    const isCurrentWeek = weekNumber === getCurrentWeekNumber();
    
    return (
      <TouchableOpacity
        key={weekNumber}
        style={[
          styles.weekCell,
          isCurrentWeek && styles.currentWeekCell
        ]}
        onPress={() => onWeekPress(weekNumber)}
      >
        <Text style={styles.weekText}>Week {weekNumber}</Text>
      </TouchableOpacity>
    );
  };

  return (
    // ... existing code ...
  );
};

const styles = StyleSheet.create({
  weekCell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    margin: 4,
    borderRadius: 8,
    padding: 12,
  },
  currentWeekCell: {
    borderWidth: 2,
    borderColor: '#FFD700', // Gold accent color for current week
  },
  weekText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  // ... existing code ...
});

export default WeekExpandedView; 