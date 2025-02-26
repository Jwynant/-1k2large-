import { View, Text, StyleSheet, Pressable, Dimensions, TouchableOpacity, SafeAreaView } from 'react-native';
import { useState, useEffect } from 'react';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';

type ExpandedClusterViewProps = {
  year: number;
  isCurrent: boolean;
  onClose: () => void;
  onCellPress?: (month: number) => void;
  onLongPress?: (month: number, position: { x: number, y: number }) => void;
};

export default function ExpandedClusterView({ year, isCurrent, onClose, onCellPress, onLongPress }: ExpandedClusterViewProps) {
  // Add debugging on mount
  useEffect(() => {
    console.log('ExpandedClusterView mounted with onClose function:', !!onClose);
  }, [onClose]);

  // Get screen dimensions for responsive layout
  const { width } = Dimensions.get('window');
  const cellSize = Math.min(width * 0.28, 100); // Responsive cell size
  
  // Create months data
  const months = [
    { name: 'January', shortName: 'Jan', index: 0 },
    { name: 'February', shortName: 'Feb', index: 1 },
    { name: 'March', shortName: 'Mar', index: 2 },
    { name: 'April', shortName: 'Apr', index: 3 },
    { name: 'May', shortName: 'May', index: 4 },
    { name: 'June', shortName: 'Jun', index: 5 },
    { name: 'July', shortName: 'Jul', index: 6 },
    { name: 'August', shortName: 'Aug', index: 7 },
    { name: 'September', shortName: 'Sep', index: 8 },
    { name: 'October', shortName: 'Oct', index: 9 },
    { name: 'November', shortName: 'Nov', index: 10 },
    { name: 'December', shortName: 'Dec', index: 11 },
  ];

  // Mock content indicators
  const hasContent = (month: number) => {
    // For demo purposes, add content indicators to specific months
    return (year === 23 && month === 4) || (year === 36 && month === 2);
  };

  // Determine if a month is filled (past)
  const isFilled = (month: number) => {
    return year < 23 || (year === 23 && month <= 4);
  };

  // Handle long press on a cell
  const handleLongPress = (month: number, event: any) => {
    if (onLongPress) {
      // Get the position of the press for the quick add menu
      // In a real app, we would use the event's coordinates
      // For now, just use a position near the cell
      const position = {
        x: event.nativeEvent.pageX - 100,
        y: event.nativeEvent.pageY - 50
      };
      onLongPress(month, position);
    }
  };

  // Handle back button press with additional logging
  const handleBackPress = () => {
    console.log('Back button pressed in ExpandedClusterView');
    console.log('onClose function exists:', !!onClose);
    
    // Call the onClose function passed from parent
    if (onClose) {
      onClose();
    } else {
      console.error('onClose function is not defined');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back button and swipe indicator */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBackPress}
          >
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          
          <View style={styles.swipeIndicatorContainer}>
            <View style={styles.swipeIndicator} />
            <Text style={styles.swipeText}>Swipe down to return to grid</Text>
          </View>
        </View>
      </View>

      {/* Age title */}
      <View style={styles.ageContainer}>
        <Text style={styles.ageNumber}>Age {year}</Text>
      </View>

      {/* Month grid */}
      <View style={styles.monthGrid}>
        {months.map((month, index) => {
          const row = Math.floor(index / 3);
          const isLastRow = row === 3;
          
          return (
            <Pressable 
              key={month.index} 
              style={[
                styles.monthCell,
                { width: cellSize, height: cellSize }
              ]}
              onPress={() => onCellPress && onCellPress(month.index)}
              onLongPress={(event) => handleLongPress(month.index, event)}
              delayLongPress={500}
            >
              <View 
                style={[
                  styles.monthBox,
                  isFilled(month.index) && styles.filledMonth
                ]}
              >
                <Text style={[
                  styles.monthName,
                  isFilled(month.index) && styles.filledMonthText
                ]}>
                  {month.shortName}
                </Text>
                
                {hasContent(month.index) && (
                  <View style={styles.contentIndicator} />
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  swipeIndicatorContainer: {
    alignItems: 'center',
    flex: 1,
  },
  swipeIndicator: {
    width: 36,
    height: 5,
    backgroundColor: '#ddd',
    borderRadius: 2.5,
    marginBottom: 4,
  },
  swipeText: {
    fontSize: 12,
    color: '#999',
  },
  ageContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  ageNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
  },
  monthCell: {
    marginBottom: 16,
    marginHorizontal: '1.5%',
  },
  monthBox: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  monthName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  filledMonth: {
    backgroundColor: '#000',
  },
  filledMonthText: {
    color: '#fff',
  },
  contentIndicator: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
});