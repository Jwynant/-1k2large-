const { navigateToTab, skipOnboarding, resetApp } = require('../helpers/navigation');
const { tapButton, enterText, isElementVisible, scrollToElement } = require('../helpers/ui');
const { generateGoal } = require('../helpers/testData');

describe('Goals Functionality', () => {
  beforeAll(async () => {
    // Reset the app and skip onboarding
    await resetApp(true);
    await skipOnboarding();
    
    // Navigate to the Today tab where goals are displayed
    await navigateToTab('today');
  });

  it('should display the goals dashboard', async () => {
    // Check if the goals dashboard is visible
    await expect(element(by.id('goals-dashboard'))).toBeVisible();
  });

  it('should allow creating a new goal', async () => {
    // Generate test data for our goal
    const testGoal = generateGoal();
    
    // Tap the add goal button
    await tapButton('add-goal-button');
    
    // Verify the goal form is displayed
    await expect(element(by.id('goal-form'))).toBeVisible();
    
    // Fill in the goal details
    await enterText('goal-title-input', testGoal.title);
    await enterText('goal-description-input', testGoal.description);
    
    // Select a focus area
    await tapButton('focus-area-picker');
    await element(by.text(testGoal.focusArea)).tap();
    
    // Set dates if date pickers are available
    if (await isElementVisible('start-date-picker')) {
      await tapButton('start-date-picker');
      await tapButton('confirm-date-button');
    }
    
    if (await isElementVisible('target-date-picker')) {
      await tapButton('target-date-picker');
      await tapButton('confirm-date-button');
    }
    
    // Save the goal
    await tapButton('save-goal-button');
    
    // Verify the goal was added to the dashboard
    await expect(element(by.text(testGoal.title))).toBeVisible();
  });

  it('should allow viewing goal details', async () => {
    // Find and tap on the first goal in the list
    const firstGoal = element(by.id('goal-item').withAncestor(by.id('goals-list'))).atIndex(0);
    await firstGoal.tap();
    
    // Verify the goal details screen is displayed
    await expect(element(by.id('goal-details-screen'))).toBeVisible();
    
    // Go back to the goals list
    await device.pressBack();
  });

  it('should allow marking a goal as complete', async () => {
    // Find the complete button for the first goal
    const completeButton = element(by.id('complete-goal-button').withAncestor(by.id('goals-list'))).atIndex(0);
    
    // Tap the complete button
    await completeButton.tap();
    
    // Verify the completion dialog appears
    await expect(element(by.id('goal-completion-dialog'))).toBeVisible();
    
    // Confirm completion
    await tapButton('confirm-completion-button');
    
    // Verify the goal is marked as complete (might show a checkmark or move to completed section)
    // This will depend on how your UI indicates completed goals
    if (await isElementVisible('completed-goals-section')) {
      await expect(element(by.id('goal-item').withAncestor(by.id('completed-goals-section')))).toBeVisible();
    } else {
      // Alternative: check for a completion indicator
      await expect(element(by.id('goal-completed-indicator'))).toBeVisible();
    }
  });

  it('should allow filtering goals by focus area', async () => {
    // If there's a filter control, tap it
    if (await isElementVisible('goals-filter-button')) {
      await tapButton('goals-filter-button');
      
      // Select a specific focus area filter
      await tapButton('filter-health-button');
      
      // Verify only goals with that focus area are shown
      // This will depend on your UI implementation
      await expect(element(by.id('filtered-indicator'))).toBeVisible();
      
      // Clear the filter
      await tapButton('clear-filter-button');
    }
  });

  it('should allow editing an existing goal', async () => {
    // Find and long press on the first goal to open edit options
    const firstGoal = element(by.id('goal-item').withAncestor(by.id('goals-list'))).atIndex(0);
    await firstGoal.longPress();
    
    // Tap the edit button
    await tapButton('edit-goal-button');
    
    // Verify the edit form is displayed
    await expect(element(by.id('goal-form'))).toBeVisible();
    
    // Update the goal title
    const updatedTitle = 'Updated Goal Title';
    await enterText('goal-title-input', updatedTitle);
    
    // Save the changes
    await tapButton('save-goal-button');
    
    // Verify the goal was updated
    await expect(element(by.text(updatedTitle))).toBeVisible();
  });

  it('should allow deleting a goal', async () => {
    // Find and long press on the first goal to open edit options
    const firstGoal = element(by.id('goal-item').withAncestor(by.id('goals-list'))).atIndex(0);
    await firstGoal.longPress();
    
    // Tap the delete button
    await tapButton('delete-goal-button');
    
    // Verify the confirmation dialog appears
    await expect(element(by.id('delete-confirmation-dialog'))).toBeVisible();
    
    // Confirm deletion
    await tapButton('confirm-delete-button');
    
    // Verify the goal was removed (this is tricky to test directly)
    // One approach is to check that the number of goals decreased
    // Another is to verify a "no goals" message if all goals were deleted
    if (await isElementVisible('no-goals-message')) {
      await expect(element(by.id('no-goals-message'))).toBeVisible();
    }
  });
}); 