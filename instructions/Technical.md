# Technical Specification: 1000 Months

## 1. Data Models

### User
```typescript
interface User {
  id: string;
  email: string;
  birthDate: Date;
  accentColor: string;
  settings: UserSettings;
  createdAt: Date;
  updatedAt: Date;
}

interface UserSettings {
  expectedLifespan: number; // in months, default: 960 (80 years)
  defaultView: 'week' | 'month' | 'year';
  notificationPreferences: NotificationPreferences;
  privacySettings: PrivacySettings;
}
```

### Content Base
```typescript
interface ContentBase {
  id: string;
  userId: string;
  title: string;
  notes?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  isPrivate: boolean;
}
```

### Memory
```typescript
interface Memory extends ContentBase {
  emoji?: string;
  mediaUrls: string[]; // Max 5 items
  seasonIds: string[];
  lessonIds: string[];
  relatedMemoryIds: string[];
}
```

### Lesson
```typescript
interface Lesson extends ContentBase {
  source?: string;
  importance: 1 | 2 | 3 | 4 | 5;
  reminders: Reminder[];
  memoryIds: string[];
}
```

### Goal
```typescript
interface Goal extends ContentBase {
  deadline?: Date;
  status: 'active' | 'completed' | 'abandoned';
  priorityIds: string[];
}
```

### Priority
```typescript
interface Priority extends ContentBase {
  startDate?: Date;
  endDate?: Date;
  isTopPriority: boolean;
  goalIds: string[];
  sacrificeIds: string[];
}
```

### Season
```typescript
interface Season extends ContentBase {
  startDate: Date;
  endDate: Date;
  memoryIds: string[];
}
```

### DailyReflection
```typescript
interface DailyReflection extends ContentBase {
  reflection: string; // Max 500 chars
}
```

## 2. Grid System Architecture

### Grid Data Structure
```typescript
interface GridCluster {
  type: 'week' | 'month' | 'year';
  startDate: Date;
  endDate: Date;
  cells: GridCell[];
}

interface GridCell {
  date: Date;
  contentCounts: {
    memories: number;
    lessons: number;
    goals: number;
    reflections: number;
  };
  content: {
    memories: string[]; // IDs
    lessons: string[];
    goals: string[];
    reflections: string[];
  };
}
```

### Grid View Management
```typescript
interface GridViewState {
  currentView: 'week' | 'month' | 'year';
  visibleRange: {
    start: Date;
    end: Date;
  };
  clusters: GridCluster[];
}
```

## 3. Storage Architecture

### Local Storage Schema
```typescript
interface LocalStorageSchema {
  user: User;
  contentCache: {
    memories: Record<string, Memory>;
    lessons: Record<string, Lesson>;
    goals: Record<string, Goal>;
    priorities: Record<string, Priority>;
    seasons: Record<string, Season>;
    reflections: Record<string, DailyReflection>;
  };
  gridCache: {
    clusters: Record<string, GridCluster>;
  };
  syncState: {
    lastSync: Date;
    pendingUploads: PendingUpload[];
  };
}
```

### Firebase Collections
- users
- memories
- lessons
- goals
- priorities
- seasons
- reflections
- notifications

## 4. State Management

### Global State Structure
```typescript
interface AppState {
  user: UserState;
  grid: GridState;
  content: ContentState;
  ui: UIState;
  sync: SyncState;
}

interface UIState {
  selectedDate: Date;
  activeView: 'week' | 'month' | 'year';
  bottomSheet: {
    isOpen: boolean;
    type: 'cell' | 'create' | 'edit';
    data: any;
  };
  modals: {
    isOpen: boolean;
    type: string;
    data: any;
  }[];
}
```

## 5. Performance Optimizations

### Grid Virtualization
- Implement windowing for grid cells
- Load clusters on-demand
- Cache visible range +/- 1 month/year

### Content Loading Strategy
```typescript
interface ContentLoadingStrategy {
  preloadThreshold: number; // Items to preload
  pageSize: number; // Items per page
  maxCachedPages: number;
}
```

### Memoization Strategy
- Memoize grid cell rendering
- Cache content calculations
- Optimize relationship traversal

## 6. Offline Support

### Sync Queue
```typescript
interface SyncQueue {
  pending: PendingOperation[];
  failed: FailedOperation[];
  retryStrategy: RetryStrategy;
}

interface PendingOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  model: string;
  data: any;
  timestamp: Date;
}
```

### Conflict Resolution
```typescript
interface ConflictResolution {
  strategy: 'client-wins' | 'server-wins' | 'manual';
  resolution?: any;
  timestamp: Date;
}
```

## 7. Security

### Encryption
```typescript
interface EncryptionConfig {
  algorithm: 'AES-GCM';
  keySize: 256;
  saltSize: 16;
}
```

### Privacy Markers
```typescript
interface PrivacyConfig {
  privateContentKey?: string; // Encryption key for private content
  biometricEnabled: boolean;
  autoLockDuration: number; // minutes
}
```

## 8. Analytics

### Event Tracking
```typescript
interface AnalyticsEvent {
  type: string;
  timestamp: Date;
  data: any;
  userId: string;
  sessionId: string;
}
```

### Metrics Collection
```typescript
interface UserMetrics {
  contentCounts: Record<string, number>;
  streaks: {
    current: number;
    longest: number;
    lastUpdate: Date;
  };
  viewPreferences: Record<string, number>;
  engagementScore: number;
}
```

## 9. Notification System

### Notification Types
```typescript
interface NotificationConfig {
  types: {
    dailyReflection: {
      frequency: 'daily';
      timeOfDay: string; // HH:mm
    };
    weeklyReview: {
      frequency: 'weekly';
      dayOfWeek: number;
      timeOfDay: string;
    };
    goalCheckIn: {
      frequency: 'custom';
      interval: number; // days
    };
    futureEvent: {
      timing: number[]; // days before event
    };
  };
}
```

## 10. Integration Points

### External Services
- Firebase Authentication
- Firebase Cloud Storage (media)
- Firebase Cloud Functions (background tasks)
- Analytics Service
- Push Notification Service

### API Endpoints
- User Management
- Content CRUD
- Grid Data
- Analytics
- Settings
- Sync
- Media Upload