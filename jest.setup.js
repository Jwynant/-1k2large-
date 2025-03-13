// Mock modules that cause issues in the test environment
jest.mock('expo-font');
jest.mock('@expo/vector-icons');
jest.mock('expo-linear-gradient');
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock NetInfo for NetworkContext tests
jest.mock('@react-native-community/netinfo');

// Mock AsyncStorage for tests
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve(null)),
}));

// Mock react-native modules
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  
  // Mock Settings
  RN.Settings = {
    get: jest.fn(),
    set: jest.fn(),
    watchKeys: jest.fn(),
    clearWatch: jest.fn(),
  };
  
  // Mock useColorScheme
  RN.useColorScheme = jest.fn().mockReturnValue('light');
  
  // Mock useWindowDimensions
  RN.useWindowDimensions = jest.fn().mockReturnValue({
    width: 375,
    height: 812,
    scale: 2,
    fontScale: 1,
  });
  
  return RN;
});

// Mock Haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
}));

// Mock router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: jest.fn().mockReturnValue({}),
  Link: 'Link',
})); 