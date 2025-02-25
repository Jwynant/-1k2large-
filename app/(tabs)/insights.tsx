import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Lesson = {
  id: string;
  title: string;
  date: string;
  importance: 1 | 2 | 3 | 4 | 5;
  source?: string;
};

type Reflection = {
  id: string;
  date: string;
  text: string;
};

const lessons: Lesson[] = [
  {
    id: '1',
    title: 'Always validate assumptions early',
    date: '2024-01-15',
    importance: 5,
    source: 'Project Retrospective',
  },
  {
    id: '2',
    title: 'Regular exercise improves focus',
    date: '2024-01-10',
    importance: 4,
  },
];

const reflections: Reflection[] = [
  {
    id: '1',
    date: '2024-01-20',
    text: 'Today was productive. Found a new way to structure my morning routine that seems to work better.',
  },
  {
    id: '2',
    date: '2024-01-19',
    text: 'Feeling grateful for the progress made this week. Need to focus more on deep work sessions.',
  },
];

export default function InsightsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Insights</Text>
        <Text style={styles.subtitle}>Discover patterns and lessons</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Key Lessons</Text>
            <Pressable style={styles.addButton}>
              <Ionicons name="add-circle" size={24} color="#007AFF" />
            </Pressable>
          </View>
          
          {lessons.map(lesson => (
            <Pressable key={lesson.id} style={styles.lessonCard}>
              <View style={styles.lessonHeader}>
                <View style={styles.lessonMeta}>
                  <Text style={styles.lessonDate}>{lesson.date}</Text>
                  <View style={styles.importanceIndicator}>
                    {Array.from({ length: lesson.importance }).map((_, i) => (
                      <View key={i} style={styles.importanceDot} />
                    ))}
                  </View>
                </View>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                {lesson.source && (
                  <Text style={styles.lessonSource}>From: {lesson.source}</Text>
                )}
              </View>
            </Pressable>
          ))}
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Reflections</Text>
            <Pressable style={styles.addButton}>
              <Ionicons name="add-circle" size={24} color="#007AFF" />
            </Pressable>
          </View>
          
          {reflections.map(reflection => (
            <Pressable key={reflection.id} style={styles.reflectionCard}>
              <Text style={styles.reflectionDate}>{reflection.date}</Text>
              <Text style={styles.reflectionText}>{reflection.text}</Text>
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
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
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
  lessonCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  lessonHeader: {
    gap: 8,
  },
  lessonMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lessonDate: {
    fontSize: 14,
    color: '#666',
  },
  importanceIndicator: {
    flexDirection: 'row',
    gap: 4,
  },
  importanceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#007AFF',
  },
  lessonTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  lessonSource: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  reflectionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  reflectionDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  reflectionText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
  },
});