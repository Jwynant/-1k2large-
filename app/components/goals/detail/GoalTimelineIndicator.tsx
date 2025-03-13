import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { format, differenceInDays, addDays } from 'date-fns';

interface GoalTimelineIndicatorProps {
  startDate: Date;
  endDate: Date;
  progress: number;
  color: string;
}

export default function GoalTimelineIndicator({ 
  startDate, 
  endDate, 
  progress, 
  color 
}: GoalTimelineIndicatorProps) {
  // Calculate total duration in days
  const totalDays = differenceInDays(endDate, startDate);
  
  // Calculate days elapsed
  const today = new Date();
  const daysElapsed = Math.min(differenceInDays(today, startDate), totalDays);
  
  // Calculate time progress percentage (how much time has passed)
  const timeProgressPercentage = totalDays > 0 ? (daysElapsed / totalDays) * 100 : 0;
  
  // Calculate if the goal is on track, ahead, or behind
  const getGoalStatus = () => {
    if (progress >= 100) return { status: 'completed', text: 'Completed', color: '#30D158' };
    
    const diff = progress - timeProgressPercentage;
    
    if (diff >= 15) return { status: 'ahead', text: 'Ahead of schedule', color: '#30D158' };
    if (diff <= -15) return { status: 'behind', text: 'Behind schedule', color: '#FF453A' };
    return { status: 'onTrack', text: 'On track', color: '#FF9F0A' };
  };
  
  const goalStatus = getGoalStatus();
  
  // Generate milestone dates for the timeline
  const timelineDates = useMemo(() => {
    if (totalDays <= 0) return [];
    
    const dates = [];
    const interval = Math.max(Math.floor(totalDays / 3), 1); // Divide into 4 segments (3 intervals)
    
    dates.push({
      date: startDate,
      label: 'Start',
      position: 0
    });
    
    // Add middle points
    for (let i = 1; i <= 2; i++) {
      const date = addDays(startDate, interval * i);
      dates.push({
        date,
        label: format(date, 'MMM d'),
        position: (interval * i / totalDays) * 100
      });
    }
    
    dates.push({
      date: endDate,
      label: 'Deadline',
      position: 100
    });
    
    return dates;
  }, [startDate, endDate, totalDays]);
  
  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Status:</Text>
        <View style={[styles.statusBadge, { backgroundColor: `${goalStatus.color}20` }]}>
          <Text style={[styles.statusText, { color: goalStatus.color }]}>
            {goalStatus.text}
          </Text>
        </View>
      </View>
      
      <View style={styles.timelineContainer}>
        {/* Timeline Track */}
        <View style={styles.timelineTrack}>
          {/* Progress Fill */}
          <View 
            style={[
              styles.timelineFill, 
              { 
                width: `${timeProgressPercentage}%`,
                backgroundColor: color 
              }
            ]} 
          />
          
          {/* Today Marker */}
          {timeProgressPercentage > 0 && timeProgressPercentage < 100 && (
            <View 
              style={[
                styles.todayMarker, 
                { 
                  left: `${timeProgressPercentage}%`,
                  backgroundColor: color 
                }
              ]} 
            />
          )}
          
          {/* Date Markers */}
          {timelineDates.map((item, index) => (
            <View 
              key={index} 
              style={[
                styles.dateMarker, 
                { left: `${item.position}%` }
              ]}
            >
              <View 
                style={[
                  styles.markerDot,
                  index === 0 || index === timelineDates.length - 1 
                    ? { backgroundColor: color } 
                    : { backgroundColor: '#8E8E93' }
                ]} 
              />
              <Text style={styles.dateLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  timelineContainer: {
    marginTop: 8,
  },
  timelineTrack: {
    height: 4,
    backgroundColor: '#3A3A3C',
    borderRadius: 2,
    marginVertical: 24,
    position: 'relative',
  },
  timelineFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    borderRadius: 2,
  },
  todayMarker: {
    position: 'absolute',
    top: -6,
    width: 16,
    height: 16,
    borderRadius: 8,
    marginLeft: -8,
    borderWidth: 2,
    borderColor: '#1C1C1E',
  },
  dateMarker: {
    position: 'absolute',
    top: -4,
    alignItems: 'center',
    transform: [{ translateX: -4 }],
  },
  markerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 6,
  },
  dateLabel: {
    fontSize: 12,
    color: '#8E8E93',
    position: 'absolute',
    top: 12,
    width: 60,
    textAlign: 'center',
    marginLeft: -30,
  },
}); 