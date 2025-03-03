import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Define a type for the priority object
export interface Priority {
  id: string;
  title: string;
  category: string;
  color: string;
  gradientStart?: string;
  gradientEnd?: string;
  icon: keyof typeof Ionicons.glyphMap;
  intent?: string;
  period?: string;
  isPrimary?: boolean;
  sacrifices?: string[];
}

interface PriorityItemProps {
  priority: Priority;
  isDarkMode: boolean;
  isPrimary?: boolean;
}

export const PriorityItem: React.FC<PriorityItemProps> = ({ priority, isDarkMode, isPrimary = false }) => (
  <View 
    style={[
      isPrimary ? styles.primaryFocusCard : styles.focusCard, 
      isDarkMode && styles.darkCard,
      isPrimary && { backgroundColor: priority.gradientStart }
    ]}
  >
    {isPrimary && (
      <View style={styles.primaryFocusBadgeContainer}>
        <View style={styles.primaryFocusBadge}>
          <Text style={styles.primaryFocusBadgeText}>Primary Focus</Text>
        </View>
      </View>
    )}
    
    <View style={styles.focusHeader}>
      <View style={[styles.focusCategoryIcon, { backgroundColor: priority.color }]}>
        <Ionicons name={priority.icon} size={isPrimary ? 24 : 18} color="#FFFFFF" />
      </View>
      <View style={styles.focusTitleContainer}>
        <Text style={[
          isPrimary ? styles.primaryFocusTitle : styles.focusTitle, 
          isDarkMode && styles.darkText
        ]}>
          {priority.title}
        </Text>
        <Text style={[
          styles.focusCategory, 
          isDarkMode && styles.darkTertiaryText
        ]}>
          {priority.category}
        </Text>
      </View>
    </View>
    
    {priority.intent && (
      <Text style={[
        isPrimary ? styles.primaryFocusIntent : styles.focusIntent, 
        isDarkMode && styles.darkSecondaryText
      ]}>
        "{priority.intent}"
      </Text>
    )}
    
    {priority.period && (
      <Text style={[
        styles.focusPeriod, 
        isDarkMode && styles.darkTertiaryText,
        isPrimary && styles.primaryFocusPeriod
      ]}>
        Focus period: {priority.period}
      </Text>
    )}
    
    {priority.sacrifices && priority.sacrifices.length > 0 && (
      <View style={styles.sacrificesContainer}>
        <Text style={[
          styles.sacrificesTitle, 
          isDarkMode && styles.darkText,
          isPrimary && styles.primarySacrificesTitle
        ]}>
          Intentional Sacrifices:
        </Text>
        {priority.sacrifices.map((sacrifice, index) => (
          <View key={index} style={styles.sacrificeItem}>
            <Ionicons 
              name="remove-circle" 
              size={14} 
              color={isPrimary ? "#FFFFFF" : isDarkMode ? "#FF453A" : "#FF3B30"} 
            />
            <Text style={[
              styles.sacrificeText, 
              isDarkMode && styles.darkSecondaryText,
              isPrimary && styles.primarySacrificeText
            ]}>
              {sacrifice}
            </Text>
          </View>
        ))}
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  focusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: 240,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  primaryFocusCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  darkCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  focusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  focusCategoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  focusTitleContainer: {
    flex: 1,
  },
  focusTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  primaryFocusTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  focusCategory: {
    fontSize: 14,
    color: '#8E8E93',
  },
  focusIntent: {
    fontSize: 15,
    fontStyle: 'italic',
    color: '#3C3C43',
    marginBottom: 12,
    lineHeight: 20,
  },
  primaryFocusIntent: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#FFFFFF',
    marginBottom: 16,
    lineHeight: 22,
    opacity: 0.9,
  },
  focusPeriod: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 6,
  },
  primaryFocusPeriod: {
    color: '#FFFFFF',
    opacity: 0.85,
  },
  primaryFocusBadgeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  primaryFocusBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  primaryFocusBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  sacrificesContainer: {
    marginTop: 12,
  },
  sacrificesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  primarySacrificesTitle: {
    color: '#FFFFFF',
    opacity: 0.9,
  },
  sacrificeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  sacrificeText: {
    fontSize: 14,
    color: '#3C3C43',
    marginLeft: 6,
    flex: 1,
  },
  primarySacrificeText: {
    color: '#FFFFFF',
    opacity: 0.85,
  },
  darkText: {
    color: '#FFFFFF',
  },
  darkSecondaryText: {
    color: '#EBEBF5',
  },
  darkTertiaryText: {
    color: '#8E8E93',
  },
});

export default PriorityItem; 