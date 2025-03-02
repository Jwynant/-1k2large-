import { View, Text, StyleSheet, ScrollView, Pressable, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Season = {
  id: string;
  title: string;
  startDate: string;
  endDate?: string;
  description: string;
  memories: number;
};

const seasons: Season[] = [
  {
    id: '1',
    title: 'Career Transition',
    startDate: '2023-01',
    endDate: '2023-06',
    description: 'Transitioning from corporate role to freelance work',
    memories: 12,
  },
  {
    id: '2',
    title: 'Health Focus',
    startDate: '2023-07',
    description: 'Prioritizing health and wellness routines',
    memories: 8,
  },
];

export default function TimelineScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={[styles.header, isDarkMode && styles.darkHeader]}>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>Timeline</Text>
        <Text style={[styles.subtitle, isDarkMode && styles.darkSubtitle]}>View your life seasons</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.timeline}>
          {seasons.map((season, index) => (
            <View key={season.id} style={styles.timelineItem}>
              <View style={styles.timelineMarkerContainer}>
                <View style={styles.timelineLine} />
                <View style={[styles.timelineMarker, { backgroundColor: index === 0 ? '#FF9500' : '#0A84FF' }]} />
              </View>
              
              <Pressable style={[styles.seasonCard, isDarkMode && styles.darkCard]}>
                <View style={styles.seasonContent}>
                  <View style={styles.seasonHeader}>
                    <Text style={[styles.seasonTitle, isDarkMode && styles.darkText]}>{season.title}</Text>
                    <Text style={[styles.seasonDate, isDarkMode && styles.darkTertiaryText]}>
                      {season.startDate} - {season.endDate || 'Present'}
                    </Text>
                  </View>
                  
                  <Text style={[styles.seasonDescription, isDarkMode && styles.darkSecondaryText]}>
                    {season.description}
                  </Text>
                  
                  <View style={styles.seasonFooter}>
                    <View style={styles.memoryCount}>
                      <Ionicons name="images" size={16} color={isDarkMode ? '#0A84FF' : '#0A84FF'} />
                      <Text style={[styles.memoryCountText, isDarkMode && styles.darkTertiaryText]}>
                        {season.memories} memories
                      </Text>
                    </View>
                    
                    <Pressable style={styles.addMemoryButton}>
                      <Text style={styles.addMemoryText}>Add Memory</Text>
                    </Pressable>
                  </View>
                </View>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
      
      <Pressable style={[styles.addButton, isDarkMode && styles.darkAddButton]}>
        <Ionicons name="add" size={24} color="white" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  darkHeader: {
    backgroundColor: '#1C1C1E',
    borderBottomColor: '#2C2C2E',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
  darkText: {
    color: '#FFFFFF',
  },
  darkSubtitle: {
    color: '#AEAEB2',
  },
  darkSecondaryText: {
    color: '#EBEBF5',
  },
  darkTertiaryText: {
    color: '#8E8E93',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  timeline: {
    marginTop: 10,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 25,
  },
  timelineMarkerContainer: {
    width: 20,
    alignItems: 'center',
    marginRight: 15,
  },
  timelineLine: {
    position: 'absolute',
    width: 2,
    height: '100%',
    backgroundColor: '#ddd',
    left: 9,
  },
  timelineMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    zIndex: 1,
  },
  seasonCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  darkCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    shadowOpacity: 0.2,
  },
  seasonContent: {
    padding: 16,
  },
  seasonHeader: {
    marginBottom: 10,
  },
  seasonTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  seasonDate: {
    fontSize: 14,
    color: '#666',
  },
  seasonDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
    marginBottom: 15,
  },
  seasonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memoryCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  memoryCountText: {
    fontSize: 14,
    color: '#666',
  },
  addMemoryButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#0A84FF',
    borderRadius: 100,
  },
  addMemoryText: {
    fontSize: 14,
    color: '#fff',
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
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  darkAddButton: {
    shadowOpacity: 0.3,
  },
});