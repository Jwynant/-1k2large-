import { primary, semantic } from './colors';

// Define gradient configurations for use with LinearGradient
export const gradients = {
  primary: {
    colors: [primary[500], '#20BDFF'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Add a new blue-to-teal gradient for focus borders
  blueTeal: {
    colors: ['#0077FF', '#00E5FF'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  success: {
    colors: [semantic.success.main, '#39E881'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  error: {
    colors: [semantic.error.main, '#FF6E6E'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  warning: {
    colors: [semantic.warning.main, '#FFC107'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  info: {
    colors: [semantic.info.main, '#64B5F6'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
};

export default gradients; 