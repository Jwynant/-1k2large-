const React = require('react');
const { View } = require('react-native');

// Mock LinearGradient component
const LinearGradient = ({ children, colors, style, ...props }) => {
  return React.createElement(
    View,
    {
      ...props,
      style,
      testID: 'linear-gradient',
      'data-colors': colors ? colors.join(',') : '',
    },
    children
  );
};

module.exports = {
  LinearGradient,
}; 