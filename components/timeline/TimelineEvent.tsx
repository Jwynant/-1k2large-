import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { ContentItem, ContentType } from '../../app/types';
import { Ionicons } from '@expo/vector-icons';

type TimelineEventProps = {
  item: ContentItem;
  position: number;
  leftPosition: number;
  onPress?: () => void;
};

export default function TimelineEvent({ 
  item, 
  position, 
  leftPosition,
  onPress 
}: TimelineEventProps) {
  const date = new Date(item.date);
  
  // Get icon based on content type
  const getIconName = (type: ContentType) => {
    switch (type) {
      case 'memory':
        return 'image-outline' as const;
      case 'goal':
        return 'flag-outline' as const;
      case 'insight':
        return 'bulb-outline' as const;
      default:
        return 'document-outline' as const;
    }
  };
  
  // Get color based on content type
  const getContentTypeColor = (type: ContentType): string => {
    switch (type) {
      case 'memory':
        return '#FF9500'; // Orange
      case 'goal':
        return '#007AFF'; // Blue
      case 'insight':
        return '#5856D6'; // Purple
      default:
        return '#8E8E93'; // Gray
    }
  };
  
  const backgroundColor = getContentTypeColor(item.type);
  const iconName = getIconName(item.type);
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          top: position - 15, // Center the event on the timeline
          left: leftPosition,
          borderColor: backgroundColor,
        }
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconContainer, { backgroundColor }]}>
        <Ionicons name={iconName} size={14} color="#FFFFFF" />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.date}>
          {format(date, 'MMM d, yyyy')}
        </Text>
        
        {item.notes && (
          <Text style={styles.notes} numberOfLines={2}>
            {item.notes}
          </Text>
        )}
        
        {/* Show emoji if available */}
        {item.emoji && (
          <Text style={styles.emoji}>{item.emoji}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flexDirection: 'row',
    backgroundColor: 'rgba(44, 44, 46, 0.8)',
    borderRadius: 8,
    padding: 8,
    borderLeftWidth: 3,
    width: 150,
    minHeight: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 5,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  content: {
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 14,
  },
  date: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginBottom: 4,
  },
  notes: {
    color: '#CCCCCC',
    fontSize: 12,
    lineHeight: 16,
  },
  emoji: {
    position: 'absolute',
    top: -2,
    right: -2,
    fontSize: 16,
  },
}); 