import React from 'react';
import { View, StyleSheet } from 'react-native';
import { OnboardingProvider, useOnboarding } from './context/OnboardingContext';
import { 
  SplashScreen, 
  PersonalInfoScreen
} from './components/onboarding';
import GridTourView from './components/onboarding/GridTourView';
import LifespanCustomizationScreen from './components/onboarding/LifespanCustomizationScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Onboarding content component
function OnboardingContent() {
  const { state, setCurrentStep } = useOnboarding();
  
  // Render the appropriate screen based on the current step
  const renderScreen = () => {
    switch (state.currentStep) {
      case 0:
        return <SplashScreen onComplete={() => setCurrentStep(1)} />;
      case 1:
        return <PersonalInfoScreen />;
      case 2:
        return <GridTourView />;
      case 3:
        return <LifespanCustomizationScreen />;
      default:
        return <SplashScreen onComplete={() => setCurrentStep(1)} />;
    }
  };
  
  return (
    <View style={styles.container}>
      {renderScreen()}
    </View>
  );
}

// Main onboarding screen component
export default function OnboardingScreen() {
  return (
    <SafeAreaProvider>
      <OnboardingProvider>
        <OnboardingContent />
      </OnboardingProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
}); 