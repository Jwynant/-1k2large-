// Primary colors with different intensities
export const primary = {
  100: '#E6F7FF', // Lightest
  200: '#BAE7FF',
  300: '#91D5FF',
  400: '#69C0FF',
  500: '#40A9FF', // Base blue/teal
  600: '#1890FF',
  700: '#096DD9', // Darker
  800: '#0050B3',
  900: '#003A8C', // Darkest
};

// Semantic colors for positive/negative meaning
export const semantic = {
  success: {
    light: '#D6FFE9',
    main: '#00C853',
    dark: '#00913C',
  },
  error: {
    light: '#FFECE8',
    main: '#FF3B30',
    dark: '#C62828',
  },
  warning: {
    light: '#FFF8E1',
    main: '#FFBB00',
    dark: '#F57C00',
  },
  info: {
    light: '#E4F3FF',
    main: '#2196F3',
    dark: '#0D47A1',
  }
};

// Neutral colors for backgrounds/text
export const neutral = {
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#F9FAFB',
    100: '#F2F4F7',
    200: '#E4E7EC',
    300: '#D0D5DD',
    400: '#98A2B3',
    500: '#667085',
    600: '#475467',
    700: '#344054',
    800: '#1D2939',
    900: '#101828',
  }
};

// Theme colors based on dark/light mode
export const getColors = (isDark: boolean) => ({
  background: {
    primary: isDark ? '#1C1C1E' : neutral.white,
    secondary: isDark ? '#2C2C2E' : neutral.gray[100],
    tertiary: isDark ? '#3A3A3C' : neutral.gray[200],
  },
  text: {
    primary: isDark ? neutral.white : neutral.gray[900],
    secondary: isDark ? neutral.gray[300] : neutral.gray[700],
    tertiary: isDark ? neutral.gray[400] : neutral.gray[500],
    inverse: isDark ? neutral.gray[900] : neutral.white,
  },
  border: {
    light: isDark ? 'rgba(255, 255, 255, 0.1)' : neutral.gray[200],
    medium: isDark ? 'rgba(255, 255, 255, 0.15)' : neutral.gray[300],
    strong: isDark ? 'rgba(255, 255, 255, 0.2)' : neutral.gray[400],
  },
  // Theme-specific overrides
  accent: primary[600],
  positive: semantic.success.main,
  negative: semantic.error.main,
  warning: semantic.warning.main,
  info: semantic.info.main,
});

export default getColors; 