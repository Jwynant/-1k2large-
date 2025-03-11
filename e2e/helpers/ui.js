/**
 * UI interaction helpers for end-to-end tests
 */

const { element, by, waitFor } = require('detox');

/**
 * Tap a button by its testID
 * @param {string} buttonId - The testID of the button
 */
async function tapButton(buttonId) {
  await element(by.id(buttonId)).tap();
}

/**
 * Enter text into an input field
 * @param {string} inputId - The testID of the input field
 * @param {string} text - The text to enter
 */
async function enterText(inputId, text) {
  await element(by.id(inputId)).replaceText(text);
}

/**
 * Clear text from an input field
 * @param {string} inputId - The testID of the input field
 */
async function clearText(inputId) {
  await element(by.id(inputId)).clearText();
}

/**
 * Toggle a switch
 * @param {string} switchId - The testID of the switch
 * @param {boolean} [toState] - The desired state (true for on, false for off)
 * @returns {Promise<boolean>} - The new state of the switch
 */
async function toggleSwitch(switchId, toState) {
  const switchElement = element(by.id(switchId));
  const attributes = await switchElement.getAttributes();
  const currentValue = attributes.value;
  
  // If toState is specified and already matches the current state, do nothing
  if (toState !== undefined && currentValue === toState) {
    return currentValue;
  }
  
  // Otherwise toggle the switch
  await switchElement.tap();
  
  // Return the new state (opposite of the current state)
  return !currentValue;
}

/**
 * Scroll to an element in a scrollable container
 * @param {string} scrollViewId - The testID of the ScrollView
 * @param {string} elementId - The testID of the element to scroll to
 * @param {string} [direction='down'] - The direction to scroll ('up', 'down', 'left', 'right')
 */
async function scrollToElement(scrollViewId, elementId, direction = 'down') {
  await element(by.id(scrollViewId)).scrollTo(direction);
  await waitFor(element(by.id(elementId)))
    .toBeVisible()
    .withTimeout(2000);
}

/**
 * Swipe on an element
 * @param {string} elementId - The testID of the element to swipe on
 * @param {string} direction - The direction to swipe ('up', 'down', 'left', 'right')
 * @param {string} [speed='fast'] - The speed of the swipe ('slow', 'fast')
 */
async function swipe(elementId, direction, speed = 'fast') {
  await element(by.id(elementId)).swipe(direction, speed);
}

/**
 * Check if an element is visible
 * @param {string} elementId - The testID of the element
 * @returns {Promise<boolean>} - Whether the element is visible
 */
async function isElementVisible(elementId) {
  try {
    await waitFor(element(by.id(elementId)))
      .toBeVisible()
      .withTimeout(1000);
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = {
  tapButton,
  enterText,
  clearText,
  toggleSwitch,
  scrollToElement,
  swipe,
  isElementVisible
}; 