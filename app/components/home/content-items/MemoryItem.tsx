import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

// Define a type for the memory object
export interface Memory {
  id: string;
  title: string;
  description: string;
  date: string;
  imageUrl?: string;
  tags?: string[];
}

interface MemoryItemProps {
  memory: Memory;
  isDarkMode: boolean;
}

export const MemoryItem: React.FC<MemoryItemProps> = ({ memory, isDarkMode }) => (
  <View style={[styles.contentCard, isDarkMode && styles.darkCard]}>
    {memory.imageUrl && (
      <View style={styles.memoryImageContainer}>
        <Image source={{ uri: memory.imageUrl }} style={styles.memoryImage} />
      </View>
    )}
    <View style={styles.memoryContent}>
      <Text style={[styles.memoryDate, isDarkMode && styles.darkTertiaryText]}>{memory.date}</Text>
      <Text style={[styles.memoryTitle, isDarkMode && styles.darkText]}>{memory.title}</Text>
      <Text style={[styles.memoryDescription, isDarkMode && styles.darkSecondaryText]} numberOfLines={3}>
        {memory.description}
      </Text>
      {memory.tags && memory.tags.length > 0 && (
        <View style={styles.tagContainer}>
          {memory.tags.map((tag, index) => (
            <View key={index} style={[styles.tag, isDarkMode && styles.darkTag]}>
              <Text style={[styles.tagText, isDarkMode && styles.darkTagText]}>{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  darkCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  memoryImageContainer: {
    height: 160,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  memoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  memoryContent: {
    gap: 6,
  },
  memoryDate: {
    fontSize: 13,
    color: '#8E8E93',
  },
  memoryTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  memoryDescription: {
    fontSize: 15,
    color: '#3C3C43',
    lineHeight: 20,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 6,
  },
  tag: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  darkTag: {
    backgroundColor: '#2C2C2E',
  },
  tagText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  darkTagText: {
    color: '#D1D1D6',
  },
  darkText: {
    color: '#FFFFFF',
  },
  darkSecondaryText: {
    color: '#EBEBF5',
  },
  darkTertiaryText: {
    color: '#8E8E93',
  },
});

export default MemoryItem; 