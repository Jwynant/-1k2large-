const React = require('react');
const { View, Text } = require('react-native');

// Create a mock component for all icon sets
const createIconSetMock = () => {
  return ({ name, size, color, ...props }) => {
    return React.createElement(View, {
      ...props,
      testID: `icon-${name}`,
    }, React.createElement(Text, {}, `Icon:${name}`));
  };
};

// Mock all common icon sets
const iconSets = {
  AntDesign: createIconSetMock(),
  Entypo: createIconSetMock(),
  EvilIcons: createIconSetMock(),
  Feather: createIconSetMock(),
  FontAwesome: createIconSetMock(),
  FontAwesome5: createIconSetMock(),
  Fontisto: createIconSetMock(),
  Foundation: createIconSetMock(),
  Ionicons: createIconSetMock(),
  MaterialCommunityIcons: createIconSetMock(),
  MaterialIcons: createIconSetMock(),
  Octicons: createIconSetMock(),
  SimpleLineIcons: createIconSetMock(),
  Zocial: createIconSetMock(),
};

// Export all icon sets
module.exports = {
  ...iconSets,
  createIconSet: jest.fn(() => createIconSetMock()),
  createIconSetFromFontello: jest.fn(() => createIconSetMock()),
  createIconSetFromIcoMoon: jest.fn(() => createIconSetMock()),
}; 