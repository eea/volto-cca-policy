/**
 * Generic Jest configuration for Volto addons
 *
 * This configuration automatically:
 * - Detects the addon name from the config file path
 * - Configures test coverage to focus on the specific test path
 * - Handles different ways of specifying test paths:
 *   - Full paths like src/addons/addon-name/src/components
 *   - Just filenames like Component.test.jsx
 *   - Just directory names like components
 *
 * Usage:
 * RAZZLE_JEST_CONFIG=src/addons/addon-name/jest-addon.config.js CI=true yarn test [test-path] --collectCoverage
 */

require('dotenv').config({ path: __dirname + '/.env' });

const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// Get the addon name from the current file path
const currentFilePath = __filename;
const addonMatch = currentFilePath.match(/src\/addons\/([^/]+)/);
const addonName = addonMatch ? addonMatch[1] : 'volto-cca-policy';
const addonBasePath = `src/addons/${addonName}/src`;

/**
 * Find files or directories in the addon using the find command
 * @param {string} name - The name to search for
 * @param {string} type - The type of item to find ('f' for files, 'd' for directories)
 * @param {string} [additionalOptions=''] - Additional options for the find command
 * @returns {string|null} - The path of the found item or null if not found
 */
const findInAddon = (name, type, additionalOptions = '') => {
  try {
    const cmd = `find ${addonBasePath} -type ${type} ${additionalOptions} -name "${name}"`;
    const result = execSync(cmd).toString().trim();

    if (result) {
      // If multiple items found, use the first one
      return result.split('\n')[0];
    }
  } catch (error) {
    // Ignore errors from find command
  }
  return null;
};

/**
 * Get the test path from command line arguments
 * @returns {string|null} - The resolved test path or null if not found
 */
const getTestPath = () => {
  const args = process.argv;
  let testPath = null;

  // 1. Look for paths that include the addon name
  testPath = args.find(
    (arg) =>
      arg.includes(addonName) &&
      !arg.startsWith('--') &&
      arg !== 'test' &&
      arg !== 'node',
  );

  // 2. If not found, look for the argument after 'test'
  if (!testPath) {
    const testIndex = args.findIndex((arg) => arg === 'test');
    if (testIndex !== -1 && testIndex < args.length - 1) {
      const nextArg = args[testIndex + 1];
      if (!nextArg.startsWith('--')) {
        testPath = nextArg;
      }
    }
  }

  // 3. If still not found, look for any test file
  if (!testPath) {
    testPath = args.find(
      (arg) =>
        arg.endsWith('.test.js') ||
        arg.endsWith('.test.jsx') ||
        arg.endsWith('.test.ts') ||
        arg.endsWith('.test.tsx'),
    );
  }

  if (!testPath) {
    return null;
  }

  // Handle the case where only the filename or directory name is provided (no path separators)
  if (!testPath.includes('/')) {
    // Check if it's a test file
    if (
      testPath.endsWith('.test.js') ||
      testPath.endsWith('.test.jsx') ||
      testPath.endsWith('.test.ts') ||
      testPath.endsWith('.test.tsx')
    ) {
      const foundTestFile = findInAddon(testPath, 'f');
      if (foundTestFile) {
        return foundTestFile;
      }
    }
    // Check if it's a directory name
    else {
      // Try exact directory name match
      const foundDir = findInAddon(testPath, 'd');
      if (foundDir) {
        return foundDir;
      }

      // Try flexible directory path match
      const flexibleDir = findInAddon(testPath, 'd', `-path "*${testPath}*"`);
      if (flexibleDir) {
        return flexibleDir;
      }
    }
  }

  // If the path doesn't start with the addon base path and isn't absolute,
  // prepend the addon base path
  if (
    !testPath.startsWith(`src/addons/${addonName}/src`) &&
    !testPath.startsWith('/')
  ) {
    testPath = `${addonBasePath}/${testPath}`;
  }

  // Verify the path exists
  if (fs.existsSync(testPath)) {
    return testPath;
  }

  return testPath;
};

/**
 * Find the implementation file for a test file
 * @param {string} testPath - Path to the test file
 * @returns {string|null} - Path to the implementation file or null if not found
 */
const findImplementationFile = (testPath) => {
  // If the test path doesn't exist, return null
  if (!fs.existsSync(testPath)) {
    return null;
  }

  // Get the directory and filename
  const dirPath = path.dirname(testPath);
  const fileName = path.basename(testPath);

  // Skip if it's not a test file
  if (!fileName.includes('.test.')) {
    return null;
  }

  // Get the base name without extension and without .test
  const baseFileName = path
    .basename(fileName, path.extname(fileName))
    .replace('.test', '');

  // Try to find the implementation file
  const dirFiles = fs.readdirSync(dirPath);

  // First, try exact match (e.g., PreviewImage.test.js -> PreviewImage.js)
  const exactMatch = dirFiles.find((file) => {
    const fileBaseName = path.basename(file, path.extname(file));
    return (
      fileBaseName === baseFileName &&
      !file.includes('.test.') &&
      !file.includes('.spec.')
    );
  });

  if (exactMatch) {
    return `${dirPath}/${exactMatch}`;
  }

  // Try to find a file with a similar name
  const similarMatch = dirFiles.find((file) => {
    // Skip test files and directories
    if (
      file.includes('.test.') ||
      file.includes('.spec.') ||
      fs.statSync(`${dirPath}/${file}`).isDirectory()
    ) {
      return false;
    }

    // Get the base name without extension
    const fileBaseName = path.basename(file, path.extname(file));

    // Check if the file name is similar to our test file name
    return (
      fileBaseName.toLowerCase().includes(baseFileName.toLowerCase()) ||
      baseFileName.toLowerCase().includes(fileBaseName.toLowerCase())
    );
  });

  if (similarMatch) {
    return `${dirPath}/${similarMatch}`;
  }

  return null;
};

/**
 * Determine collectCoverageFrom patterns based on test path
 * @returns {string[]} - Array of coverage patterns
 */
const getCoveragePatterns = () => {
  // Default exclude patterns
  const excludePatterns = [
    '!src/**/*.d.ts',
    '!**/*.test.{js,jsx,ts,tsx}',
    '!**/*.spec.{js,jsx,ts,tsx}',
  ];

  // Default pattern for the whole addon
  const defaultPatterns = [
    `${addonBasePath}/**/*.{js,jsx,ts,tsx}`,
    ...excludePatterns,
  ];

  // First check for directory arguments without path separators
  const directoryArg = process.argv.find(
    (arg) =>
      !arg.includes('/') &&
      !arg.startsWith('--') &&
      arg !== 'test' &&
      arg !== 'node' &&
      !arg.endsWith('.js') &&
      !arg.endsWith('.jsx') &&
      !arg.endsWith('.ts') &&
      !arg.endsWith('.tsx') &&
      // Exclude common arguments that aren't directory names
      !['yarn', 'npm', 'npx', 'collectCoverage', 'watch'].includes(arg),
  );

  if (directoryArg) {
    // Try to find the directory in the addon
    const foundDir = findInAddon(directoryArg, 'd');
    if (foundDir) {
      return [`${foundDir}/**/*.{js,jsx,ts,tsx}`, ...excludePatterns];
    }
  }

  // If no directory arg or directory not found, use the test path
  const testPath = getTestPath();
  if (!testPath) {
    return defaultPatterns;
  }

  // Check if the test path is a file or directory
  try {
    const stats = fs.statSync(testPath);

    if (stats.isFile()) {
      // If it's a specific test file, find the corresponding implementation file
      const implFile = findImplementationFile(testPath);

      if (implFile) {
        return [implFile, '!src/**/*.d.ts'];
      }

      // If we couldn't find a specific implementation file, use the directory
      const dirPath = path.dirname(testPath);
      return [`${dirPath}/**/*.{js,jsx,ts,tsx}`, ...excludePatterns];
    } else if (stats.isDirectory()) {
      // If it's a directory, include ONLY files in that directory and its subdirectories
      return [`${testPath}/**/*.{js,jsx,ts,tsx}`, ...excludePatterns];
    }
  } catch (error) {
    // If there's an error (e.g., path doesn't exist), use default
  }

  return defaultPatterns;
};

// Get the coverage configuration
const coverageConfig = getCoveragePatterns();

module.exports = {
  testMatch: ['**/src/addons/**/?(*.)+(spec|test).[jt]s?(x)'],
  collectCoverageFrom: coverageConfig,
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'schema\\.[jt]s?$',
    'index\\.[jt]s?$',
    'config\\.[jt]sx?$',
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '@plone/volto/cypress': '<rootDir>/node_modules/@plone/volto/cypress',
    '@plone/volto/babel': '<rootDir>/node_modules/@plone/volto/babel',
    '@plone/volto/(.*)$': '<rootDir>/node_modules/@plone/volto/src/$1',
    '@package/(.*)$': '<rootDir>/node_modules/@plone/volto/src/$1',
    '@root/(.*)$': '<rootDir>/node_modules/@plone/volto/src/$1',
    '@plone/volto-quanta/(.*)$': '<rootDir>/src/addons/volto-quanta/src/$1',
    '@eeacms/search/(.*)$': '<rootDir>/src/addons/volto-searchlib/searchlib/$1',
    '@eeacms/search': '<rootDir>/src/addons/volto-searchlib/searchlib',
    '@eeacms/(.*?)/(.*)$': '<rootDir>/node_modules/@eeacms/$1/src/$2',
    '@plone/volto-slate$':
      '<rootDir>/node_modules/@plone/volto/packages/volto-slate/src',
    '@plone/volto-slate/(.*)$':
      '<rootDir>/node_modules/@plone/volto/packages/volto-slate/src/$1',
    '~/(.*)$': '<rootDir>/src/$1',
    'load-volto-addons':
      '<rootDir>/node_modules/@plone/volto/jest-addons-loader.js',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@plone|@root|@package|@eeacms)/).*/',
  ],
  transform: {
    '^.+\\.js(x)?$': 'babel-jest',
    '^.+\\.ts(x)?$': 'babel-jest',
    '^.+\\.(png)$': 'jest-file',
    '^.+\\.(jpg)$': 'jest-file',
    '^.+\\.(svg)$': './node_modules/@plone/volto/jest-svgsystem-transform.js',
  },
  coverageThreshold: {
    global: {
      branches: 5,
      functions: 5,
      lines: 5,
      statements: 5,
    },
  },
  ...(process.env.JEST_USE_SETUP === 'ON' && {
    setupFilesAfterEnv: [
      `<rootDir>/node_modules/@eeacms/${addonName}/jest.setup.js`,
    ],
  }),
};
