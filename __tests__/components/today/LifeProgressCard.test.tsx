import React from 'react';
import { render } from '@testing-library/react-native';
import LifeProgressCard from '../../../app/components/today/LifeProgressCard';

// Mock dependencies
jest.mock('../../../app/context/AppContext', () => ({
  useAppContext: () => ({
    state: {
      userBirthDate: '1990-01-01',
      userSettings: {
        lifeExpectancy: 83,
      },
    },
  }),
}));

jest.mock('../../../app/context/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      text: '#FFFFFF',
      textSecondary: '#AEAEB2',
      border: 'rgba(255, 255, 255, 0.1)',
      warning: '#FF9500',
      card: '#2C2C2E',
      cardAlt: '#3A3A3C',
    },
  }),
}));

jest.mock('../../../app/hooks/useResponsiveLayout', () => ({
  useResponsiveLayout: () => ({
    spacing: { xs: 4, s: 8, m: 12, l: 16, xl: 24, xxl: 32 },
    fontSizes: { xs: 10, s: 12, m: 14, l: 16, xl: 20, xxl: 24 },
  }),
}));

// Mock Card component
jest.mock('../../../app/components/shared/Card', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ children, title }: { children: React.ReactNode; title: string }) => (
      <div data-testid="card" title={title}>
        {children}
      </div>
    ),
  };
});

describe('LifeProgressCard Component', () => {
  it('renders correctly with life progress percentage', () => {
    const { getByText } = render(
      <LifeProgressCard lifeProgressPercentage={42} />
    );

    expect(getByText('42%')).toBeTruthy();
    expect(getByText('of life lived (58% remaining)')).toBeTruthy();
  });

  it('displays time remaining information', () => {
    // Mock Date.now to return a fixed date for consistent testing
    const originalDate = global.Date;
    const mockDate = new Date(2025, 2, 10); // March 10, 2025
    
    // @ts-ignore - Mocking Date for testing purposes
    global.Date = class extends originalDate {
      constructor(date?: any) {
        super(date || mockDate);
      }
      static now() {
        return mockDate.getTime();
      }
    };

    const { getByText } = render(
      <LifeProgressCard lifeProgressPercentage={42} />
    );

    // Assuming the birth date is 1990-01-01 and life expectancy is 83
    // The person would be 35 years old in 2025, with about 48 years remaining
    expect(getByText(/You have approximately:/i)).toBeTruthy();
    expect(getByText(/years/i)).toBeTruthy();

    // Restore original Date
    global.Date = originalDate;
  });

  it('displays an encouraging message', () => {
    const { getByText } = render(
      <LifeProgressCard lifeProgressPercentage={42} />
    );

    // One of the encouraging messages should be present
    const messages = [
      "Your journey is just beginning. Dream big and build your foundation.",
      "You have decades ahead to create a meaningful impact on the world.",
      "There's still plenty of time to pursue your passions and achieve your goals.",
      "Make each day count. Your experience and wisdom are valuable gifts.",
      "Focus on what truly matters. Every moment is precious."
    ];

    const messageFound = messages.some(message => {
      try {
        return getByText(message);
      } catch (e) {
        return false;
      }
    });

    expect(messageFound).toBe(true);
  });
}); 