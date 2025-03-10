import { renderHook } from '@testing-library/react-native';
import { useResponsiveLayout } from '../../app/hooks/useResponsiveLayout';

// We're using the global mock for react-native from jest.setup.js

describe('useResponsiveLayout', () => {
  it('returns layout values for portrait mode', () => {
    const { result } = renderHook(() => useResponsiveLayout());
    
    expect(result.current.isLandscape).toBe(false);
    expect(result.current.screenSize).toBe('medium');
    expect(typeof result.current.spacing).toBe('object');
    expect(typeof result.current.fontSizes).toBe('object');
  });

  it('calculates correct screen size based on width', () => {
    const { result } = renderHook(() => useResponsiveLayout());
    
    // Default mock width is 375, which should be 'medium'
    expect(result.current.screenSize).toBe('medium');
  });
}); 