import React from 'react';
import { render } from '@testing-library/react-native';
import TodayHeader from '../../../app/components/today/TodayHeader';
import { format } from 'date-fns';

// Mock dependencies
jest.mock('../../../app/context/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      text: '#FFFFFF',
      textSecondary: '#AEAEB2',
      border: 'rgba(255, 255, 255, 0.1)',
      primary: '#0A84FF',
    },
    isDark: true,
  }),
}));

jest.mock('../../../app/hooks/useResponsiveLayout', () => ({
  useResponsiveLayout: () => ({
    spacing: { xs: 4, s: 8, m: 12, l: 16, xl: 24, xxl: 32 },
    fontSizes: { xs: 10, s: 12, m: 14, l: 16, xl: 20, xxl: 24 },
    isLandscape: false,
  }),
}));

// Mock date-fns format function
jest.mock('date-fns', () => ({
  format: jest.fn((date, formatString) => {
    if (formatString === 'MMMM d, yyyy') return 'March 10, 2025';
    if (formatString === 'EEEE') return 'Monday';
    return '';
  }),
}));

describe('TodayHeader Component', () => {
  it('renders correctly with preciseAge', () => {
    const { getByText } = render(
      <TodayHeader preciseAge="30 Years, 5 Months, 2 Weeks, 3 Days" />
    );

    expect(getByText('Monday')).toBeTruthy();
    expect(getByText('March 10, 2025')).toBeTruthy();
    expect(getByText('30 Years, 5 Months, 2 Weeks, 3 Days')).toBeTruthy();
  });

  it('renders correctly in portrait mode', () => {
    const { getByText, queryByTestId } = render(
      <TodayHeader preciseAge="30 Years, 5 Months, 2 Weeks, 3 Days" />
    );

    // In portrait mode, we should see the age divider
    expect(getByText('30 Years, 5 Months, 2 Weeks, 3 Days')).toBeTruthy();
  });

  it('renders correctly in landscape mode', () => {
    // Override the mock to return landscape mode
    jest.mock('../../../app/hooks/useResponsiveLayout', () => ({
      useResponsiveLayout: () => ({
        spacing: { xs: 4, s: 8, m: 12, l: 16, xl: 24, xxl: 32 },
        fontSizes: { xs: 10, s: 12, m: 14, l: 16, xl: 20, xxl: 24 },
        isLandscape: true,
      }),
    }));

    const { getByText } = render(
      <TodayHeader preciseAge="30 Years, 5 Months, 2 Weeks, 3 Days" />
    );

    expect(getByText('Monday')).toBeTruthy();
    expect(getByText('March 10, 2025')).toBeTruthy();
    expect(getByText('30 Years, 5 Months, 2 Weeks, 3 Days')).toBeTruthy();
  });
}); 