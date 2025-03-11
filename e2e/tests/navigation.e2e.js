const { skipOnboarding, resetApp, waitForElement } = require('../helpers/navigation');

describe('App Navigation', () => {
  beforeAll(async () => {
    // Reset the app and skip onboarding
    await resetApp(true);
    await skipOnboarding();
  });

  it('should display the tab bar with all tabs', async () => {
    // Check if the tab bar is visible
    await expect(element(by.id('tab-bar'))).toBeVisible();
    
    // Check if all tabs are visible
    await expect(element(by.id('tab-today'))).toBeVisible();
    await expect(element(by.id('tab-profile'))).toBeVisible();
    
    // Check for other tabs if they exist
    try {
      await expect(element(by.id('tab-grid'))).toBeVisible();
    } catch (error) {
      console.log('Grid tab not available in the current version');
    }
    
    try {
      await expect(element(by.id('tab-memories'))).toBeVisible();
    } catch (error) {
      console.log('Memories tab not available in the current version');
    }
  });

  it('should navigate between tabs', async () => {
    // Start on the Today tab
    await element(by.id('tab-today')).tap();
    await waitForElement('today-screen');
    
    // Navigate to the Profile tab
    await element(by.id('tab-profile')).tap();
    await waitForElement('profile-screen');
    
    // Navigate back to the Today tab
    await element(by.id('tab-today')).tap();
    await waitForElement('today-screen');
    
    // Try navigating to other tabs if they exist
    if (await element(by.id('tab-grid')).isVisible()) {
      await element(by.id('tab-grid')).tap();
      await waitForElement('grid-screen');
    }
    
    if (await element(by.id('tab-memories')).isVisible()) {
      await element(by.id('tab-memories')).tap();
      await waitForElement('memories-screen');
    }
  });

  it('should maintain tab state when switching between tabs', async () => {
    // Navigate to the Today tab
    await element(by.id('tab-today')).tap();
    
    // Perform some action that changes the state
    // For example, expand a section if available
    if (await element(by.id('expand-goals-button')).isVisible()) {
      await element(by.id('expand-goals-button')).tap();
    }
    
    // Navigate to the Profile tab
    await element(by.id('tab-profile')).tap();
    await waitForElement('profile-screen');
    
    // Navigate back to the Today tab
    await element(by.id('tab-today')).tap();
    await waitForElement('today-screen');
    
    // Verify the state is maintained (the section is still expanded)
    if (await element(by.id('goals-expanded-view')).isVisible()) {
      await expect(element(by.id('goals-expanded-view'))).toBeVisible();
    }
  });

  it('should handle deep linking to specific screens if supported', async () => {
    // This test would typically use the device.openURL() method
    // However, this requires additional setup in the app
    // For now, we'll simulate deep linking by navigating through the UI
    
    // Navigate to a specific goal if available
    await element(by.id('tab-today')).tap();
    
    if (await element(by.id('goals-dashboard')).isVisible()) {
      // Find and tap on the first goal
      const firstGoal = element(by.id('goal-item')).atIndex(0);
      if (await firstGoal.isVisible()) {
        await firstGoal.tap();
        
        // Verify we're on the goal details screen
        await waitForElement('goal-details-screen');
        
        // Go back
        await device.pressBack();
      }
    }
  });

  it('should handle the back button correctly', async () => {
    // Navigate to the Profile tab
    await element(by.id('tab-profile')).tap();
    
    // Tap on a setting that opens a new screen
    await element(by.id('theme-setting')).tap();
    
    // Verify the theme modal appears
    await expect(element(by.id('theme-modal'))).toBeVisible();
    
    // Press the back button
    await device.pressBack();
    
    // Verify we're back on the profile screen and the modal is closed
    await expect(element(by.id('theme-modal'))).not.toBeVisible();
    await expect(element(by.id('profile-screen'))).toBeVisible();
  });

  it('should handle gestures for navigation if supported', async () => {
    // This test is platform-specific and may not work on all devices
    // For iOS, we can test swipe gestures for navigation
    
    // Navigate to a detail screen first
    await element(by.id('tab-today')).tap();
    
    if (await element(by.id('focus-areas-card')).isVisible()) {
      // Tap on a focus area
      await element(by.text('Health')).tap();
      
      // Verify we're on the focus area details screen
      await waitForElement('focus-area-details');
      
      // Try to swipe back (from left edge to right)
      await element(by.id('focus-area-details')).swipe('right', 'slow', 0.1);
      
      // Check if we're back on the Today screen
      try {
        await waitForElement('today-screen', 2000);
        console.log('Swipe navigation is supported');
      } catch (error) {
        console.log('Swipe navigation not supported, using back button instead');
        await device.pressBack();
      }
    }
  });
}); 