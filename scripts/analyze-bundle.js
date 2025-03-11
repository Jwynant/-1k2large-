#!/usr/bin/env node

/**
 * Bundle Size Analyzer Script
 * 
 * This script helps analyze the JavaScript bundle size of your Expo app
 * and provides recommendations for optimization.
 * 
 * Usage:
 * 1. Make sure you have expo-dev-client installed
 * 2. Run: node scripts/analyze-bundle.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

console.log(`${colors.bold}${colors.blue}📦 Expo Bundle Size Analyzer${colors.reset}\n`);

// Check if expo-dev-client is installed
try {
  console.log(`${colors.cyan}Checking for expo-dev-client...${colors.reset}`);
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  
  if (!packageJson.dependencies['expo-dev-client']) {
    console.log(`${colors.yellow}expo-dev-client is not installed. Installing now...${colors.reset}`);
    execSync('npx expo install expo-dev-client', { stdio: 'inherit' });
    console.log(`${colors.green}expo-dev-client installed successfully.${colors.reset}\n`);
  } else {
    console.log(`${colors.green}expo-dev-client is already installed.${colors.reset}\n`);
  }
} catch (error) {
  console.error(`${colors.red}Error checking for expo-dev-client: ${error.message}${colors.reset}`);
  process.exit(1);
}

// Create the bundle analysis directory if it doesn't exist
const analysisDir = path.join(__dirname, '../bundle-analysis');
if (!fs.existsSync(analysisDir)) {
  fs.mkdirSync(analysisDir, { recursive: true });
}

// Run the bundle analysis
console.log(`${colors.cyan}Analyzing bundle size...${colors.reset}`);
console.log(`${colors.yellow}This may take a few minutes. Please wait...${colors.reset}\n`);

try {
  // Build the app with bundle analysis enabled
  execSync('EXPO_BUNDLE_ANALYSIS=1 npx expo export --platform ios', { 
    stdio: 'inherit',
    env: { ...process.env, EXPO_BUNDLE_ANALYSIS: '1' }
  });
  
  console.log(`\n${colors.green}Bundle analysis complete!${colors.reset}\n`);
  
  // Check if the stats.json file was generated
  const statsFile = path.join(process.cwd(), 'dist', 'bundles', 'ios-index.js.stats.json');
  if (fs.existsSync(statsFile)) {
    // Copy the stats file to our analysis directory
    fs.copyFileSync(statsFile, path.join(analysisDir, 'stats.json'));
    console.log(`${colors.green}Stats file saved to bundle-analysis/stats.json${colors.reset}\n`);
  } else {
    console.log(`${colors.yellow}Stats file not found. Bundle analysis may not have completed properly.${colors.reset}\n`);
  }
  
  // Provide optimization recommendations
  console.log(`${colors.bold}${colors.blue}📋 Bundle Size Optimization Recommendations:${colors.reset}\n`);
  
  console.log(`${colors.bold}1. Icon Optimization:${colors.reset}`);
  console.log(`   ✅ You've implemented IconProvider for tree-shaking @expo/vector-icons`);
  console.log(`   - Continue replacing direct icon imports with IconProvider throughout the app\n`);
  
  console.log(`${colors.bold}2. Image Optimization:${colors.reset}`);
  console.log(`   - Use expo-image for better performance (already in use)`);
  console.log(`   - Compress images before importing them into your app`);
  console.log(`   - Consider using responsive image sizes based on device dimensions\n`);
  
  console.log(`${colors.bold}3. Code Splitting:${colors.reset}`);
  console.log(`   - Use dynamic imports for non-critical components`);
  console.log(`   - Lazy load screens that aren't immediately needed\n`);
  
  console.log(`${colors.bold}4. Library Optimization:${colors.reset}`);
  console.log(`   - Review large dependencies and consider alternatives`);
  console.log(`   - Import only the specific components you need from libraries`);
  console.log(`   - Check for duplicate dependencies\n`);
  
  console.log(`${colors.bold}5. Dead Code Elimination:${colors.reset}`);
  console.log(`   - Remove unused imports and components`);
  console.log(`   - Use the "import { x } from 'y'" syntax instead of "import y from 'y'"\n`);
  
  console.log(`${colors.bold}6. Performance Monitoring:${colors.reset}`);
  console.log(`   - Use Expo's performance monitoring tools`);
  console.log(`   - Regularly analyze bundle size as your app grows\n`);
  
  console.log(`${colors.bold}${colors.green}Next Steps:${colors.reset}`);
  console.log(`1. To visualize your bundle: npx webpack-bundle-analyzer bundle-analysis/stats.json`);
  console.log(`2. Focus on the largest modules first for the biggest impact`);
  console.log(`3. Run this script periodically to track improvements\n`);
  
} catch (error) {
  console.error(`${colors.red}Error analyzing bundle: ${error.message}${colors.reset}`);
  process.exit(1);
} 