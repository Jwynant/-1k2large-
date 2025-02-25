import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useState } from 'react';
import { MotiView } from 'moti';
import YearGridView from './years/YearGridView';
import MonthGridView from './months/MonthGridView';
import WeekGridView from './weeks/WeekGridView';
import ExpandedClusterView from './ExpandedClusterView';
import { ScrollView } from 'react-native';

type ViewMode = 'weeks' | 'months' | 'years';
type ViewState = 'grid' | 'cluster';

export default function GridContainer() {
  const [viewMode, setViewMode] = useState<ViewMode>('months');
  const [viewState, setViewState] = useState<ViewState>('grid');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const currentAge = 36; // This would come from user's birth date
  const totalYears = 80;

  const clusters = Array.from({ length: totalYears }, (_, i) => ({
    year: i,
    isCurrent: i === currentAge,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.date}>May 8th 2025</Text>
        <Text style={styles.timeLeft}>23 years, 6 months, 3 weeks, 1 day</Text>
        <View style={styles.progress}>
          <View style={[styles.progressBar, { width: `${(36 / totalYears) * 100}%` }]} />
        </View>
        <View style={styles.viewModes}>
          <Pressable
            style={[styles.viewModeButton, viewMode === 'weeks' && styles.viewModeActive]}
            onPress={() => setViewMode('weeks')}>
            <Text style={[styles.viewModeText, viewMode === 'weeks' && styles.viewModeTextActive, styles.activeText]}>
              Weeks
            </Text>
          </Pressable>
          <Pressable
            style={[styles.viewModeButton, viewMode === 'months' && styles.viewModeActive]}
            onPress={() => setViewMode('months')}>
            <Text style={[styles.viewModeText, viewMode === 'months' && styles.viewModeTextActive]}>
              Months
            </Text>
          </Pressable>
          <Pressable
            style={[styles.viewModeButton, viewMode === 'years' && styles.viewModeActive]}
            onPress={() => setViewMode('years')}>
            <Text style={[styles.viewModeText, viewMode === 'years' && styles.viewModeTextActive, styles.activeText]}>
              Years
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView style={styles.gridScroll}>
        <MotiView
          style={[styles.grid, viewState === 'cluster' && styles.gridHidden]}
          animate={{
            opacity: viewState === 'grid' ? 1 : 0,
            scale: viewState === 'grid' ? 1 : 0.95,
          }}
          transition={{
            type: 'timing',
            duration: 300,
          }}> 
          {viewMode === 'years' && <YearGridView currentAge={currentAge} totalYears={totalYears} />}
          {viewMode === 'months' && <MonthGridView clusters={clusters} onSelectYear={setSelectedYear} />}
          {viewMode === 'weeks' && <WeekGridView clusters={clusters} />}
        </MotiView>
        
        <MotiView
          style={[
            styles.expandedContainer,
            viewState === 'grid' && styles.expandedHidden,
          ]}
          animate={{
            opacity: viewState === 'cluster' ? 1 : 0,
            scale: viewState === 'cluster' ? 1 : 1.05,
          }}
          transition={{
            type: 'timing',
            duration: 300,
          }}>
          {selectedYear !== null && (
            <ExpandedClusterView
              year={selectedYear}
              isCurrent={selectedYear === currentAge}
              onClose={() => setViewState('grid')}
            />
          )}
        </MotiView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  date: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  timeLeft: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  progress: {
    height: 4,
    backgroundColor: '#eee',
    borderRadius: 2,
    marginBottom: 20,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#000',
    borderRadius: 2,
  },
  viewModes: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    padding: 4,
    borderRadius: 100,
  },
  viewModeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
  },
  viewModeActive: {
    backgroundColor: '#fff',
  },
  viewModeText: {
    textAlign: 'center',
    color: '#666',
  },
  viewModeTextActive: {
    color: '#000',
    fontWeight: '600',
  },
  activeText: {
    color: '#000',
  },
  gridScroll: {
    flex: 1,
  },
  gridScrollContent: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingRight: 15, // Match left padding (10 + 5 from ageLabels)
  },
  ageLabels: {
    paddingLeft: 5,
    paddingRight: 2,
    paddingTop: 0, // Add padding to match first row spacing
  },
  ageLabel: {
    fontSize: 10,
    color: '#666',
    height: 80, // Height of cluster (4 rows * 16px)
    lineHeight: 70, // Center text vertically within the height
    textAlign: 'right',
  },
  gridContent: {
    flex: 1,
  },
  gridHidden: {
    position: 'absolute',
    width: '100%',
    pointerEvents: 'none',
  },
  expandedContainer: {
    position: 'absolute',
    width: '100%',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
  },
  expandedHidden: {
    pointerEvents: 'none',
    display: 'none',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  }
});