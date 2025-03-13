import { FocusArea, PriorityLevel } from '../types';

/**
 * Migrate focus areas to include priorityLevel based on rank
 * This is needed for backwards compatibility with data created before
 * the priorityLevel field was added
 */
export function migrateFocusAreas(focusAreas: FocusArea[]): FocusArea[] {
  return focusAreas.map(area => {
    // If area already has priorityLevel defined, return as is
    if ('priorityLevel' in area && area.priorityLevel) {
      return area;
    }
    
    // Otherwise, determine priority level from rank
    let priorityLevel: PriorityLevel;
    if (area.rank === 1) {
      priorityLevel = 'primary';
    } else if (area.rank === 2 || area.rank === 3) {
      priorityLevel = 'secondary';
    } else {
      priorityLevel = 'tertiary';
    }
    
    // Create a new focus area with the priorityLevel field
    return {
      ...area,
      priorityLevel
    };
  });
}

/**
 * Check if focus areas need migration
 */
export function needsFocusAreaMigration(focusAreas: FocusArea[]): boolean {
  if (!focusAreas || focusAreas.length === 0) return false;
  
  // Check if any focus area is missing the priorityLevel property
  return focusAreas.some(area => !('priorityLevel' in area) || !area.priorityLevel);
}

/**
 * Migrates focus areas to the new schema without allocations and using the new priority levels
 */
export function migrateToNewFocusAreaSchema(focusAreas: FocusArea[]): FocusArea[] {
  return focusAreas.map(area => {
    // Convert old priority levels to new names
    let newPriorityLevel: PriorityLevel;
    
    // Handle old priority levels (cast as string to avoid type errors)
    const oldPriorityLevel = area.priorityLevel as unknown as string;
    if (oldPriorityLevel === 'primary') {
      newPriorityLevel = 'essential';
    } else if (oldPriorityLevel === 'secondary') {
      newPriorityLevel = 'important';
    } else if (oldPriorityLevel === 'tertiary') {
      newPriorityLevel = 'supplemental';
    } else {
      // Fallback for any data inconsistencies
      newPriorityLevel = 'important';
    }
    
    // Create new area without the allocation field
    // Use type assertion to handle old schema
    const oldArea = area as any;
    const { allocation, ...restOfArea } = oldArea;
    
    // Set last updated to now if it doesn't exist
    const lastUpdated = area.lastUpdated || new Date().toISOString();
    
    // Return updated area
    return {
      ...restOfArea,
      priorityLevel: newPriorityLevel,
      lastUpdated,
      status: 'active' // Default all existing areas to active
    };
  });
}

/**
 * Checks if focus areas need migration to the new schema
 */
export function needsNewSchemaFocusAreaMigration(focusAreas: FocusArea[]): boolean {
  // If there are no focus areas, no migration is needed
  if (focusAreas.length === 0) return false;
  
  // Check if any focus area has an allocation field or old priority levels
  return focusAreas.some(area => {
    const oldArea = area as any;
    return 'allocation' in oldArea || 
      oldArea.priorityLevel === 'primary' || 
      oldArea.priorityLevel === 'secondary' || 
      oldArea.priorityLevel === 'tertiary';
  });
} 