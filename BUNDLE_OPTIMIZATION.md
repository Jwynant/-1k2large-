# Bundle Size Optimization Guide

This guide provides strategies to optimize your Expo/React Native app's bundle size for better performance and faster loading times.

## Table of Contents

1. [Analyzing Bundle Size](#analyzing-bundle-size)
2. [Icon Optimization](#icon-optimization)
3. [Image Optimization](#image-optimization)
4. [Code Splitting](#code-splitting)
5. [Library Optimization](#library-optimization)
6. [Dead Code Elimination](#dead-code-elimination)
7. [Performance Monitoring](#performance-monitoring)

## Analyzing Bundle Size

We've created a script to help analyze your bundle size:

```bash
# Make the script executable (if not already)
chmod +x scripts/analyze-bundle.js

# Run the analysis
node scripts/analyze-bundle.js
```

This will generate a stats file in the `bundle-analysis` directory that you can visualize with:

```bash
npx webpack-bundle-analyzer bundle-analysis/stats.json
```

## Icon Optimization

### Using IconProvider

We've implemented an `IconProvider` component to optimize icon imports. Instead of importing icons directly from `@expo/vector-icons`, use our `IconProvider`:

```jsx
// ❌ Don't do this
import { Ionicons } from '@expo/vector-icons';

// ✅ Do this instead
import { useIcons } from '../components/shared/IconProvider';

function MyComponent() {
  const { Icon } = useIcons();
  
  return <Icon name="heart" size={24} color="red" />;
}
```

### Benefits

- Tree-shaking: Only the icons you actually use will be included in the bundle
- Centralized management: Easier to update or change icon libraries
- Consistent styling: Apply consistent icon styles across your app

## Image Optimization

### Best Practices

1. **Use expo-image**: It provides better performance than the standard Image component
   ```jsx
   import { Image } from 'expo-image';
   ```

2. **Compress images**: Use tools like [TinyPNG](https://tinypng.com/) or [ImageOptim](https://imageoptim.com/)

3. **Use responsive images**: Provide different sizes based on device dimensions
   ```jsx
   import { useWindowDimensions } from 'react-native';
   
   function ResponsiveImage() {
     const { width } = useWindowDimensions();
     const imageSize = width < 600 ? 'small' : 'large';
     
     return <Image source={images[imageSize]} />;
   }
   ```

4. **Use blurhash for placeholders**: Improves perceived loading time
   ```jsx
   <Image
     source={uri}
     placeholder={blurhash}
     contentFit="cover"
     transition={300}
   />
   ```

## Code Splitting

### Lazy Loading

Use dynamic imports to load components only when needed:

```jsx
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function MyComponent() {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### Route-Based Splitting

With Expo Router, you can take advantage of automatic code splitting:

```jsx
// app/(tabs)/_layout.jsx
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
```

## Library Optimization

### Strategies

1. **Import specific components**: 
   ```jsx
   // ❌ Don't do this
   import Library from 'big-library';
   
   // ✅ Do this instead
   import { SpecificComponent } from 'big-library';
   ```

2. **Consider smaller alternatives**:
   - Moment.js → date-fns
   - Lodash → use native methods or import specific functions

3. **Check for duplicate dependencies**:
   ```bash
   npx depcheck
   ```

## Dead Code Elimination

### Finding Unused Code

1. **ESLint unused imports plugin**:
   ```bash
   npm install -D eslint-plugin-unused-imports
   ```

2. **Manual review**:
   - Look for commented-out code
   - Check for unused components
   - Review test files that might be included in production

### Tree-Shaking

Ensure your imports are compatible with tree-shaking:

```jsx
// ❌ Don't do this (imports everything)
import _ from 'lodash';

// ✅ Do this instead (only imports what you need)
import { debounce } from 'lodash/debounce';
```

## Performance Monitoring

### Tools

1. **Expo Dev Tools**:
   ```bash
   npx expo start --dev-client
   ```

2. **React DevTools**:
   ```bash
   npm install -g react-devtools
   react-devtools
   ```

3. **Regular bundle analysis**:
   Run the bundle analysis script regularly to track improvements.

## Conclusion

Bundle size optimization is an ongoing process. Start with the largest modules first for the biggest impact, and regularly analyze your bundle as your app grows.

For more detailed information, refer to:
- [Expo's Performance Documentation](https://docs.expo.dev/guides/performance/)
- [React Native Performance Guide](https://reactnative.dev/docs/performance) 