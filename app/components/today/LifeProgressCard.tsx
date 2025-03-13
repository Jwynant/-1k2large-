import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import Card from '../shared/Card';

interface LifeProgressCardProps {
  lifeProgressPercentage: number;
}

export default function LifeProgressCard({ lifeProgressPercentage }: LifeProgressCardProps) {
  const { state } = useAppContext();
  const { colors } = useTheme();
  const { spacing, fontSizes } = useResponsiveLayout();
  
  // Calculate time remaining in years, months, and days
  const calculateTimeRemaining = () => {
    if (!state.userBirthDate || !state.userSettings?.lifeExpectancy) return null;
    
    const birthDate = new Date(state.userBirthDate);
    const lifeExpectancy = state.userSettings.lifeExpectancy;
    
    // Calculate end date based on birth date and life expectancy
    const endDate = new Date(birthDate);
    endDate.setFullYear(birthDate.getFullYear() + lifeExpectancy);
    
    // Calculate difference between now and end date
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    
    // If negative, return null
    if (diffTime <= 0) return null;
    
    // Convert to days, then to years, months, days
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = diffDays % 30;
    
    return { years, months, days, totalDays: diffDays };
  };
  
  const timeRemaining = calculateTimeRemaining();
  
  // Get an encouraging message based on time remaining
  const getEncouragingMessage = () => {
    if (!timeRemaining) return "";
    
    const { years } = timeRemaining;
    
    // Different messages based on life stage
    if (years > 50) {
      return "Your journey is just beginning. Dream big and build your foundation.";
    } else if (years > 30) {
      return "You have decades ahead to create a meaningful impact on the world.";
    } else if (years > 15) {
      return "There's still plenty of time to pursue your passions and achieve your goals.";
    } else if (years > 5) {
      return "Make each day count. Your experience and wisdom are valuable gifts.";
    } else {
      return "Focus on what truly matters. Every moment is precious.";
    }
  };
  
  const encouragingMessage = getEncouragingMessage();

  return (
    <Card
      title="Life Progress"
      iconName="hourglass"
      iconColor={colors.warning}
      borderColor={colors.warning}
    >
      <View 
        style={[
          styles.progressBarContainer,
          {
            height: spacing.m,
            backgroundColor: colors.cardAlt,
            borderRadius: spacing.xs,
            marginBottom: spacing.m,
          }
        ]}
      >
        <View 
          style={[
            styles.progressFill, 
            { 
              width: `${lifeProgressPercentage}%`,
              backgroundColor: colors.warning,
            }
          ]} 
        />
      </View>
      <View style={styles.progressStatsContainer}>
        <Text 
          style={[
            styles.progressPercentage,
            {
              fontSize: fontSizes.l,
              color: colors.warning,
              marginRight: spacing.xs,
            }
          ]}
        >
          {Math.round(lifeProgressPercentage)}%
        </Text>
        <Text 
          style={[
            styles.progressText,
            {
              fontSize: fontSizes.m,
              color: colors.textSecondary,
            }
          ]}
        >
          of life lived ({Math.round(100 - lifeProgressPercentage)}% remaining)
        </Text>
      </View>
      
      {timeRemaining && (
        <View 
          style={[
            styles.timeRemainingContainer,
            {
              borderTopWidth: 1,
              borderTopColor: colors.border,
              paddingTop: spacing.l,
              marginTop: spacing.xs,
            }
          ]}
        >
          <Text 
            style={[
              styles.timeRemainingLabel,
              {
                fontSize: fontSizes.m,
                color: colors.textSecondary,
                marginBottom: spacing.xs,
              }
            ]}
          >
            You have approximately:
          </Text>
          <Text 
            style={[
              styles.timeRemainingValue,
              {
                fontSize: fontSizes.l,
                color: colors.text,
                marginBottom: spacing.m,
              }
            ]}
          >
            {timeRemaining.years} years, {timeRemaining.months} months
          </Text>
          <View 
            style={[
              styles.timeRemainingMessageContainer,
              {
                backgroundColor: `${colors.warning}20`,
                borderRadius: spacing.s,
                padding: spacing.m,
              }
            ]}
          >
            <Ionicons 
              name="sparkles" 
              size={fontSizes.l} 
              color={colors.warning} 
              style={[styles.messageIcon, { marginRight: spacing.s }]} 
            />
            <Text 
              style={[
                styles.timeRemainingMessage,
                {
                  fontSize: fontSizes.m,
                  color: colors.text,
                  lineHeight: fontSizes.m * 1.4,
                }
              ]}
            >
              {encouragingMessage}
            </Text>
          </View>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  progressBarContainer: {
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  progressStatsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressPercentage: {
    fontWeight: '600',
  },
  progressText: {},
  timeRemainingContainer: {},
  timeRemainingLabel: {},
  timeRemainingValue: {
    fontWeight: '600',
  },
  timeRemainingMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageIcon: {},
  timeRemainingMessage: {
    flex: 1,
  },
}); 