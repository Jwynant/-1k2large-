/**
 * Navigation helpers for end-to-end tests
 */

const { element, by, waitFor, device } = require('detox');

/**
 * Navigate to a specific tab
 * @param {string} tabName - The name of the tab to navigate to ('today', 'profile', etc.)
 */
async function navigateToTab(tabName) {
  await element(by.id(`tab-${tabName}`)).tap();
  await waitFor(element(by.id(`${tabName}-screen`)))
    .toBeVisible()
    .withTimeout(2000);
}

/**
 * Skip onboarding if possible
 * This is useful for tests that don't need to test the onboarding flow
 */
async function skipOnboarding() {
  try {
    // Try to find the "Skip" button if it exists
    const skipButton = element(by.id('skip-onboarding-button'));
    if (await skipButton.isVisible()) {
      await skipButton.tap();
    }
    
    // Alternative: try to find the "Complete" button at the end of onboarding
    const completeButton = element(by.id('complete-onboarding-button'));
    if (await completeButton.isVisible()) {
      await completeButton.tap();
    }
  } catch (error) {
    console.log('Could not skip onboarding, may already be in the main app');
  }
}

/**
 * Reset the app to a clean state
 * @param {boolean} clearStorage - Whether to clear app storage
 */
async function resetApp(clearStorage = true) {
  await device.launchApp({
    delete: clearStorage,
    newInstance: true
  });
}

/**
 * Wait for an element to be visible with a custom timeout
 * @param {string} elementId - The testID of the element to wait for
 * @param {number} timeout - Timeout in milliseconds
 */
async function waitForElement(elementId, timeout = 5000) {
  await waitFor(element(by.id(elementId)))
    .toBeVisible()
    .withTimeout(timeout);
}

module.exports = {
  navigateToTab,
  skipOnboarding,
  resetApp,
  waitForElement
}; 