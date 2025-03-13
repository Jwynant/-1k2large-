import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { format } from 'date-fns';
import { useTheme } from '../../context/ThemeContext';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';

interface TodayHeaderProps {
  preciseAge: string;
}

export default function TodayHeader({ preciseAge }: TodayHeaderProps) {
  const { colors, isDark } = useTheme();
  const { spacing, fontSizes, isLandscape } = useResponsiveLayout();
  
  // Format current date
  const today = new Date();
  const formattedDate = format(today, 'MMMM d, yyyy');
  const dayOfWeek = format(today, 'EEEE');

  return (
    <LinearGradient
      colors={isDark ? ['#1C1C1E', '#2C2C2E'] : ['#F2F2F7', '#FFFFFF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[
        styles.headerGradient,
        {
          paddingTop: spacing.xs,
          paddingBottom: spacing.xs,
        }
      ]}
    >
      <View 
        style={[
          styles.header,
          {
            paddingHorizontal: spacing.l,
            flexDirection: isLandscape ? 'row' : 'column',
            justifyContent: isLandscape ? 'space-between' : 'center',
          }
        ]}
      >
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
        
        {!isLandscape && (
          <View 
            style={[
              styles.ageDivider,
              {
                width: spacing.xl * 1.5,
                backgroundColor: colors.border,
                marginVertical: 2,
                height: 0, // Hide the divider
              }
            ]} 
          />
        )}
        
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
            style={[styles.ageIcon, { marginRight: spacing.xs }]} 
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
  );
}

const styles = StyleSheet.create({
  headerGradient: {},
  header: {
    alignItems: 'center',
  },
  dateContainer: {
    alignItems: 'center',
  },
  dayOfWeek: {},
  date: {
    fontWeight: '600',
  },
  ageDivider: {
    height: 1,
  },
  ageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ageIcon: {},
  ageValue: {
    fontWeight: '600',
  },
}); 