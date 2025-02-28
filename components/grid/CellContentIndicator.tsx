import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ContentItem } from '../../app/types';

interface CellContentIndicatorProps {
  content: ContentItem[];
  size?: 'small' | 'medium' | 'large';
}

/**
 * Component that displays indicators for different types of content in a cell
 * Shows emoji for memories, circle for lessons, triangle/star for goals
 * Also shows count indicators for multiple items
 */
export default function CellContentIndicator({ content, size = 'medium' }: CellContentIndicatorProps) {
  if (!content || content.length === 0) return null;

  // Count content by type
  const memories = content.filter(item => item.type === 'memory');
  const lessons = content.filter(item => item.type === 'lesson');
  const goals = content.filter(item => item.type === 'goal');
  const reflections = content.filter(item => item.type === 'reflection');

  // Determine indicator sizes based on the size prop
  const indicatorSize = size === 'small' ? 6 : size === 'medium' ? 8 : 10;
  const containerSize = size === 'small' ? 16 : size === 'medium' ? 20 : 24;
  const fontSize = size === 'small' ? 8 : size === 'medium' ? 10 : 12;

  return (
    <View style={styles.container}>
      {/* Memory Indicators */}
      {memories.length > 0 && (
        <View style={styles.indicatorWrapper}>
          {memories[0].emoji ? (
            <Text style={[styles.emoji, { fontSize }]}>{memories[0].emoji}</Text>
          ) : (
            <View style={[styles.memoryIndicator, { width: indicatorSize, height: indicatorSize }]} />
          )}
          {memories.length > 1 && (
            <Text style={[styles.count, { fontSize: fontSize - 2 }]}>{memories.length}</Text>
          )}
        </View>
      )}

      {/* Lesson Indicators */}
      {lessons.length > 0 && (
        <View style={styles.indicatorWrapper}>
          <View style={[styles.lessonIndicator, { width: indicatorSize, height: indicatorSize }]} />
          {lessons.length > 1 && (
            <Text style={[styles.count, { fontSize: fontSize - 2 }]}>{lessons.length}</Text>
          )}
        </View>
      )}

      {/* Goal Indicators */}
      {goals.length > 0 && (
        <View style={styles.indicatorWrapper}>
          <View style={[styles.goalIndicator, { width: indicatorSize, height: indicatorSize }]} />
          {goals.length > 1 && (
            <Text style={[styles.count, { fontSize: fontSize - 2 }]}>{goals.length}</Text>
          )}
        </View>
      )}

      {/* Reflection Indicators */}
      {reflections.length > 0 && (
        <View style={styles.indicatorWrapper}>
          <View style={[styles.reflectionIndicator, { width: indicatorSize, height: indicatorSize }]} />
          {reflections.length > 1 && (
            <Text style={[styles.count, { fontSize: fontSize - 2 }]}>{reflections.length}</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  indicatorWrapper: {
    position: 'relative',
    marginHorizontal: 2,
  },
  memoryIndicator: {
    backgroundColor: '#0A84FF', // iOS blue
    borderRadius: 2,
  },
  lessonIndicator: {
    backgroundColor: '#30D158', // iOS green
    borderRadius: 100, // Circle
  },
  goalIndicator: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FF9F0A', // iOS orange
  },
  reflectionIndicator: {
    backgroundColor: '#BF5AF2', // iOS purple
    borderRadius: 2,
    transform: [{ rotate: '45deg' }],
  },
  emoji: {
    textAlign: 'center',
  },
  count: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#1C1C1E', // iOS dark gray
    color: '#FFFFFF', // White
    borderRadius: 100,
    width: 12,
    height: 12,
    textAlign: 'center',
    lineHeight: 12,
    overflow: 'hidden',
    borderWidth: 1,
  },
}); 