import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Season = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  memories: number;
};

const seasons: Season[] = [
  {
    id: '1',
    title: 'Career Transition',
    startDate: '2024-01',
    endDate: '2024-06',
    description: 'Period of focused learning and career development',
    memories: 12,
  },
  {
    id: '2',
    title: 'Health Focus',
    startDate: '2023-07',
    endDate: '2023-12',
    description: 'Establishing better health and fitness habits',
    memories: 24,
  },
];

export default function TimelineScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Timeline</Text>
        <Text style={styles.subtitle}>View your life seasons</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.timelineHeader}>
          <Text style={styles.currentDate}>2024</Text>
          <Pressable style={styles.addButton}>
            <Ionicons name="add-circle" size={24} color="#007AFF" />
          </Pressable>
        </View>
        
        <View style={styles.timeline}>
          {seasons.map((season, index) => (
            <Pressable key={season.id} style={styles.seasonCard}>
              <View style={styles.seasonMarker}>
                <View style={styles.seasonDot} />
                {index !== seasons.length - 1 && <View style={styles.seasonLine} />}
              </View>
              
              <View style={styles.seasonContent}>
                <View style={styles.seasonHeader}>
                  <Text style={styles.seasonTitle}>{season.title}</Text>
                  <Text style={styles.seasonDate}>
                    {season.startDate} - {season.endDate}
                  </Text>
                </View>
                
                <Text style={styles.seasonDescription}>{season.description}</Text>
                
                <View style={styles.seasonFooter}>
                  <View style={styles.memoriesCount}>
                    <Ionicons name="images-outline" size={16} color="#666" />
                    <Text style={styles.memoriesText}>{season.memories} memories</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  content: {
    flex: 1,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  currentDate: {
    fontSize: 24,
    fontWeight: '600',
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
  addButton: {
    padding: 4,
  },
  timeline: {
    paddingHorizontal: 20,
  },
  seasonCard: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  seasonMarker: {
    width: 20,
    alignItems: 'center',
  },
  seasonDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
    marginTop: 6,
  },
  seasonLine: {
    width: 2,
    height: '100%',
    backgroundColor: '#007AFF20',
    marginTop: 6,
  },
  seasonContent: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginLeft: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  seasonHeader: {
    marginBottom: 8,
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
    color: '#333',
    lineHeight: 22,
    marginBottom: 12,
  },
  seasonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memoriesCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  memoriesText: {
    fontSize: 14,
    color: '#666',
  },
});