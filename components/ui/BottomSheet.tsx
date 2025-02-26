import React from 'react';
import { View, Text, StyleSheet, Pressable, Modal, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ContentItem } from '../../app/context/AppContext';
import { useDateCalculations } from '../../app/hooks/useDateCalculations';
import { useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';

type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  content: ContentItem[];
  selectedCell?: { year: number; month?: number; week?: number };
};

export default function BottomSheet({ visible, onClose, content, selectedCell }: BottomSheetProps) {
  const { formatDate } = useDateCalculations();
  const router = useRouter();
  const translateY = useRef(new Animated.Value(300)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  // Generate title based on the first content item's date
  const getTitle = () => {
    if (content.length === 0) return 'No Content';
    
    const firstItem = content[0];
    return formatDate(firstItem.date);
  };

  useEffect(() => {
    if (visible) {
      // Animate in
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset values when hidden
      translateY.setValue(300);
      opacity.setValue(0);
    }
  }, [visible]);

  const handleContentPress = (item: ContentItem) => {
    if (!selectedCell) return;
    
    // Build query parameters
    const params = new URLSearchParams();
    params.append('year', selectedCell.year.toString());
    params.append('id', item.id);
    
    if (selectedCell.month !== undefined) {
      params.append('month', selectedCell.month.toString());
    }
    
    if (selectedCell.week !== undefined) {
      params.append('week', selectedCell.week.toString());
    }
    
    // Close the bottom sheet
    onClose();
    
    // Navigate to the content view screen
    router.push(`/content/view?${params.toString()}`);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ translateY }],
              opacity,
            },
          ]}
        >
          <Pressable style={styles.content} onPress={e => e.stopPropagation()}>
            <View style={styles.header}>
              <View style={styles.handle} />
              <Text style={styles.title}>{getTitle()}</Text>
              <Pressable style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close" size={24} color="#999" />
              </Pressable>
            </View>
            
            <ScrollView style={styles.scrollContent}>
              {content.length > 0 ? (
                content.map(item => (
                  <Pressable 
                    key={item.id} 
                    style={styles.contentItem}
                    onPress={() => handleContentPress(item)}
                  >
                    <View style={styles.contentHeader}>
                      <Text style={styles.contentTitle}>{item.title}</Text>
                      <View style={[styles.contentBadge, 
                        item.type === 'memory' && styles.memoryBadge,
                        item.type === 'lesson' && styles.lessonBadge,
                        item.type === 'goal' && styles.goalBadge,
                        item.type === 'reflection' && styles.reflectionBadge,
                      ]}>
                        <Text style={styles.contentBadgeText}>{item.type}</Text>
                      </View>
                    </View>
                    <Text style={styles.contentDate}>{formatDate(item.date)}</Text>
                    {item.notes && (
                      <Text 
                        style={styles.contentNotes}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {item.notes}
                      </Text>
                    )}
                  </Pressable>
                ))
              ) : (
                <View style={styles.emptyContent}>
                  <Text style={styles.emptyText}>No content for this time period</Text>
                  <Pressable 
                    style={styles.addContentButton}
                    onPress={onClose}
                  >
                    <Text style={styles.addContentButtonText}>Close</Text>
                  </Pressable>
                </View>
              )}
            </ScrollView>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  content: {
    width: '100%',
  },
  scrollContent: {
    maxHeight: '100%',
    padding: 16,
  },
  header: {
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    position: 'relative',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    padding: 4,
  },
  contentItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  contentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  contentBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  memoryBadge: {
    backgroundColor: '#4A90E2',
  },
  lessonBadge: {
    backgroundColor: '#50C878',
  },
  goalBadge: {
    backgroundColor: '#FF9500',
  },
  reflectionBadge: {
    backgroundColor: '#9B59B6',
  },
  contentDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  contentNotes: {
    fontSize: 16,
    lineHeight: 22,
  },
  emptyContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  addContentButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addContentButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
}); 