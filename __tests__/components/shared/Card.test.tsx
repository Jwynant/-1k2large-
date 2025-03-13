import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import Card from '../../../app/components/shared/Card';
import { ThemeProvider } from '../../../app/context/ThemeContext';

// Mock the hooks
jest.mock('../../../app/hooks/useResponsiveLayout', () => ({
  __esModule: true,
  default: () => ({
    spacing: { xs: 4, s: 8, m: 12, l: 16, xl: 24, xxl: 32 },
    fontSizes: { xs: 10, s: 12, m: 14, l: 16, xl: 20, xxl: 24 },
  }),
  useResponsiveLayout: () => ({
    spacing: { xs: 4, s: 8, m: 12, l: 16, xl: 24, xxl: 32 },
    fontSizes: { xs: 10, s: 12, m: 14, l: 16, xl: 20, xxl: 24 },
  }),
}));

// Mock the ThemeContext
jest.mock('../../../app/context/ThemeContext', () => ({
  __esModule: true,
  useTheme: () => ({
    colors: {
      card: '#2C2C2E',
      text: '#FFFFFF',
      border: 'rgba(255, 255, 255, 0.1)',
    },
    isDark: true,
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('Card Component', () => {
  it('renders correctly with required props', () => {
    const { getByText, getByTestId } = render(
      <Card
        title="Test Card"
        iconName="star"
        iconColor="#FF9500"
        testID="test-card"
      >
        <Text>Card Content</Text>
      </Card>
    );

    expect(getByText('Test Card')).toBeTruthy();
    expect(getByText('Card Content')).toBeTruthy();
    expect(getByTestId('test-card')).toBeTruthy();
  });

  it('calls onHeaderPress when header is pressed', () => {
    const onHeaderPress = jest.fn();
    const { getByText } = render(
      <Card
        title="Test Card"
        iconName="star"
        iconColor="#FF9500"
        onHeaderPress={onHeaderPress}
      >
        <Text>Card Content</Text>
      </Card>
    );

    fireEvent.press(getByText('Test Card').parent);
    expect(onHeaderPress).toHaveBeenCalledTimes(1);
  });

  it('renders right header content when provided', () => {
    const rightHeaderContent = <Text>Right Header</Text>;
    const { getByText } = render(
      <Card
        title="Test Card"
        iconName="star"
        iconColor="#FF9500"
        rightHeaderContent={rightHeaderContent}
      >
        <Text>Card Content</Text>
      </Card>
    );

    expect(getByText('Right Header')).toBeTruthy();
  });

  it('has correct accessibility properties', () => {
    const { getByLabelText } = render(
      <Card
        title="Test Card"
        iconName="star"
        iconColor="#FF9500"
      >
        <Text>Card Content</Text>
      </Card>
    );

    expect(getByLabelText('Test Card card')).toBeTruthy();
    expect(getByLabelText('Test Card header')).toBeTruthy();
    expect(getByLabelText('Test Card content')).toBeTruthy();
  });
}); 