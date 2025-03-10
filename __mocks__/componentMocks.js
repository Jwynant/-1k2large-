const React = require('react');
const { View, Text } = require('react-native');

// Mock Card component
const Card = ({ children, title, testID }) => {
  return (
    <View testID={testID || 'card'} accessibilityLabel={`${title} card`}>
      <View testID="card-header">
        <Text>{title}</Text>
      </View>
      <View testID="card-content">
        {children}
      </View>
    </View>
  );
};

// Mock AddGoalButton component
const AddGoalButton = () => {
  return (
    <View testID="add-goal-button">
      <Text>Add Goal</Text>
    </View>
  );
};

module.exports = {
  Card,
  AddGoalButton,
}; 