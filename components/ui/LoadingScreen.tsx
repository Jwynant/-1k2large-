import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  runOnJS
} from 'react-native-reanimated';

type LoadingScreenProps = {
  message?: string;
  gridSize?: number;
  animationDuration?: number;
  delayBetweenCells?: number;
};

export default function LoadingScreen({ 
  message = 'Loading your life timeline...', 
  gridSize = 5,
  animationDuration = 600,
  delayBetweenCells = 100
}: LoadingScreenProps) {
  // Create a matrix to track the fill state of each cell
  const gridMatrix = Array(gridSize).fill(0).map(() => 
    Array(gridSize).fill(0).map(() => useSharedValue(0))
  );
  
  useEffect(() => {
    const animateGrid = () => {
      // Flatten the grid for sequential animation
      const cells = gridMatrix.flat();
      const totalCells = cells.length;
      
      // Start the animation sequence
      cells.forEach((cell, index) => {
        cell.value = withDelay(
          index * delayBetweenCells,
          withTiming(1, { duration: animationDuration }, (finished) => {
            // When we reach the last cell, restart the animation
            if (finished && index === totalCells - 1) {
              runOnJS(resetAndRestart)();
            }
          })
        );
      });
    };
    
    const resetAndRestart = () => {
      // Reset all cells
      gridMatrix.flat().forEach(cell => {
        cell.value = 0;
      });
      
      // Wait a moment before restarting
      setTimeout(animateGrid, 500);
    };
    
    // Start the initial animation
    animateGrid();
  }, []);
  
  // Calculate cell size based on screen dimensions
  const screenWidth = Dimensions.get('window').width;
  const cellSize = Math.min(screenWidth * 0.8 / gridSize, 30);
  const gridWidth = cellSize * gridSize;
  
  return (
    <View style={styles.container}>
      <View style={[styles.gridContainer, { width: gridWidth, height: gridWidth }]}>
        {gridMatrix.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((cell, colIndex) => {
              const animatedStyle = useAnimatedStyle(() => ({
                backgroundColor: cell.value === 1 ? '#ffffff' : 'transparent',
                borderColor: '#ffffff',
                opacity: 0.6 + (cell.value * 0.4), // Increase opacity as cell fills
              }));
              
              return (
                <Animated.View
                  key={`cell-${rowIndex}-${colIndex}`}
                  style={[
                    styles.cell,
                    { width: cellSize, height: cellSize },
                    animatedStyle
                  ]}
                />
              );
            })}
          </View>
        ))}
      </View>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212', // Dark background
    padding: 20,
  },
  gridContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    margin: 2,
    borderWidth: 1,
    borderRadius: 3,
  },
  message: {
    marginTop: 30,
    fontSize: 16,
    color: '#ffffff', // White text for dark background
    textAlign: 'center',
  },
}); 