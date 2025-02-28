import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useAppContext } from '../../context/AppContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AboutScreen() {
  const { state } = useAppContext();
  const isDarkMode = state.theme === 'light' ? false : true;
  const router = useRouter();

  return (
    <ScrollView 
      style={[
        styles.container,
        isDarkMode && styles.containerDark
      ]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, isDarkMode && styles.iconContainerDark]}>
          <Ionicons name="grid" size={50} color={isDarkMode ? "#0A84FF" : "#007AFF"} />
        </View>
        <Text style={[styles.title, isDarkMode && styles.textLight]}>1000 Months</Text>
        <Text style={[styles.subtitle, isDarkMode && styles.textMuted]}>Life Visualization & Intentionality Tool</Text>
      </View>

      <View style={[styles.section, isDarkMode && styles.sectionDark]}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.textLight]}>Why "1000 Months"?</Text>
        <Text style={[styles.paragraph, isDarkMode && styles.textLight]}>
          The name represents an approximate 80-year lifespan (960 months), rounded up to 1000 for memorability. 
          This intentionally finite number helps users visualize and internalize the limited nature of time.
        </Text>
      </View>

      <View style={[styles.section, isDarkMode && styles.sectionDark]}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.textLight]}>Core Purpose</Text>
        <Text style={[styles.paragraph, isDarkMode && styles.textLight]}>
          A life visualization and intentionality tool that helps users understand how they allocate their time, 
          fostering intentional living through structured self-reflection.
        </Text>
      </View>

      <View style={[styles.section, isDarkMode && styles.sectionDark]}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.textLight]}>Key Value Propositions</Text>
        
        <View style={styles.bulletPoint}>
          <Ionicons name="checkmark-circle" size={18} color={isDarkMode ? "#0A84FF" : "#007AFF"} />
          <Text style={[styles.bulletText, isDarkMode && styles.textLight]}>
            <Text style={styles.bold}>Time Visualization:</Text> A unique life-grid that visually represents past, present, and future time
          </Text>
        </View>
        
        <View style={styles.bulletPoint}>
          <Ionicons name="checkmark-circle" size={18} color={isDarkMode ? "#0A84FF" : "#007AFF"} />
          <Text style={[styles.bulletText, isDarkMode && styles.textLight]}>
            <Text style={styles.bold}>Intentionality Tool:</Text> Helps users prioritize what matters by tracking key life moments and lessons
          </Text>
        </View>
        
        <View style={styles.bulletPoint}>
          <Ionicons name="checkmark-circle" size={18} color={isDarkMode ? "#0A84FF" : "#007AFF"} />
          <Text style={[styles.bulletText, isDarkMode && styles.textLight]}>
            <Text style={styles.bold}>Seamless Memory Management:</Text> Integrates personal experiences, reflections, and future goals
          </Text>
        </View>
        
        <View style={styles.bulletPoint}>
          <Ionicons name="checkmark-circle" size={18} color={isDarkMode ? "#0A84FF" : "#007AFF"} />
          <Text style={[styles.bulletText, isDarkMode && styles.textLight]}>
            <Text style={styles.bold}>Self-Improvement:</Text> Encourages users to analyze past choices and structure future aspirations
          </Text>
        </View>
      </View>

      <View style={[styles.section, isDarkMode && styles.sectionDark]}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.textLight]}>Version</Text>
        <Text style={[styles.paragraph, isDarkMode && styles.textLight]}>1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  containerDark: {
    backgroundColor: '#000000',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainerDark: {
    backgroundColor: '#1C1C1E',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionDark: {
    backgroundColor: '#1C1C1E',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#000',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 12,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bulletText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  bold: {
    fontWeight: '600',
  },
  textLight: {
    color: '#FFFFFF',
  },
  textMuted: {
    color: '#999999',
  },
}); 