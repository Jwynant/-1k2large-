import React from 'react';
import { Pressable, Text, View, ActivityIndicator, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  onPress: () => void;
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  gradientColors?: [string, string]; // Must provide two colors for gradient
}

/**
 * Button component with various styles and options
 */
export const Button: React.FC<ButtonProps> = ({
  onPress,
  label,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  labelStyle,
  gradientColors,
}) => {
  const theme = useTheme();
  
  // Size variations
  const sizeStyles = {
    small: {
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borders.radius.sm,
      fontSize: theme.typography.sizes.xs,
    },
    medium: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borders.radius.md,
      fontSize: theme.typography.sizes.sm,
    },
    large: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.xl,
      borderRadius: theme.borders.radius.lg,
      fontSize: theme.typography.sizes.md,
    },
  };
  
  // Default colors based on variant
  const getColors = (): [string, string] => {
    // If custom gradient colors are provided, use them
    if (gradientColors && gradientColors.length === 2) {
      return gradientColors;
    }
    
    // Otherwise use theme gradient colors
    return theme.gradients.primary.colors as [string, string];
  };
  
  // Get button styles based on variant
  const getButtonStyles = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        // Gradient style handled by LinearGradient
        return {};
      case 'secondary':
        return {
          backgroundColor: theme.colors.background.secondary,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.border.medium,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
        };
      default:
        return {};
    }
  };
  
  // Get text styles based on variant
  const getLabelStyles = (): TextStyle => {
    switch (variant) {
      case 'primary':
        return {
          color: theme.colors.text.inverse,
          fontWeight: theme.typography.weights.semibold,
        };
      case 'secondary':
        return {
          color: theme.colors.text.primary,
          fontWeight: theme.typography.weights.medium,
        };
      case 'outline':
      case 'ghost':
        return {
          color: theme.colors.accent,
          fontWeight: theme.typography.weights.medium,
        };
      default:
        return {};
    }
  };
  
  // Combined styles
  const containerStyle = [
    styles.button,
    {
      ...sizeStyles[size],
      opacity: disabled ? 0.6 : 1,
    },
    getButtonStyles(),
    style,
  ];
  
  const textStyle = [
    styles.text,
    { fontSize: sizeStyles[size].fontSize },
    getLabelStyles(),
    labelStyle,
  ];
  
  // Render button with or without gradient
  const renderButton = () => {
    const buttonContent = (
      <>
        {isLoading ? (
          <ActivityIndicator 
            size="small" 
            color={variant === 'primary' ? theme.colors.text.inverse : theme.colors.accent} 
          />
        ) : (
          <>
            {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
            <Text style={textStyle}>{label}</Text>
            {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
          </>
        )}
      </>
    );
    
    // Use LinearGradient for primary variant
    if (variant === 'primary' && !disabled) {
      return (
        <Pressable 
          onPress={!disabled && !isLoading ? onPress : undefined}
          style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
          disabled={disabled || isLoading}
        >
          <LinearGradient
            colors={getColors()}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={containerStyle}
          >
            {buttonContent}
          </LinearGradient>
        </Pressable>
      );
    }
    
    // Regular button for other variants
    return (
      <Pressable 
        onPress={!disabled && !isLoading ? onPress : undefined}
        style={({ pressed }) => [
          containerStyle,
          { opacity: pressed ? 0.8 : 1 },
        ]}
        disabled={disabled || isLoading}
      >
        {buttonContent}
      </Pressable>
    );
  };
  
  return renderButton();
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
  },
  icon: {
    marginHorizontal: 8,
  },
});

export default Button; 