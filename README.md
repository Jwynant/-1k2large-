# 1000 Months: Life Visualization & Intentionality Tool

A mobile application that helps users visualize their life timeline and live more intentionally by tracking memories, lessons, goals, and reflections.

## Project Overview

1000 Months represents an approximate 80-year lifespan (960 months), rounded up for memorability. This intentionally finite number helps users visualize and internalize the limited nature of time, encouraging thoughtful time allocation.

The app provides an intuitive visual timeline that integrates memories, lessons, and goals into a structured grid, helping users live with more intentionality.

## Key Features

- **Life Grid Visualization**: View your life as weeks, months, or years in an intuitive grid layout
- **Content Management**: Record memories, lessons, goals, and reflections
- **Timeline View**: Organize life into meaningful seasons and phases
- **Intentionality Tools**: Set priorities and track progress on goals

## Tech Stack

- **Framework**: React Native + Expo
- **State Management**: React Context API with useReducer
- **Data Storage**: AsyncStorage for local persistence
- **Navigation**: Expo Router
- **UI Components**: Custom components with React Native components
- **Testing**: Jest for unit tests, Detox for end-to-end testing

## Project Structure

```
app/
  ├── context/          # Global state management
  ├── hooks/            # Custom hooks
  ├── services/         # Service classes
  ├── (tabs)/           # Main app tabs
  ├── _layout.tsx       # Root layout
  └── onboarding.tsx    # Onboarding screen
components/
  ├── grid/             # Grid visualization components
  ├── settings/         # Settings components
  └── ui/               # Reusable UI components
assets/
  └── images/           # App images
e2e/                    # End-to-end tests
  ├── helpers/          # Test helper functions
  ├── tests/            # Test suites
  ├── setup.js          # Test setup
  └── jest.config.js    # Jest configuration for E2E tests
__tests__/              # Unit and integration tests
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- For E2E testing: iOS Simulator or Android Emulator

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/1000-months.git
   cd 1000-months
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

## Testing

### Unit and Integration Tests

Run unit and integration tests with Jest:

```
npm test
```

Run tests with coverage report:

```
npm run test:coverage
```

### End-to-End Tests

The app uses Detox for end-to-end testing. To run the tests:

1. Install Detox CLI globally:
   ```
   npm install -g detox-cli
   ```

2. Build the app for testing:
   ```
   npm run e2e:build:ios   # For iOS
   npm run e2e:build:android   # For Android
   ```

3. Run the tests:
   ```
   npm run e2e:test:ios   # For iOS
   npm run e2e:test:android   # For Android
   ```

For more information about the end-to-end testing setup, see the [E2E Testing README](e2e/README.md).

## Architecture

### State Management

The app uses React Context API with useReducer for global state management. The main state is defined in `app/context/AppContext.tsx` and includes:

- User information (birth date, age)
- Content data (memories, lessons, goals, reflections)
- UI state (view mode, selected items)

### Data Persistence

Data is persisted locally using AsyncStorage through the `StorageService` class. This provides:

- Automatic saving of content changes
- Loading data on app startup
- User preference persistence

### Custom Hooks

The app uses several custom hooks to encapsulate business logic:

- `useGridNavigation`: Handles grid navigation and selection
- `useContentManagement`: Manages content creation and retrieval
- `useDateCalculations`: Provides date-related utilities

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Workflow

1. Create a feature branch from `main`
2. Make your changes
3. Add or update tests as needed
4. Ensure all tests pass
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by the concept of visualizing life in weeks/months
- Built with React Native and Expo