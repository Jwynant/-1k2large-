// Base spacing unit
const baseSpacing = 4;

// Spacing scale
export const spacing = {
  xs: baseSpacing, // 4
  sm: baseSpacing * 2, // 8
  md: baseSpacing * 4, // 16
  lg: baseSpacing * 6, // 24
  xl: baseSpacing * 8, // 32
  xxl: baseSpacing * 12, // 48
  
  // Common paddings
  screenPadding: baseSpacing * 4, // 16
  sectionPadding: baseSpacing * 6, // 24
  cardPadding: baseSpacing * 4, // 16
  
  // Common margins
  itemSpacing: baseSpacing * 3, // 12
  sectionSpacing: baseSpacing * 8, // 32
  
  // Convert any number to multiple of base spacing
  scale: (n: number) => baseSpacing * n,
};

export default spacing; 