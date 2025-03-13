import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Card from '../shared/Card';
import LessonsLibrary from '../../../components/content/lessons/LessonsLibrary';

export default function LessonsLibraryCard() {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const lessonsColor = '#FFCC00'; // Yellow color for lessons
  
  const handleAddLesson = () => {
    router.push('/content/lesson');
  };
  
  const toggleIcon = (
    <TouchableOpacity
      style={styles.expandButton}
      onPress={() => setExpanded(!expanded)}
    >
      <Ionicons 
        name={expanded ? 'chevron-up' : 'chevron-down'} 
        size={18} 
        color="#8E8E93" 
      />
    </TouchableOpacity>
  );
  
  return (
    <Card
      title="Lessons"
      iconName="school"
      iconColor={lessonsColor}
      borderColor={lessonsColor}
      rightHeaderContent={toggleIcon}
    >
      <LessonsLibrary 
        onAddLesson={handleAddLesson}
        isExpanded={expanded}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  expandButton: {
    padding: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(142, 142, 147, 0.1)',
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 