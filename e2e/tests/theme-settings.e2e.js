const { navigateToTab, skipOnboarding, resetApp } = require('../helpers/navigation');
const { tapButton, toggleSwitch, isElementVisible } = require('../helpers/ui');

describe('Theme and Appearance Settings', () => {
  beforeAll(async () => {
    // Reset the app and skip onboarding
    await resetApp(true);
    await skipOnboarding();
    
    // Navigate to the Profile tab where theme settings are located
    await navigateToTab('profile');
  });

  it('should display appearance settings in the profile screen', async () => {
    // Check if the appearance/theme section is visible
    await expect(element(by.id('appearance-settings-section'))).toBeVisible();
  });

  it('should allow changing theme mode', async () => {
    // Tap on the theme setting
    await tapButton('theme-setting');
    
    // Verify the theme modal appears
    await expect(element(by.id('theme-modal'))).toBeVisible();
    
    // Test selecting different themes
    
    // Select dark theme
    await tapButton('theme-dark');
    
    // Verify the theme modal closed
    await expect(element(by.id('theme-modal'))).not.toBeVisible();
    
    // Reopen the theme modal
    await tapButton('theme-setting');
    
    // Select light theme
    await tapButton('theme-light');
    
    // Verify the theme modal closed
    await expect(element(by.id('theme-modal'))).not.toBeVisible();
    
    // Reopen the theme modal
    await tapButton('theme-setting');
    
    // Select system theme
    await tapButton('theme-system');
    
    // Verify the theme modal closed
    await expect(element(by.id('theme-modal'))).not.toBeVisible();
  });

  it('should allow toggling dark mode directly if available', async () => {
    // Some apps have a direct toggle for dark mode
    if (await isElementVisible('dark-mode-toggle')) {
      // Toggle dark mode
      await toggleSwitch('dark-mode-toggle');
      
      // Toggle it back
      await toggleSwitch('dark-mode-toggle');
    }
  });

  it('should allow changing text size if available', async () => {
    // Check if text size settings are available
    if (await isElementVisible('text-size-setting')) {
      // Tap on the text size setting
      await tapButton('text-size-setting');
      
      // Verify the text size modal appears
      await expect(element(by.id('text-size-modal'))).toBeVisible();
      
      // Select a larger text size
      await tapButton('text-size-large');
      
      // Verify the modal closed
      await expect(element(by.id('text-size-modal'))).not.toBeVisible();
      
      // Reopen the text size modal
      await tapButton('text-size-setting');
      
      // Select the default text size
      await tapButton('text-size-default');
      
      // Verify the modal closed
      await expect(element(by.id('text-size-modal'))).not.toBeVisible();
    }
  });

  it('should allow changing color accent if available', async () => {
    // Check if accent color settings are available
    if (await isElementVisible('accent-color-setting')) {
      // Tap on the accent color setting
      await tapButton('accent-color-setting');
      
      // Verify the accent color modal appears
      await expect(element(by.id('accent-color-modal'))).toBeVisible();
      
      // Select a different accent color
      await element(by.id('color-option').withAncestor(by.id('accent-color-modal'))).atIndex(2).tap();
      
      // Verify the modal closed
      await expect(element(by.id('accent-color-modal'))).not.toBeVisible();
    }
  });

  it('should persist theme settings after app restart', async () => {
    // First, set a specific theme
    await tapButton('theme-setting');
    await tapButton('theme-dark');
    
    // Restart the app
    await device.reloadReactNative();
    
    // Navigate back to the profile tab
    await navigateToTab('profile');
    
    // Tap on the theme setting again
    await tapButton('theme-setting');
    
    // Verify the dark theme is still selected (this will depend on your UI implementation)
    // One way to check is to see if the dark theme option has a selected indicator
    await expect(element(by.id('theme-dark-selected'))).toBeVisible();
    
    // Close the theme modal
    await tapButton('close-modal-button');
  });
}); 