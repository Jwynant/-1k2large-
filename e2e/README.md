# End-to-End Testing with Detox

This directory contains end-to-end tests for the app using Detox.

## Setup

1. Make sure you have all the required dependencies installed:
   - For iOS: Xcode and Command Line Tools
   - For Android: Android SDK, platform tools, and emulator

2. Install the Detox CLI globally:
   ```bash
   npm install -g detox-cli
   ```

3. Install project dependencies:
   ```bash
   npm install
   ```

## Running Tests

### iOS

1. Build the app for testing:
   ```bash
   npm run e2e:build:ios
   ```

2. Run the tests:
   ```bash
   npm run e2e:test:ios
   ```

### Android

1. Make sure you have an Android emulator running or connected device

2. Build the app for testing:
   ```bash
   npm run e2e:build:android
   ```

3. Run the tests:
   ```bash
   npm run e2e:test:android
   ```

## Test Structure

- `e2e/tests/` - Contains all the test files
- `e2e/helpers/` - Contains helper functions for tests
- `e2e/setup.js` - Global setup for all tests

## Writing Tests

Tests are written using Jest and Detox. Here's a basic example:

```javascript
describe('Feature', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should do something', async () => {
    await element(by.id('some-element')).tap();
    await expect(element(by.text('Expected Result'))).toBeVisible();
  });
});
```

## Best Practices

1. Add testID props to components for reliable element selection:
   ```jsx
   <Button testID="submit-button" title="Submit" onPress={handleSubmit} />
   ```

2. Use the `by.id()` matcher whenever possible instead of `by.text()` for more reliable tests.

3. Keep tests independent of each other.

4. Use `beforeAll` and `beforeEach` for setup, and `afterAll` and `afterEach` for cleanup.

5. For flaky tests, use `waitFor` with appropriate timeouts.

## Troubleshooting

- If tests are failing, check that the app is properly built for testing.
- Make sure the simulator/emulator is running and properly configured.
- Check that testIDs are correctly set on components.
- For iOS, ensure that the correct simulator is specified in `.detoxrc.js`.
- For Android, ensure that the correct emulator is running and specified in `.detoxrc.js`. 