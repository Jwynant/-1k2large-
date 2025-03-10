import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, ScrollView } from 'react-native';
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
        <View style={styles.contentItemHeader}>
          <View style={styles.contentTypeContainer}>
            <View 
              style={[
                styles.contentTypeIndicator, 
                { backgroundColor: getContentTypeColor(item.type) }
              ]}
            />
            <Ionicons 
              name={getContentTypeIcon(item.type)} 
              size={16} 
              color={getContentTypeColor(item.type)} 
            />
            <Text style={styles.contentType}>
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </Text>
          </View>
          <Text style={styles.contentDate}>{formatItemDate(item.date)}</Text>
        </View>
        
        <Text style={styles.contentTitle}>{item.title}</Text>
        
        {item.notes && (
          <Text style={styles.contentNotes} numberOfLines={2}>
            {item.notes}
          </Text>
        )}
        
        {item.type === 'goal' && item.focusAreaId && (
          <View style={styles.focusAreaTag}>
            <View 
              style={[
                styles.focusAreaIndicator, 
                { backgroundColor: getFocusAreaColor(item.focusAreaId) }
              ]}
            />
            <Text style={styles.focusAreaName}>
              {focusAreas.find(a => a.id === item.focusAreaId)?.name || 'Unknown Focus Area'}
            </Text>
          </View>
        )}
        
        {item.type === 'goal' && typeof item.progress === 'number' && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${item.progress}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>{item.progress}%</Text>
          </View>
        )}
      </Pressable>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Content</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search content..."
          placeholderTextColor="#8E8E93"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <View style={styles.filterContainer}>
        <Pressable
          style={[
            styles.filterButton,
            selectedType === null && styles.filterButtonActive
          ]}
          onPress={() => setSelectedType(null)}
        >
          <Text 
            style={[
              styles.filterButtonText,
              selectedType === null && styles.filterButtonTextActive
            ]}
          >
            All
          </Text>
        </Pressable>
        
        <Pressable
          style={[
            styles.filterButton,
            selectedType === 'goal' && styles.filterButtonActive
          ]}
          onPress={() => setSelectedType('goal')}
        >
          <Text 
            style={[
              styles.filterButtonText,
              selectedType === 'goal' && styles.filterButtonTextActive
            ]}
          >
            Goals
          </Text>
        </Pressable>
        
        <Pressable
          style={[
            styles.filterButton,
            selectedType === 'memory' && styles.filterButtonActive
          ]}
          onPress={() => setSelectedType('memory')}
        >
          <Text 
            style={[
              styles.filterButtonText,
              selectedType === 'memory' && styles.filterButtonTextActive
            ]}
          >
            Memories
          </Text>
        </Pressable>
      </View>
      
      {selectedType === 'goal' && (
        <View style={styles.focusAreaFilterContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.focusAreaFilterScroll}
          >
            <Pressable
              style={[
                styles.focusAreaFilterButton,
                selectedFocusArea === null && styles.focusAreaFilterButtonActive
              ]}
              onPress={() => setSelectedFocusArea(null)}
            >
              <Text 
                style={[
                  styles.focusAreaFilterButtonText,
                  selectedFocusArea === null && styles.focusAreaFilterButtonTextActive
                ]}
              >
                All Focus Areas
              </Text>
            </Pressable>
            
            {focusAreas.map(area => (
              <Pressable
                key={area.id}
                style={[
                  styles.focusAreaFilterButton,
                  selectedFocusArea === area.id && styles.focusAreaFilterButtonActive,
                  { borderColor: area.color }
                ]}
                onPress={() => setSelectedFocusArea(area.id)}
              >
                <View 
                  style={[
                    styles.focusAreaFilterIndicator, 
                    { backgroundColor: area.color }
                  ]}
                />
                <Text 
                  style={[
                    styles.focusAreaFilterButtonText,
                    selectedFocusArea === area.id && styles.focusAreaFilterButtonTextActive
                  ]}
                >
                  {area.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
      
      <FlatList
        data={filteredItems}
        renderItem={renderContentItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.contentList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={48} color="#8E8E93" />
            <Text style={styles.emptyText}>No content found</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery 
                ? 'Try a different search term' 
                : 'Add some goals or memories to get started'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#FFFFFF',
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#2C2C2E',
  },
  filterButtonActive: {
    backgroundColor: '#0A84FF',
  },
  filterButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  focusAreaFilterContainer: {
    marginBottom: 16,
  },
  focusAreaFilterScroll: {
    paddingHorizontal: 20,
  },
  focusAreaFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#2C2C2E',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  focusAreaFilterButtonActive: {
    backgroundColor: '#2C2C2E',
  },
  focusAreaFilterIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  focusAreaFilterButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  focusAreaFilterButtonTextActive: {
    fontWeight: '600',
  },
  contentList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  contentItem: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  contentItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  contentTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentTypeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  contentType: {
    color: '#AEAEB2',
    fontSize: 14,
    marginLeft: 4,
  },
  contentDate: {
    color: '#AEAEB2',
    fontSize: 14,
  },
  contentTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  contentNotes: {
    color: '#AEAEB2',
    fontSize: 14,
    marginBottom: 12,
  },
  focusAreaTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 8,
  },
  focusAreaIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  focusAreaName: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#1C1C1E',
    borderRadius: 3,
    marginRight: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0A84FF',
    borderRadius: 3,
  },
  progressText: {
    color: '#AEAEB2',
    fontSize: 12,
    width: 40,
    textAlign: 'right',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    color: '#8E8E93',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
  },
}); 