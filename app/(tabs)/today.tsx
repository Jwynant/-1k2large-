import React from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import { useDateCalculations } from '../hooks/useDateCalculations';
import { useFocusAreas } from '../hooks/useFocusAreas';
import { useContentManagement } from '../hooks/useContentManagement';
import { useTheme } from '../context/ThemeContext';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';
import TodayHeader from '../components/today/TodayHeader';
import LifeProgressCard from '../components/today/LifeProgressCard';
import GoalsDashboard from '../components/today/GoalsDashboard';
import FocusAreasCard from '../components/today/FocusAreasCard';
import ContentLibraryCard from '../components/today/ContentLibraryCard';
import QuickActionButtons from '../components/today/QuickActionButtons';
import ErrorBoundary from '../components/shared/ErrorBoundary';

// Component-specific error fallback
const ComponentErrorFallback = ({ componentName }: { componentName: string }) => {
  const { colors } = useTheme();
  const { spacing, fontSizes } = useResponsiveLayout();
  
  return (
    <View 
      style={[
        styles.errorFallback, 
        {
          backgroundColor: colors.card,
          borderRadius: spacing.m,
          padding: spacing.l,
          marginBottom: spacing.l,
        }
      ]} 
      accessibilityRole="alert"
    >
      <Text 
        style={[
          styles.errorText,
          {
            color: colors.error,
            fontSize: fontSizes.m,
          }
        ]}
      >
        Unable to load {componentName}. Please try again later.
      </Text>
    </View>
  );
};

export default function TodayScreen() {
  // Get current date info and app state
  const { getPreciseAge, getLifeProgress } = useDateCalculations();
  const { state } = useAppContext();
  const { orderedFocusAreas, focusAreas } = useFocusAreas();
  const { getGoals } = useContentManagement();
  const { colors } = useTheme();
  const { horizontalPadding, spacing, isLandscape, columns } = useResponsiveLayout();
  
  // Calculate life progress
  const lifeProgressPercentage = getLifeProgress(state.userSettings.lifeExpectancy);
  const preciseAge = getPreciseAge();

  // Get goals data
  const allGoals = getGoals();
  const activeGoals = allGoals.filter(goal => !goal.isCompleted);

  // Render content in columns for larger screens in landscape mode
  const renderContent = () => {
    if (isLandscape && columns > 1) {
      return (
        <View style={styles.columnsContainer}>
          <View style={[styles.column, { marginRight: spacing.l }]}>
            <ErrorBoundary fallback={<ComponentErrorFallback componentName="Life Progress" />}>
              <LifeProgressCard lifeProgressPercentage={lifeProgressPercentage} />
            </ErrorBoundary>

            <ErrorBoundary fallback={<ComponentErrorFallback componentName="Quick Actions" />}>
              <QuickActionButtons />
            </ErrorBoundary>

            <ErrorBoundary fallback={<ComponentErrorFallback componentName="Goals Dashboard" />}>
              <GoalsDashboard 
                activeGoals={activeGoals}
                focusAreas={focusAreas}
              />
            </ErrorBoundary>
          </View>
          
          <View style={styles.column}>
            <ErrorBoundary fallback={<ComponentErrorFallback componentName="Focus Areas" />}>
              <FocusAreasCard />
            </ErrorBoundary>
            
            <ErrorBoundary fallback={<ComponentErrorFallback componentName="Content Library" />}>
              <ContentLibraryCard />
            </ErrorBoundary>
          </View>
        </View>
      );
    }
    
    // Default single column layout
    return (
      <>
        <ErrorBoundary fallback={<ComponentErrorFallback componentName="Life Progress" />}>
          <LifeProgressCard lifeProgressPercentage={lifeProgressPercentage} />
        </ErrorBoundary>

        <ErrorBoundary fallback={<ComponentErrorFallback componentName="Quick Actions" />}>
          <QuickActionButtons />
        </ErrorBoundary>

        <ErrorBoundary fallback={<ComponentErrorFallback componentName="Goals Dashboard" />}>
          <GoalsDashboard 
            activeGoals={activeGoals}
            focusAreas={focusAreas}
          />
        </ErrorBoundary>
         
        <ErrorBoundary fallback={<ComponentErrorFallback componentName="Focus Areas" />}>
          <FocusAreasCard />
        </ErrorBoundary>
        
        <ErrorBoundary fallback={<ComponentErrorFallback componentName="Content Library" />}>
          <ContentLibraryCard />
        </ErrorBoundary>
      </>
    );
  };

  return (
    <SafeAreaView 
      style={[
        styles.container,
        { backgroundColor: colors.background }
      ]} 
      accessibilityLabel="Today Screen"
    >
      {/* Header with date and age */}
      <ErrorBoundary fallback={<ComponentErrorFallback componentName="Header" />}>
        <TodayHeader preciseAge={preciseAge} />
      </ErrorBoundary>
      
      <ScrollView 
        style={[
          styles.content,
          { 
            paddingHorizontal: horizontalPadding,
            paddingTop: spacing.l,
          }
        ]} 
        showsVerticalScrollIndicator={false}
        accessibilityLabel="Today's content"
      >
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  errorFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    textAlign: 'center',
  },
  columnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
  },
}); 