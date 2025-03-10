import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Pressable, 
  TouchableOpacity,
  useColorScheme,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../../context/AppContext';
import { useFocusAreas } from '../../hooks/useFocusAreas';
import { ContentItem } from '../../types';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';

interface SimplifiedContentLibraryProps {
  maxItems?: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export default function SimplifiedContentLibrary({ 
  maxItems = 3,
  isExpanded,
  onToggleExpand
}: SimplifiedContentLibraryProps) {
  const { state } = useAppContext();
  const { contentItems } = state;
  const { focusAreas } = useFocusAreas();
  const router = useRouter();
  
  // Get color scheme
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  // State for content filtering
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  // Get filtered content items
  const filteredItems = contentItems
    .filter(item => selectedType ? item.type === selectedType : true)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Get displayed items based on expanded state
  const displayedItems = isExpanded 
    ? filteredItems 
    : filteredItems.slice(0, maxItems);
  
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
  
  // Get focus area name
  const getFocusAreaName = (focusAreaId: string | undefined) => {
    if (!focusAreaId) return '';
    const area = focusAreas.find(a => a.id === focusAreaId);
    return area ? area.name : '';
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
  
  // Navigate to content detail
  const handleContentPress = (item: ContentItem) => {
    // Navigate to content detail view
    // router.push(`/content/${item.id}`);
  };
  
  // Navigate to content creation
  const handleAddContent = (type: 'memory' | 'goal') => {
    router.push({
      pathname: "/content/new",
      params: { type }
    } as any);
  };
  
  // Render content item
  const renderContentItem = ({ item }: { item: ContentItem }) => {
    return (
      <TouchableOpacity 
        style={styles.contentItem}
        onPress={() => handleContentPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.contentItemHeader}>
          <View style={styles.contentTypeContainer}>
            <Ionicons 
              name={getContentTypeIcon(item.type)} 
              size={16} 
              color={getContentTypeColor(item.type)} 
              style={styles.contentTypeIcon}
            />
            <Text style={styles.contentType}>
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </Text>
          </View>
          <Text style={styles.contentDate}>{formatItemDate(item.date)}</Text>
        </View>
        
        <Text style={styles.contentTitle} numberOfLines={2}>
          {item.emoji ? `${item.emoji} ${item.title}` : item.title}
        </Text>
        
        {item.type === 'goal' && item.focusAreaId && (
          <View style={[
            styles.focusAreaTag,
            { backgroundColor: getFocusAreaColor(item.focusAreaId) + '20' }
          ]}>
            <View 
              style={[
                styles.focusAreaIndicator, 
                { backgroundColor: getFocusAreaColor(item.focusAreaId) }
              ]}
            />
            <Text style={[
              styles.focusAreaName,
              { color: getFocusAreaColor(item.focusAreaId) }
            ]}>
              {getFocusAreaName(item.focusAreaId)}
            </Text>
          </View>
        )}
        
        {item.type === 'memory' && item.media && item.media.length > 0 && (
          <View style={styles.mediaPreviewContainer}>
            <Image 
              source={{ uri: item.media[0] }}
              style={styles.mediaPreview}
              resizeMode="cover"
            />
            {item.media.length > 1 && (
              <View style={styles.mediaCountBadge}>
                <Text style={styles.mediaCountText}>+{item.media.length - 1}</Text>
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };
  
  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons 
        name="library-outline" 
        size={48} 
        color="#8E8E93" 
        style={styles.emptyIcon}
      />
      <Text style={styles.emptyTitle}>No Content Yet</Text>
      <Text style={styles.emptyDescription}>
        Start adding memories and goals to build your life library
      </Text>
      <View style={styles.emptyActionButtons}>
        <TouchableOpacity 
          style={[styles.emptyActionButton, { backgroundColor: '#4CD964' }]}
          onPress={() => handleAddContent('memory')}
        >
          <Ionicons name="image" size={20} color="#FFFFFF" />
          <Text style={styles.emptyActionButtonText}>Add Memory</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.emptyActionButton, { backgroundColor: '#0A84FF' }]}
          onPress={() => handleAddContent('goal')}
        >
          <Ionicons name="flag" size={20} color="#FFFFFF" />
          <Text style={styles.emptyActionButtonText}>Add Goal</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Filter buttons */}
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
      </View>
      
      {/* Content list */}
      {contentItems.length > 0 ? (
        <>
          <FlatList
            data={displayedItems}
            renderItem={renderContentItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.contentList}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
          />
          
          {filteredItems.length > maxItems && !isExpanded && (
            <TouchableOpacity 
              style={styles.viewMoreButton}
              onPress={onToggleExpand}
            >
              <Text style={styles.viewMoreText}>
                View {filteredItems.length - maxItems} More Items
              </Text>
              <Ionicons name="chevron-down" size={16} color="#0A84FF" />
            </TouchableOpacity>
          )}
          
          {isExpanded && (
            <TouchableOpacity 
              style={styles.viewMoreButton}
              onPress={onToggleExpand}
            >
              <Text style={styles.viewMoreText}>Show Less</Text>
              <Ionicons name="chevron-up" size={16} color="#0A84FF" />
            </TouchableOpacity>
          )}
        </>
      ) : (
        renderEmptyState()
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: 'rgba(142, 142, 147, 0.1)',
  },
  filterButtonActive: {
    backgroundColor: 'rgba(10, 132, 255, 0.2)',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  filterButtonTextActive: {
    color: '#0A84FF',
    fontWeight: '600',
  },
  contentList: {
    paddingBottom: 8,
  },
  itemSeparator: {
    height: 12,
  },
  contentItem: {
    backgroundColor: '#3A3A3C',
    borderRadius: 12,
    padding: 12,
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
  contentTypeIcon: {
    marginRight: 6,
  },
  contentType: {
    fontSize: 12,
    color: '#AEAEB2',
    fontWeight: '500',
  },
  contentDate: {
    fontSize: 12,
    color: '#8E8E93',
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  focusAreaTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginTop: 4,
  },
  focusAreaIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  focusAreaName: {
    fontSize: 12,
    fontWeight: '500',
  },
  mediaPreviewContainer: {
    marginTop: 8,
    position: 'relative',
  },
  mediaPreview: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  mediaCountBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  mediaCountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: 'rgba(10, 132, 255, 0.1)',
    borderRadius: 12,
    marginTop: 8,
  },
  viewMoreText: {
    color: '#0A84FF',
    fontWeight: '600',
    fontSize: 14,
    marginRight: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyActionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  emptyActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 6,
  },
  emptyActionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 8,
  },
}); 