import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { format, parseISO } from 'date-fns';
import { Season } from '../../app/types';
import { Ionicons } from '@expo/vector-icons';

type SeasonBlockProps = {
  season: Season;
  startPosition: number;
  height: number;
  color?: string;
  onPress?: () => void;
  isExpanded?: boolean;
};

export default function SeasonBlock({ 
  season, 
  startPosition, 
  height, 
  color = '#FF9500', 
  onPress,
  isExpanded = false
}: SeasonBlockProps) {
  const { width } = useWindowDimensions();
  const startDate = parseISO(season.startDate);
  const endDate = parseISO(season.endDate);
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          top: startPosition,
          height: Math.max(height, 60), // Minimum height for visibility
          borderLeftColor: color,
        }
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{season.title}</Text>
        <Text style={styles.dates}>
          {format(startDate, 'MMM yyyy')} - {format(endDate, 'MMM yyyy')}
        </Text>
      </View>
      
      <Text 
        style={styles.description} 
        numberOfLines={isExpanded ? undefined : 2}
      >
        {season.description}
      </Text>
      
      {season.memories > 0 && (
        <View style={styles.memoryCount}>
          <Ionicons name="image-outline" size={14} color="#CCCCCC" />
          <Text style={styles.memoryCountText}>{season.memories}</Text>
        </View>
      )}
      
      {!isExpanded && (
        <View style={styles.expandButton}>
          <Ionicons name="chevron-down" size={16} color="#8E8E93" />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: 'rgba(44, 44, 46, 0.8)',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    marginLeft: 50, // Space for timeline
    right: 10,
    left: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  dates: {
    color: '#8E8E93',
    fontSize: 12,
  },
  description: {
    color: '#CCCCCC',
    fontSize: 14,
    lineHeight: 20,
  },
  memoryCount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  memoryCountText: {
    color: '#CCCCCC',
    fontSize: 12,
    marginLeft: 4,
  },
  expandButton: {
    position: 'absolute',
    bottom: 4,
    right: 8,
    padding: 4,
  },
}); 