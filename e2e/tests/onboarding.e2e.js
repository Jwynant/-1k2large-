describe('Onboarding Flow', () => {
  beforeAll(async () => {
    // Reset the app to ensure we start from a clean state
    await device.launchApp({ delete: true });
  });

  it('should display the splash screen on first launch', async () => {
    // Check if we're on the splash screen (first step of onboarding)
    await expect(element(by.text('Life in Weeks'))).toBeVisible();
    
    // Wait for the splash screen animation to complete
    // The splash screen has an auto-advance after animations
    await waitFor(element(by.text('Get Started')))
      .toBeVisible()
      .withTimeout(5000);
  });

  it('should navigate to personal info screen and complete it', async () => {
    // We should now be on the personal info screen
    await expect(element(by.text('Tell us about yourself'))).toBeVisible();
    
    // Fill in the personal information
    await element(by.id('name-input')).typeText('Test User');
    await element(by.id('birthdate-input')).tap();
    
    // Handle date picker - this will depend on the actual implementation
    // For now, we'll just assume we can select a date and continue
    await element(by.text('Confirm')).tap();
    
    // Tap the next button to proceed
    await element(by.id('personal-info-next-button')).tap();
  });

  it('should navigate through the grid tour view', async () => {
    // We should now be on the grid tour view
    await expect(element(by.text('Your Life in Weeks'))).toBeVisible();
    
    // Tap the next button to proceed
    await element(by.id('grid-tour-next-button')).tap();
  });

  it('should complete the lifespan customization and enter the app', async () => {
    // We should now be on the lifespan customization screen
    await expect(element(by.text('Customize Your Lifespan'))).toBeVisible();
    
    // Adjust the lifespan if needed
    // For testing, we'll just proceed with the default
    
    // Tap the complete button to finish onboarding
    await element(by.id('complete-onboarding-button')).tap();
    
    // Verify we're on the main app screen (Today tab)
    await expect(element(by.id('today-screen'))).toBeVisible();
  });
}); 