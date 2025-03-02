import React from 'react';
import { View, Text, StyleSheet, useColorScheme, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GoalStats } from './types';
import ProgressIndicator from './ProgressIndicator';

type DashboardSummaryProps = {
  stats: GoalStats;
  selectedPriorityTitle?: string;
  selectedPriorityColor?: string;
  onFocusPress?: () => void;
};

/**
 * A component that displays goal statistics in a visually appealing dashboard
 */
export default function DashboardSummary({
  stats,
  selectedPriorityTitle,
  selectedPriorityColor,
  onFocusPress,
}: DashboardSummaryProps) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  // Get completion color based on rate
  const getCompletionColor = (rate: number): string => {
    if (rate >= 80) return '#4CD964'; // iOS green
    if (rate >= 50) return '#FFCC00'; // iOS yellow
    return '#FF3B30'; // iOS red
  };
  
  const completionColor = getCompletionColor(stats.completionRate);
  
  // Find the recommended focus goal based on priority and deadline
  const focusGoalText = stats.highPriorityGoals > 0
    ? `${stats.highPriorityGoals} high priority goal${stats.highPriorityGoals > 1 ? 's' : ''}`
    : stats.dueToday > 0
      ? `${stats.dueToday} goal${stats.dueToday > 1 ? 's' : ''} due today`
      : stats.dueThisWeek > 0
        ? `${stats.dueThisWeek} goal${stats.dueThisWeek > 1 ? 's' : ''} due this week`
        : 'No urgent goals';
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>
          Dashboard
        </Text>
        
        {selectedPriorityTitle && (
          <View style={[styles.filterPill, { backgroundColor: selectedPriorityColor + '20' }]}>
            <Text style={[styles.filterPillText, { color: selectedPriorityColor }]}>
              {selectedPriorityTitle}
            </Text>
          </View>
        )}
      </View>
      
      {/* Main Stats Row - Progress Circle and Key Metrics */}
      <View style={styles.mainStatsRow}>
        <View style={[styles.progressCircleContainer, isDarkMode && styles.darkCardBackground]}>
          <ProgressIndicator 
            progress={stats.completionRate} 
            color={completionColor}
            type="radial"
            size="large"
            label="Completion Rate"
          />
        </View>
        
        <View style={styles.keyMetricsContainer}>
          {/* Focus Now Card */}
          <Pressable 
            style={[styles.focusCard, isDarkMode && styles.darkCardBackground]}
            onPress={onFocusPress}
            disabled={!onFocusPress}
          >
            <View style={styles.focusCardIcon}>
              <Ionicons name="flag" size={18} color="#FF2D55" />
            </View>
            <View style={styles.focusCardContent}>
              <Text style={[styles.focusCardTitle, isDarkMode && styles.darkText]}>
                Focus on
              </Text>
              <Text 
                style={[styles.focusCardValue, isDarkMode && styles.darkSecondaryText]}
                numberOfLines={1}
              >
                {focusGoalText}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={isDarkMode ? '#8E8E93' : '#8E8E93'} />
          </Pressable>
          
          {/* Active vs Completed */}
          <View style={[styles.metricCard, isDarkMode && styles.darkCardBackground]}>
            <View style={styles.metricHeader}>
              <View style={[styles.metricIcon, { backgroundColor: 'rgba(10, 132, 255, 0.1)' }]}>
                <Ionicons name="time-outline" size={16} color="#0A84FF" />
              </View>
              <Text style={[styles.metricTitle, isDarkMode && styles.darkText]}>
                Active
              </Text>
            </View>
            <Text style={[styles.metricValue, isDarkMode && styles.darkText]}>
              {stats.activeGoals}
            </Text>
          </View>
          
          <View style={[styles.metricCard, isDarkMode && styles.darkCardBackground]}>
            <View style={styles.metricHeader}>
              <View style={[styles.metricIcon, { backgroundColor: 'rgba(76, 217, 100, 0.1)' }]}>
                <Ionicons name="checkmark-circle" size={16} color="#4CD964" />
              </View>
              <Text style={[styles.metricTitle, isDarkMode && styles.darkText]}>
                Completed
              </Text>
            </View>
            <Text style={[styles.metricValue, isDarkMode && styles.darkText]}>
              {stats.completedGoals}
            </Text>
          </View>
        </View>
      </View>
      
      {/* Secondary Stats Row */}
      <View style={styles.secondaryStatsRow}>
        {/* Due Soon */}
        <View style={[styles.secondaryCard, isDarkMode && styles.darkCardBackground]}>
          <View style={styles.secondaryCardContent}>
            <View style={styles.metricHeader}>
              <View style={[styles.metricIcon, { backgroundColor: 'rgba(255, 59, 48, 0.1)' }]}>
                <Ionicons name="calendar" size={16} color="#FF3B30" />
              </View>
              <Text style={[styles.metricTitle, isDarkMode && styles.darkText]}>
                Due Soon
              </Text>
            </View>
            <View style={styles.dueSoonContainer}>
              <View style={styles.dueSoonItem}>
                <Text style={[styles.dueSoonNumber, isDarkMode && styles.darkText]}>
                  {stats.dueToday}
                </Text>
                <Text style={[styles.dueSoonLabel, isDarkMode && styles.darkTertiaryText]}>
                  Today
                </Text>
              </View>
              <View style={styles.dueSoonItem}>
                <Text style={[styles.dueSoonNumber, isDarkMode && styles.darkText]}>
                  {stats.dueThisWeek}
                </Text>
                <Text style={[styles.dueSoonLabel, isDarkMode && styles.darkTertiaryText]}>
                  This Week
                </Text>
              </View>
              <View style={styles.dueSoonItem}>
                <Text style={[styles.dueSoonNumber, isDarkMode && styles.darkText]}>
                  {stats.dueThisMonth}
                </Text>
                <Text style={[styles.dueSoonLabel, isDarkMode && styles.darkTertiaryText]}>
                  This Month
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Priority Distribution */}
        <View style={[styles.secondaryCard, isDarkMode && styles.darkCardBackground]}>
          <View style={styles.secondaryCardContent}>
            <View style={styles.metricHeader}>
              <View style={[styles.metricIcon, { backgroundColor: 'rgba(255, 204, 0, 0.1)' }]}>
                <Ionicons name="star" size={16} color="#FFCC00" />
              </View>
              <Text style={[styles.metricTitle, isDarkMode && styles.darkText]}>
                Priorities
              </Text>
            </View>
            <View style={styles.priorityDistribution}>
              <View style={styles.priorityItem}>
                <View style={[styles.priorityDot, { backgroundColor: '#FF3B30' }]} />
                <Text style={[styles.priorityLabel, isDarkMode && styles.darkTertiaryText]}>
                  High
                </Text>
                <Text style={[styles.priorityCount, isDarkMode && styles.darkText]}>
                  {stats.highPriorityGoals}
                </Text>
              </View>
              <View style={styles.priorityItem}>
                <View style={[styles.priorityDot, { backgroundColor: '#FF9500' }]} />
                <Text style={[styles.priorityLabel, isDarkMode && styles.darkTertiaryText]}>
                  Medium
                </Text>
                <Text style={[styles.priorityCount, isDarkMode && styles.darkText]}>
                  {stats.mediumPriorityGoals}
                </Text>
              </View>
              <View style={styles.priorityItem}>
                <View style={[styles.priorityDot, { backgroundColor: '#0A84FF' }]} />
                <Text style={[styles.priorityLabel, isDarkMode && styles.darkTertiaryText]}>
                  Low
                </Text>
                <Text style={[styles.priorityCount, isDarkMode && styles.darkText]}>
                  {stats.lowPriorityGoals}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
    marginRight: 10,
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
  darkCardBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
  },
  filterPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  filterPillText: {
    fontSize: 14,
    fontWeight: '500',
  },
  // Main stats row
  mainStatsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  progressCircleContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  keyMetricsContainer: {
    flex: 1,
  },
  // Focus Card
  focusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  focusCardIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 45, 85, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  focusCardContent: {
    flex: 1,
  },
  focusCardTitle: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 2,
  },
  focusCardValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  // Metric cards
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  metricTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  // Secondary stats row
  secondaryStatsRow: {
    flexDirection: 'row',
  },
  secondaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  secondaryCardContent: {
    padding: 12,
  },
  // Due soon section
  dueSoonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  dueSoonItem: {
    alignItems: 'center',
    flex: 1,
  },
  dueSoonNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  dueSoonLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  // Priority distribution
  priorityDistribution: {
    marginTop: 8,
  },
  priorityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  priorityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  priorityLabel: {
    fontSize: 13,
    color: '#8E8E93',
    flex: 1,
  },
  priorityCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
  },
}); 