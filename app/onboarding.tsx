import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useAppContext } from './context/AppContext';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

export default function OnboardingScreen() {
  const { dispatch } = useAppContext();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [birthDate, setBirthDate] = useState(new Date(1990, 0, 1));
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Handle date change
  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthDate(selectedDate);
    }
  };

  // Handle completing onboarding
  const handleComplete = () => {
    // Save birth date to context
    dispatch({ 
      type: 'SET_BIRTH_DATE', 
      payload: birthDate.toISOString().split('T')[0] 
    });
    
    // Navigate to main app
    router.replace('/');
  };

  // Onboarding steps
  const steps = [
    {
      title: 'Welcome to 1000 Months',
      description: 'A life visualization and intentionality tool to help you make the most of your time.',
    },
    {
      title: 'Visualize Your Life',
      description: 'See your entire life at a glance, with past, present, and future all in one view.',
    },
    {
      title: 'Track What Matters',
      description: 'Record memories, lessons, goals, and reflections to live more intentionally.',
    },
    {
      title: 'Let\'s Get Started',
      description: 'To personalize your experience, we need your birth date.',
      component: (
        <View style={styles.birthDateContainer}>
          <Pressable 
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {birthDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
            <Ionicons name="calendar-outline" size={24} color="#fff" />
          </Pressable>
          
          {showDatePicker && (
            <DateTimePicker
              value={birthDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}
        </View>
      ),
    },
  ];

  const currentStepData = steps[currentStep];

  // Render placeholder image based on step
  const renderPlaceholderImage = () => {
    if (currentStep === 3) return null; // No image for birth date step
    
    return (
      <View style={styles.placeholderImage}>
        {currentStep === 0 && (
          <View style={styles.gridPlaceholder}>
            {Array.from({ length: 15 }, (_, i) => (
              <View 
                key={i} 
                style={[
                  styles.gridCell,
                  i === 7 && styles.activeGridCell
                ]} 
              />
            ))}
          </View>
        )}
        
        {currentStep === 1 && (
          <View style={styles.timelinePlaceholder}>
            <View style={styles.timelineLine} />
            <View style={styles.timelinePoints}>
              <View style={[styles.timelinePoint, styles.pastPoint]} />
              <View style={[styles.timelinePoint, styles.currentPoint]} />
              <View style={[styles.timelinePoint, styles.futurePoint]} />
            </View>
            <View style={styles.timelineLabels}>
              <Text style={styles.timelineLabel}>Past</Text>
              <Text style={styles.timelineLabel}>Present</Text>
              <Text style={styles.timelineLabel}>Future</Text>
            </View>
          </View>
        )}
        
        {currentStep === 2 && (
          <View style={styles.contentTypesPlaceholder}>
            <View style={styles.contentTypeRow}>
              <View style={[styles.contentTypeBox, { backgroundColor: '#4A90E2' }]}>
                <Text style={styles.contentTypeText}>Memories</Text>
              </View>
              <View style={[styles.contentTypeBox, { backgroundColor: '#50C878' }]}>
                <Text style={styles.contentTypeText}>Lessons</Text>
              </View>
            </View>
            <View style={styles.contentTypeRow}>
              <View style={[styles.contentTypeBox, { backgroundColor: '#FF9500' }]}>
                <Text style={styles.contentTypeText}>Goals</Text>
              </View>
              <View style={[styles.contentTypeBox, { backgroundColor: '#9B59B6' }]}>
                <Text style={styles.contentTypeText}>Reflections</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Progress indicators */}
      <View style={styles.progressContainer}>
        {steps.map((_, index) => (
          <View 
            key={index} 
            style={[
              styles.progressDot,
              currentStep === index && styles.progressDotActive
            ]} 
          />
        ))}
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{currentStepData.title}</Text>
        <Text style={styles.description}>{currentStepData.description}</Text>
        
        {renderPlaceholderImage()}
        
        {currentStepData.component}
      </ScrollView>
      
      <View style={styles.footer}>
        {currentStep > 0 && (
          <Pressable 
            style={styles.backButton}
            onPress={() => setCurrentStep(currentStep - 1)}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
        )}
        
        <Pressable 
          style={styles.nextButton}
          onPress={() => {
            if (currentStep < steps.length - 1) {
              setCurrentStep(currentStep + 1);
            } else {
              handleComplete();
            }
          }}
        >
          <Text style={styles.nextButtonText}>
            {currentStep < steps.length - 1 ? 'Next' : 'Get Started'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333',
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: '#fff',
    width: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 26,
  },
  placeholderImage: {
    width: '100%',
    height: 250,
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridPlaceholder: {
    width: 300,
    height: 200,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 20,
  },
  gridCell: {
    width: 40,
    height: 40,
    margin: 5,
    borderRadius: 5,
    backgroundColor: '#333',
  },
  activeGridCell: {
    backgroundColor: '#007AFF',
  },
  timelinePlaceholder: {
    width: 300,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineLine: {
    width: '80%',
    height: 4,
    backgroundColor: '#333',
    position: 'absolute',
  },
  timelinePoints: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timelinePoint: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  pastPoint: {
    backgroundColor: '#444',
  },
  currentPoint: {
    backgroundColor: '#007AFF',
  },
  futurePoint: {
    backgroundColor: '#333',
    borderWidth: 2,
    borderColor: '#444',
  },
  timelineLabels: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  timelineLabel: {
    color: '#fff',
    fontSize: 14,
  },
  contentTypesPlaceholder: {
    width: 300,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentTypeRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  contentTypeBox: {
    width: 120,
    height: 80,
    margin: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentTypeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  birthDateContainer: {
    width: '100%',
    alignItems: 'center',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 12,
  },
  dateButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  backButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  backButtonText: {
    fontSize: 18,
    color: '#ccc',
  },
  nextButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 100,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
}); 