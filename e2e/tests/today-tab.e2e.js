describe('Today Tab', () => {
  beforeAll(async () => {
    // Launch the app and skip onboarding if possible
    // In a real scenario, you might want to use a custom flag or API to skip onboarding
    await device.launchApp();
    
    // Try to navigate to the Today tab if we're not already there
    try {
      await element(by.id('tab-today')).tap();
    } catch (error) {
      console.log('Already on Today tab or navigation failed');
    }
  });

  it('should display the Today screen with header', async () => {
    // Check if the Today header is visible
    await expect(element(by.id('today-header'))).toBeVisible();
  });

  it('should display life progress card', async () => {
    // Check if the life progress card is visible
    await expect(element(by.id('life-progress-card'))).toBeVisible();
    
    // Verify some content within the card
    await expect(element(by.id('life-progress-percentage'))).toBeVisible();
  });

  it('should display goals dashboard', async () => {
    // Check if the goals dashboard is visible
    await expect(element(by.id('goals-dashboard'))).toBeVisible();
    
    // Test interaction with goals
    if (await element(by.id('add-goal-button')).isVisible()) {
      await element(by.id('add-goal-button')).tap();
      
      // Check if the goal creation form appears
      await expect(element(by.id('goal-form'))).toBeVisible();
      
      // Fill in goal details
      await element(by.id('goal-title-input')).typeText('Test Goal');
      await element(by.id('goal-description-input')).typeText('This is a test goal created by E2E test');
      
      // Select a focus area (assuming there's a dropdown or picker)
      await element(by.id('focus-area-picker')).tap();
      await element(by.text('Health')).tap(); // Assuming 'Health' is a focus area
      
      // Save the goal
      await element(by.id('save-goal-button')).tap();
      
      // Verify the goal was added
      await expect(element(by.text('Test Goal'))).toBeVisible();
    }
  });

  it('should display focus areas card', async () => {
    // Check if the focus areas card is visible
    await expect(element(by.id('focus-areas-card'))).toBeVisible();
  });

  it('should display quick action buttons', async () => {
    // Check if quick action buttons are visible
    await expect(element(by.id('quick-action-buttons'))).toBeVisible();
    
    // Verify all three buttons are visible
    await expect(element(by.id('add-memory-button'))).toBeVisible();
    await expect(element(by.id('add-goal-button'))).toBeVisible();
    await expect(element(by.id('add-lesson-button'))).toBeVisible();
    
    // Test memory button
    await element(by.id('add-memory-button')).tap();
    await expect(element(by.id('memory-form'))).toBeVisible();
    await device.pressBack();
    
    // Test goal button
    await element(by.id('add-goal-button')).tap();
    await expect(element(by.id('goal-form'))).toBeVisible();
    await device.pressBack();
    
    // Test lesson button
    await element(by.id('add-lesson-button')).tap();
    await expect(element(by.id('lesson-form'))).toBeVisible();
    await device.pressBack();
  });
}); 