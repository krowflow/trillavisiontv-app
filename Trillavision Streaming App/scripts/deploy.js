/**
 * Deployment script for Trillavision T.V.
 * 
 * This script handles the build and deployment process for production.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// Configuration
const config = {
  // Build configuration
  build: {
    command: 'npm run build',
    outputDir: 'dist'
  },
  
  // Deployment configuration
  deploy: {
    method: 'local', // 'local', 's3', 'netlify', etc.
    destination: path.resolve(rootDir, 'deploy')
  },
  
  // Server configuration
  server: {
    startCommand: 'npm run server',
    port: 3000
  }
};

/**
 * Run a command and log the output
 * @param {string} command - Command to run
 * @param {string} cwd - Working directory
 */
const runCommand = (command, cwd = rootDir) => {
  console.log(`Running: ${command}`);
  try {
    execSync(command, { cwd, stdio: 'inherit' });
  } catch (error) {
    console.error(`Error running command: ${command}`);
    console.error(error);
    process.exit(1);
  }
};

/**
 * Build the application
 */
const buildApp = () => {
  console.log('Building application...');
  runCommand(config.build.command);
  console.log('Build complete.');
};

/**
 * Deploy the application
 */
const deployApp = () => {
  console.log('Deploying application...');
  
  const sourceDir = path.resolve(rootDir, config.build.outputDir);
  const destDir = config.deploy.destination;
  
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  // Copy build files to destination
  if (config.deploy.method === 'local') {
    console.log(`Copying files from ${sourceDir} to ${destDir}`);
    
    // Copy server files
    runCommand(`cp -r ${path.resolve(rootDir, 'server')} ${destDir}`);
    
    // Copy package.json and package-lock.json
    runCommand(`cp ${path.resolve(rootDir, 'package.json')} ${destDir}`);
    runCommand(`cp ${path.resolve(rootDir, 'package-lock.json')} ${destDir}`);
    
    // Copy .env.example
    runCommand(`cp ${path.resolve(rootDir, '.env.example')} ${destDir}/.env.example`);
    
    // Copy build files
    runCommand(`cp -r ${sourceDir}/* ${path.resolve(destDir, 'dist')}`);
    
    console.log('Files copied successfully.');
  } else {
    console.error(`Deployment method '${config.deploy.method}' not implemented.`);
    process.exit(1);
  }
  
  console.log('Deployment complete.');
};

/**
 * Start the server
 */
const startServer = () => {
  console.log('Starting server...');
  runCommand(config.server.startCommand, config.deploy.destination);
};

/**
 * Main function
 */
const main = () => {
  const args = process.argv.slice(2);
  
  if (args.includes('--build')) {
    buildApp();
  }
  
  if (args.includes('--deploy')) {
    deployApp();
  }
  
  if (args.includes('--start')) {
    startServer();
  }
  
  if (args.length === 0) {
    buildApp();
    deployApp();
    startServer();
  }
};

// Run the script
main();