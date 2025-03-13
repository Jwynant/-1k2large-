import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNetwork } from '../../context/NetworkContext';
import { useTheme } from '../../context/ThemeContext';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';

export default function NetworkStatus() {
  const { isConnected, isInternetReachable, queueSize, processQueue } = useNetwork();
  const { colors } = useTheme();
  const { spacing, fontSizes } = useResponsiveLayout();
  const insets = useSafeAreaInsets();
  
  // Animation values
  const translateY = useRef(new Animated.Value(-50)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  
  // Show/hide the network status based on connection state
  useEffect(() => {
    if (!isConnected || (isInternetReachable === false)) {
      // Show the network status
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Hide the network status
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -50,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isConnected, isInternetReachable]);
  
  // If connected and internet is reachable, don't render
  if (isConnected && isInternetReachable !== false) {
    return null;
  }
  
  // Get status text and color
  const getStatusInfo = () => {
    if (!isConnected) {
      return {
        text: 'You are offline',
        color: colors.error,
        icon: 'cloud-offline',
      };
    }
    
    if (isInternetReachable === false) {
      return {
        text: 'No internet connection',
        color: colors.warning,
        icon: 'warning',
      };
    }
    
    return {
      text: 'Connected',
      color: colors.success,
      icon: 'checkmark-circle',
    };
  };
  
  const { text, color, icon } = getStatusInfo();
  
  return (
    <Animated.View 
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderBottomColor: color,
          paddingTop: insets.top,
          transform: [{ translateY }],
          opacity,
        }
      ]}
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive"
    >
      <View style={styles.content}>
        <View style={styles.statusContainer}>
          <Ionicons name={icon as any} size={fontSizes.l} color={color} style={styles.icon} />
          <Text 
            style={[
              styles.statusText,
              { 
                color: colors.text,
                fontSize: fontSizes.m,
              }
            ]}
          >
            {text}
          </Text>
        </View>
        
        {queueSize > 0 && (
          <TouchableOpacity 
            style={[
              styles.syncButton,
              {
                backgroundColor: `${colors.primary}20`,
                borderRadius: spacing.xs,
                paddingVertical: spacing.xs,
                paddingHorizontal: spacing.s,
              }
            ]}
            onPress={processQueue}
            disabled={!isConnected || isInternetReachable === false}
          >
            <Text 
              style={[
                styles.syncText,
                {
                  color: isConnected && isInternetReachable !== false ? colors.primary : colors.textSecondary,
                  fontSize: fontSizes.s,
                }
              ]}
            >
              Sync ({queueSize})
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    borderBottomWidth: 2,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  statusText: {
    fontWeight: '500',
  },
  syncButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncText: {
    fontWeight: '500',
  },
}); 