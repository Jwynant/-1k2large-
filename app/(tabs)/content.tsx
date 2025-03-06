import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import { useFocusAreas } from '../hooks/useFocusAreas';
import { useContentManagement } from '../hooks/useContentManagement';
import { ContentItem } from '../types';
import { format } from 'date-fns';

export default function ContentScreen() {
  const { state } = useAppContext();
  const { contentItems } = state;
  const { focusAreas } = useFocusAreas();
  
  // State for content filtering
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedFocusArea, setSelectedFocusArea] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get filtered content items
  const filteredItems = contentItems.filter(item => {
    // Filter by type if selected
    if (selectedType && item.type !== selectedType) {
      return false;
    }
    
    // Filter by focus area if selected (only applies to goals)
    if (selectedFocusArea && item.type === 'goal') {
      if (item.focusAreaId !== selectedFocusArea) {
        return false;
      }
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(query) ||
        (item.notes && item.notes.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
  
  // Get color for content type
  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'goal':
        return '#0A84FF'; // Blue
      case 'memory':
        return '#4CD964'; // Green
      case 'insight':
        return '#FF9500'; // Orange
      default:
        return '#8E8E93'; // Gray
    }
  };
  
  // Get icon for content type
  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'goal':
        return 'flag';
      case 'memory':
        return 'image';
      case 'insight':
        return 'bulb';
      default:
        return 'document';
    }
  };
  
  // Get focus area color
  const getFocusAreaColor = (focusAreaId: string | undefined) => {
    if (!focusAreaId) return '#8E8E93';
    const area = focusAreas.find(a => a.id === focusAreaId);
    return area ? area.color : '#8E8E93';
  };
  
  // Format date
  const formatItemDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  // Render content item
  const renderContentItem = ({ item }: { item: ContentItem }) => {
    return (
      <Pressable 
        style={styles.contentItem}
        onPress={() => {
          // Navigate to content detail view
          // router.push(`/content/${item.id}`);
        }}
      >
        <View style={[styles.contentTypeIndicator, { backgroundColor: getContentTypeColor(item.type) }]}>
          <Ionicons name={getContentTypeIcon(item.type)} size={16} color="#FFFFFF" />
        </View>
        
        <View style={styles.contentInfo}>
          <Text style={styles.contentTitle}>{item.title}</Text>
          {item.notes && (
            <Text style={styles.contentNotes} numberOfLines={1}>
              {item.notes}
            </Text>
          )}
          <Text style={styles.contentDate}>{formatItemDate(item.date)}</Text>
        </View>
        
        {/* Goal-specific UI */}
        {item.type === 'goal' && (
          <View style={styles.contentExtra}>
            {item.progress !== undefined && (
              <View style={styles.progressContainer}>
                <View 
                  style={[
                    styles.progressBar, 
                    { 
                      width: `${item.progress}%`,
                      backgroundColor: getFocusAreaColor(item.focusAreaId)
                    }
                  ]} 
                />
              </View>
            )}
            {item.focusAreaId && (
              <View 
                style={[
                  styles.focusIndicator, 
                  { backgroundColor: getFocusAreaColor(item.focusAreaId) }
                ]} 
              />
            )}
          </View>
        )}
        
        {/* Memory-specific UI */}
        {item.type === 'memory' && item.media && item.media.length > 0 && (
          <View style={styles.mediaIndicator}>
            <Ionicons name="images" size={16} color="#4CD964" />
            <Text style={styles.mediaCount}>{item.media.length}</Text>
          </View>
        )}
        
        {/* Insight-specific UI */}
        {item.type === 'insight' && item.importance !== undefined && (
          <View style={styles.importanceContainer}>
            {Array.from({ length: 5 }).map((_, i) => (
              <View 
                key={i}
                style={[
                  styles.importanceDot,
                  { 
                    backgroundColor: i < item.importance! ? '#FF9500' : '#3A3A3C' 
                  }
                ]}
              />
            ))}
          </View>
        )}
        
        <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
      </Pressable>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Content Library</Text>
        
        {/* Search bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search content..."
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#8E8E93" />
            </Pressable>
          )}
        </View>
        
        {/* Filter tabs */}
        <View style={styles.filterTabs}>
          <Pressable
            style={[
              styles.filterTab,
              selectedType === null && styles.filterTabActive
            ]}
            onPress={() => setSelectedType(null)}
          >
            <Text 
              style={[
                styles.filterTabText,
                selectedType === null && styles.filterTabTextActive
              ]}
            >
              All
            </Text>
          </Pressable>
          
          <Pressable
            style={[
              styles.filterTab,
              selectedType === 'goal' && styles.filterTabActive
            ]}
            onPress={() => setSelectedType('goal')}
          >
            <Text 
              style={[
                styles.filterTabText,
                selectedType === 'goal' && styles.filterTabTextActive
              ]}
            >
              Goals
            </Text>
          </Pressable>
          
          <Pressable
            style={[
              styles.filterTab,
              selectedType === 'memory' && styles.filterTabActive
            ]}
            onPress={() => setSelectedType('memory')}
          >
            <Text 
              style={[
                styles.filterTabText,
                selectedType === 'memory' && styles.filterTabTextActive
              ]}
            >
              Memories
            </Text>
          </Pressable>
          
          <Pressable
            style={[
              styles.filterTab,
              selectedType === 'insight' && styles.filterTabActive
            ]}
            onPress={() => setSelectedType('insight')}
          >
            <Text 
              style={[
                styles.filterTabText,
                selectedType === 'insight' && styles.filterTabTextActive
              ]}
            >
              Insights
            </Text>
          </Pressable>
        </View>
      </View>
      
      {/* Content list */}
      <FlatList
        data={filteredItems}
        renderItem={renderContentItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color="#8E8E93" />
            <Text style={styles.emptyText}>No content items found</Text>
            {searchQuery.length > 0 && (
              <Text style={styles.emptySubtext}>Try a different search term</Text>
            )}
            {selectedType && (
              <Pressable
                style={styles.resetFilterButton}
                onPress={() => {
                  setSelectedType(null);
                  setSelectedFocusArea(null);
                }}
              >
                <Text style={styles.resetFilterText}>Reset Filters</Text>
              </Pressable>
            )}
          </View>
        )}
      />
      
      {/* Floating add button */}
      <Pressable style={styles.addButton}>
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark mode background
  },
  header: {
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#FFFFFF',
  },
  filterTabs: {
    flexDirection: 'row',
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginRight: 8,
  },
  filterTabActive: {
    backgroundColor: '#0A84FF',
  },
  filterTabText: {
    color: '#8E8E93',
    fontWeight: '500',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
  },
  contentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  contentTypeIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0A84FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contentInfo: {
    flex: 1,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  contentNotes: {
    fontSize: 14,
    color: '#AEAEB2',
    marginBottom: 4,
  },
  contentDate: {
    fontSize: 12,
    color: '#8E8E93',
  },
  contentExtra: {
    marginLeft: 8,
    alignItems: 'flex-end',
  },
  progressContainer: {
    width: 48,
    height: 6,
    backgroundColor: '#3A3A3C',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#0A84FF',
  },
  focusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  mediaIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  mediaCount: {
    fontSize: 14,
    color: '#4CD964',
    marginLeft: 4,
  },
  importanceContainer: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  importanceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 8,
  },
  resetFilterButton: {
    backgroundColor: '#0A84FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  resetFilterText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0A84FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
}); 