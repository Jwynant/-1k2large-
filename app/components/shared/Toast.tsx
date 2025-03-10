import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onDismiss: () => void;
}

export default function Toast({
  visible,
  message,
  type = 'info',
  duration = 3000,
  onDismiss
}: ToastProps) {
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;
  
  // Get icon and color based on toast type
  const getToastConfig = (type: ToastType) => {
    switch (type) {
      case 'success':
        return { icon: 'checkmark-circle', color: '#34C759' };
      case 'error':
        return { icon: 'close-circle', color: '#FF3B30' };
      case 'warning':
        return { icon: 'warning', color: '#FF9500' };
      case 'info':
      default:
        return { icon: 'information-circle', color: '#0A84FF' };
    }
  };
  
  const { icon, color } = getToastConfig(type);
  
  useEffect(() => {
    let dismissTimer: NodeJS.Timeout;
    
    if (visible) {
      // Show toast
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Auto dismiss after duration
      dismissTimer = setTimeout(() => {
        handleDismiss();
      }, duration);
    }
    
    return () => {
      if (dismissTimer) clearTimeout(dismissTimer);
    };
  }, [visible, duration]);
  
  const handleDismiss = () => {
    // Hide toast
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -20,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  };
  
  if (!visible) return null;
  
  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          opacity, 
          transform: [{ translateY }],
          top: insets.top + 10
        }
      ]}
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive"
    >
      <View style={styles.content}>
        <Ionicons name={icon as any} size={24} color={color} style={styles.icon} />
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity 
          onPress={handleDismiss}
          accessible={true}
          accessibilityLabel="Dismiss"
          accessibilityHint="Dismisses the notification"
          testID="toast-dismiss-button"
        >
          <Ionicons name="close" size={24} color="#AEAEB2" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 9999,
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  icon: {
    marginRight: 12,
  },
  message: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
}); 