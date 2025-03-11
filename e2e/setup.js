const { device, element, by, waitFor } = require('detox');
const navigationHelpers = require('./helpers/navigation');
const uiHelpers = require('./helpers/ui');
const testDataHelpers = require('./helpers/testData');

beforeAll(async () => {
  await device.launchApp();
});

beforeEach(async () => {
  await device.reloadReactNative();
});

// Make helper functions available globally
global.navigateToTab = navigationHelpers.navigateToTab;
global.skipOnboarding = navigationHelpers.skipOnboarding;
global.resetApp = navigationHelpers.resetApp;
global.waitForElement = navigationHelpers.waitForElement;

global.tapButton = uiHelpers.tapButton;
global.enterText = uiHelpers.enterText;
global.clearText = uiHelpers.clearText;
global.toggleSwitch = uiHelpers.toggleSwitch;
global.scrollToElement = uiHelpers.scrollToElement;
global.swipe = uiHelpers.swipe;
global.isElementVisible = uiHelpers.isElementVisible;

global.generateUserProfile = testDataHelpers.generateUserProfile;
global.generateGoal = testDataHelpers.generateGoal;
global.generateMemory = testDataHelpers.generateMemory;
global.generateFocusAreas = testDataHelpers.generateFocusAreas;

// Additional helper functions that can be used across tests
global.waitForElementToBeVisible = async (elementId, timeout = 5000) => {
  await waitFor(element(by.id(elementId)))
    .toBeVisible()
    .withTimeout(timeout);
};

global.typeText = async (fieldId, text) => {
  await element(by.id(fieldId)).typeText(text);
};

global.scrollTo = async (scrollViewId, elementId) => {
  await element(by.id(scrollViewId)).scrollTo('bottom');
  await waitFor(element(by.id(elementId))).toBeVisible().withTimeout(2000);
};

// Helper for taking screenshots during tests (useful for debugging)
global.takeScreenshot = async (name) => {
  await device.takeScreenshot(name);
};

// Helper for handling alerts
global.acceptAlert = async () => {
  await element(by.text('OK')).tap();
};

global.dismissAlert = async () => {
  await element(by.text('Cancel')).tap();
};

// Helper for checking if an element exists without failing the test
global.elementExists = async (matcher) => {
  try {
    await expect(element(matcher)).toExist();
    return true;
  } catch (error) {
    return false;
  }
}; 