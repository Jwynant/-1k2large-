import { Priority, Goal } from './types';

// Sample priorities with enhanced data
export const priorities: Priority[] = [
  {
    id: '1',
    title: 'Health & Fitness',
    level: 'high',
    goals: ['1', '3', '6'],
    icon: 'fitness',
    color: '#FF2D55', // iOS pink/red
    sortOrder: 1,
    progress: 65,
  },
  {
    id: '2',
    title: 'Career Growth',
    level: 'high',
    goals: ['2'],
    icon: 'briefcase',
    color: '#5AC8FA', // iOS blue
    sortOrder: 2,
    progress: 40,
  },
  {
    id: '3',
    title: 'Family Time',
    level: 'high',
    goals: ['4'],
    icon: 'people',
    color: '#FF9500', // iOS orange
    sortOrder: 3,
    progress: 80,
  },
  {
    id: '4',
    title: 'Skills Development',
    level: 'medium',
    goals: ['5'],
    icon: 'book',
    color: '#4CD964', // iOS green
    sortOrder: 4,
    progress: 25,
  },
  {
    id: '5',
    title: 'Personal Projects',
    level: 'low',
    goals: ['7', '8'],
    icon: 'construct',
    color: '#FFCC00', // iOS yellow
    sortOrder: 5,
    progress: 15,
  }
];

// Get current date for relative deadlines
const now = new Date();
const today = new Date(now).toISOString().split('T')[0];

const tomorrow = new Date(now);
tomorrow.setDate(now.getDate() + 1);
const tomorrowStr = tomorrow.toISOString().split('T')[0];

const nextWeek = new Date(now);
nextWeek.setDate(now.getDate() + 7);
const nextWeekStr = nextWeek.toISOString().split('T')[0];

const nextMonth = new Date(now);
nextMonth.setMonth(now.getMonth() + 1);
const nextMonthStr = nextMonth.toISOString().split('T')[0];

const twoMonths = new Date(now);
twoMonths.setMonth(now.getMonth() + 2);
const twoMonthsStr = twoMonths.toISOString().split('T')[0];

// Sample goals with enhanced data
export const goals: Goal[] = [
  {
    id: '1',
    title: 'Exercise 4 times per week',
    description: 'Maintain a consistent workout schedule to improve overall fitness',
    deadline: nextWeekStr,
    status: 'in_progress',
    progress: 75,
    priorityId: '1',
    impact: 'high',
    estimatedTimeMinutes: 60 * 4, // 4 hours
    tags: ['health', 'routine'],
    createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'Complete React Native certification',
    description: 'Finish the online course and build a portfolio project',
    deadline: nextMonthStr,
    status: 'in_progress',
    progress: 40,
    priorityId: '2',
    impact: 'high',
    estimatedTimeMinutes: 60 * 20, // 20 hours
    tags: ['career', 'education'],
    createdAt: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Improve sleep quality',
    description: 'Establish a regular sleep schedule and pre-sleep routine',
    deadline: tomorrowStr,
    status: 'in_progress',
    progress: 50,
    priorityId: '1',
    impact: 'high',
    estimatedTimeMinutes: 60 * 8, // 8 hours per day
    tags: ['health', 'habit'],
    createdAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    title: 'Weekly family dinner',
    description: 'Host or attend family dinner every Sunday evening',
    deadline: today,
    status: 'in_progress',
    progress: 80,
    priorityId: '3',
    impact: 'medium',
    estimatedTimeMinutes: 60 * 3, // 3 hours
    tags: ['family', 'routine'],
    createdAt: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    title: 'Learn Spanish basics',
    description: 'Study Spanish for at least 20 minutes daily using language apps',
    deadline: twoMonthsStr,
    status: 'not_started',
    progress: 0,
    priorityId: '4',
    impact: 'medium',
    estimatedTimeMinutes: 60 * 30, // 30 hours total
    tags: ['education', 'skill'],
    createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '6',
    title: 'Meditate daily',
    description: 'Practice mindfulness meditation for at least 10 minutes every day',
    status: 'completed',
    progress: 100,
    priorityId: '1',
    impact: 'medium',
    estimatedTimeMinutes: 10 * 30, // 10 minutes for 30 days
    tags: ['health', 'mental', 'habit'],
    createdAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '7',
    title: 'Declutter home office',
    description: 'Organize workspace, file documents, and create a more efficient setup',
    deadline: nextWeekStr,
    status: 'not_started',
    progress: 0,
    priorityId: '5',
    impact: 'low',
    estimatedTimeMinutes: 60 * 4, // 4 hours
    tags: ['home', 'organization'],
    createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '8',
    title: 'Create a personal website',
    description: 'Design and develop a professional portfolio website',
    deadline: nextMonthStr,
    status: 'not_started',
    progress: 0,
    priorityId: '5',
    impact: 'medium',
    estimatedTimeMinutes: 60 * 15, // 15 hours
    tags: ['career', 'development', 'project'],
    createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock data collection with all exported data
const mockData = {
  priorities,
  goals
};

// Default export for Expo Router compatibility
export default mockData; 