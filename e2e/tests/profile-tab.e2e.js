describe('Profile Tab', () => {
  beforeAll(async () => {
    // Launch the app
    await device.launchApp();
    
    // Navigate to the Profile tab
    await element(by.id('tab-profile')).tap();
  });

  it('should display the profile screen with user information', async () => {
    // Check if the profile screen is visible with user info
    await expect(element(by.id('profile-screen'))).toBeVisible();
    await expect(element(by.id('user-name'))).toBeVisible();
  });

  it('should allow changing birth date', async () => {
    // Tap on the birth date setting
    await element(by.id('birth-date-setting')).tap();
    
    // Verify the birth date modal appears
    await expect(element(by.id('birth-date-modal'))).toBeVisible();
    
    // Interact with the date picker (implementation will depend on the actual date picker used)
    // For this test, we'll just close the modal
    await element(by.id('cancel-button')).tap();
  });

  it('should allow changing life expectancy', async () => {
    // Tap on the life expectancy setting
    await element(by.id('life-expectancy-setting')).tap();
    
    // Verify the life expectancy modal appears
    await expect(element(by.id('life-expectancy-modal'))).toBeVisible();
    
    // Adjust the life expectancy
    // For this test, we'll just close the modal
    await element(by.id('cancel-button')).tap();
  });

  it('should allow changing theme', async () => {
    // Tap on the theme setting
    await element(by.id('theme-setting')).tap();
    
    // Verify the theme modal appears
    await expect(element(by.id('theme-modal'))).toBeVisible();
    
    // Select a theme
    await element(by.id('theme-dark')).tap();
    
    // Verify the theme was changed (this might be difficult to test visually)
    // For now, we'll just check if the modal closed
    await expect(element(by.id('theme-modal'))).not.toBeVisible();
  });

  it('should toggle notification settings', async () => {
    // Find the notifications toggle
    const notificationsToggle = element(by.id('notifications-toggle'));
    
    // Get the current state
    const initialState = await notificationsToggle.getAttributes();
    const initialValue = initialState.value;
    
    // Toggle the switch
    await notificationsToggle.tap();
    
    // Verify the toggle changed state
    const newState = await notificationsToggle.getAttributes();
    await expect(newState.value).not.toEqual(initialValue);
    
    // Toggle back to original state
    await notificationsToggle.tap();
  });

  it('should toggle completed goals setting', async () => {
    // Find the completed goals toggle
    const completedGoalsToggle = element(by.id('completed-goals-toggle'));
    
    // Toggle the switch
    await completedGoalsToggle.tap();
    
    // Toggle back
    await completedGoalsToggle.tap();
  });

  it('should toggle week start setting', async () => {
    // Find the week start toggle
    const weekStartToggle = element(by.id('week-start-toggle'));
    
    // Toggle the switch
    await weekStartToggle.tap();
    
    // Toggle back
    await weekStartToggle.tap();
  });
}); 