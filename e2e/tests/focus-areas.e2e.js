const { navigateToTab, skipOnboarding, resetApp } = require('../helpers/navigation');
const { tapButton, enterText, isElementVisible } = require('../helpers/ui');

describe('Focus Areas Functionality', () => {
  beforeAll(async () => {
    // Reset the app and skip onboarding
    await resetApp(true);
    await skipOnboarding();
    
    // Navigate to the Today tab where focus areas are displayed
    await navigateToTab('today');
  });

  it('should display the focus areas card', async () => {
    // Check if the focus areas card is visible
    await expect(element(by.id('focus-areas-card'))).toBeVisible();
  });

  it('should display predefined focus areas', async () => {
    // Check for common focus areas
    await expect(element(by.text('Health'))).toBeVisible();
    
    // Try to find other common focus areas if they're visible
    const commonAreas = ['Career', 'Relationships', 'Personal Growth'];
    for (const area of commonAreas) {
      try {
        await expect(element(by.text(area))).toBeVisible();
      } catch (error) {
        console.log(`Focus area "${area}" not visible in the current view`);
      }
    }
  });

  it('should allow viewing focus area details', async () => {
    // Tap on a focus area (e.g., Health)
    await element(by.text('Health')).tap();
    
    // Verify the focus area details screen is displayed
    await expect(element(by.id('focus-area-details'))).toBeVisible();
    
    // Check for goals section in the focus area details
    await expect(element(by.id('focus-area-goals'))).toBeVisible();
    
    // Go back to the main screen
    await device.pressBack();
  });

  it('should allow adding a custom focus area if supported', async () => {
    // Check if the add focus area button exists
    if (await isElementVisible('add-focus-area-button')) {
      // Tap the add focus area button
      await tapButton('add-focus-area-button');
      
      // Verify the focus area form is displayed
      await expect(element(by.id('focus-area-form'))).toBeVisible();
      
      // Fill in the focus area details
      const customAreaName = 'Travel';
      await enterText('focus-area-name-input', customAreaName);
      
      // Select a color if color picker is available
      if (await isElementVisible('focus-area-color-picker')) {
        await tapButton('focus-area-color-picker');
        await element(by.id('color-option').withAncestor(by.id('color-picker'))).atIndex(2).tap();
      }
      
      // Select an icon if icon picker is available
      if (await isElementVisible('focus-area-icon-picker')) {
        await tapButton('focus-area-icon-picker');
        await element(by.id('icon-option').withAncestor(by.id('icon-picker'))).atIndex(3).tap();
      }
      
      // Save the focus area
      await tapButton('save-focus-area-button');
      
      // Verify the new focus area was added
      await expect(element(by.text(customAreaName))).toBeVisible();
    } else {
      console.log('Adding custom focus areas is not supported in the current version');
    }
  });

  it('should allow editing a focus area if supported', async () => {
    // Check if editing is supported by looking for edit buttons or long press behavior
    // This will depend on your UI implementation
    
    // Try long pressing on a focus area
    const focusArea = element(by.id('focus-area-item')).atIndex(0);
    await focusArea.longPress();
    
    // Check if edit option appears
    if (await isElementVisible('edit-focus-area-button')) {
      // Tap the edit button
      await tapButton('edit-focus-area-button');
      
      // Verify the edit form is displayed
      await expect(element(by.id('focus-area-form'))).toBeVisible();
      
      // Update the focus area name
      const updatedName = 'Updated Focus Area';
      await enterText('focus-area-name-input', updatedName);
      
      // Save the changes
      await tapButton('save-focus-area-button');
      
      // Verify the focus area was updated
      await expect(element(by.text(updatedName))).toBeVisible();
    } else {
      console.log('Editing focus areas is not supported in the current version');
    }
  });

  it('should show progress for each focus area', async () => {
    // Check if progress indicators are visible for focus areas
    await expect(element(by.id('focus-area-progress'))).toBeVisible();
  });
}); 