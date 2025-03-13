import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { format } from 'date-fns';
import { useTheme } from '../../app/context/ThemeContext';
import { useResponsiveLayout } from '../../app/hooks/useResponsiveLayout';
import ViewModeToggle from '../ui/ViewModeToggle';
import { ViewMode } from '../../app/types';

interface GridHeaderProps {
  preciseAge: string;
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

export default function GridHeader({ preciseAge, currentMode, onModeChange }: GridHeaderProps) {
  const { colors, isDark } = useTheme();
  const { spacing, fontSizes, isLandscape } = useResponsiveLayout();
  
  // Format current date
  const today = new Date();
  const formattedDate = format(today, 'MMMM d, yyyy');
  const dayOfWeek = format(today, 'EEEE');

  return (
    <>
      <LinearGradient
        colors={isDark ? ['#1C1C1E', '#2C2C2E'] : ['#F2F2F7', '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[
          styles.headerGradient,
          { paddingTop: spacing.xxl }
        ]}
      >
        <View style={[styles.header, { paddingTop: spacing.xs, paddingBottom: spacing.xs }]}>
          <View 
            style={[
              styles.dateContainer,
              isLandscape && { alignItems: 'flex-start' }
            ]}
          >
            <Text 
              style={[
                styles.dayOfWeek,
                {
                  fontSize: fontSizes.xs,
                  color: colors.textSecondary,
                  marginBottom: 2,
                }
              ]}
            >
              {dayOfWeek}
            </Text>
            <Text 
              style={[
                styles.date,
                {
                  fontSize: fontSizes.l,
                  color: colors.text,
                  marginBottom: isLandscape ? 0 : 4,
                }
              ]}
            >
              {formattedDate}
            </Text>
          </View>
          
          <View 
            style={[
              styles.ageContainer,
              {
                backgroundColor: `${colors.primary}20`,
                paddingHorizontal: spacing.m,
                paddingVertical: spacing.xs,
                borderRadius: spacing.s,
                marginTop: isLandscape ? 0 : 0,
              }
            ]}
          >
            <Ionicons 
              name="person" 
              size={fontSizes.s} 
              color={colors.primary} 
              style={{ marginRight: spacing.xs }} 
            />
            <Text 
              style={[
                styles.ageValue,
                {
                  fontSize: fontSizes.s,
                  color: colors.text,
                }
              ]}
            >
              {preciseAge}
            </Text>
          </View>
        </View>
      </LinearGradient>
      
      {/* View mode toggle */}
      <View style={styles.toggleContainer}>
        <ViewModeToggle 
          currentMode={currentMode}
          onModeChange={onModeChange}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  headerGradient: {
    width: '100%',
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  dateContainer: {
    alignItems: 'center',
  },
  dayOfWeek: {},
  date: {
    fontWeight: '600',
  },
  ageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ageValue: {
    fontWeight: '600',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 0,
    marginBottom: 8,
  },
}); 