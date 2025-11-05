// Expo monorepo Metro config to allow imports from workspace packages
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// 1. Watch the monorepo root so Metro can pick up changes in shared
config.watchFolders = [workspaceRoot];

// 2. Resolve modules from the app's node_modules first, then the workspace root
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 3. Avoid Metro walking up directories in odd ways; rely on paths above
config.resolver.disableHierarchicalLookup = true;

module.exports = config;