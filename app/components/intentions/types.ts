// Enhanced Priority type with level instead of isTopPriority
export type PriorityLevel = 'high' | 'medium' | 'low';

export type Priority = {
  id: string;
  title: string;
  level: PriorityLevel; // Replacing isTopPriority with levels
  goals: string[];
  icon: string;
  color: string;
  sortOrder: number; // For manual ordering
  progress?: number;
};

// Enhanced Goal type with impact and timeframe
export type GoalStatus = 'not_started' | 'in_progress' | 'completed' | 'abandoned';
export type ImpactLevel = 'high' | 'medium' | 'low';

export type Goal = {
  id: string;
  title: string;
  description?: string; // Added for more context
  deadline?: string;
  status: GoalStatus;
  progress: number; // 0-100
  priorityId: string;
  impact: ImpactLevel; // Added impact assessment
  estimatedTimeMinutes?: number; // Added time estimation
  tags?: string[]; // Added for flexible categorization
  createdAt: string;
  updatedAt: string;
};

// Types for filtering and sorting
export type SortOption = 'deadline' | 'priority' | 'progress' | 'impact' | 'created' | 'title';
export type FilterOption = 'all' | 'high' | 'medium' | 'low' | PriorityLevel | string;

// Timeframe categorization
export type TimeframeCategory = 'today' | 'thisWeek' | 'thisMonth' | 'future' | 'completed';

// Stats type
export type GoalStats = {
  totalGoals: number;
  completedGoals: number;
  activeGoals: number;
  notStartedGoals: number;
  inProgressGoals: number;
  abandonedGoals: number;
  completionRate: number;
  dueToday: number;
  dueThisWeek: number;
  dueThisMonth: number;
  highPriorityGoals: number;
  mediumPriorityGoals: number;
  lowPriorityGoals: number;
  highImpactGoals: number;
}; 