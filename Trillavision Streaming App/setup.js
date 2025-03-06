import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectPath = 'C:\\Projects\\trillavision_tv_streaming';

/**
 * Setup script for Trillavision TV Streaming project
 * This script will:
 * 1. Create the project directory structure
 * 2. Copy all necessary files from the current directory
 * 3. Install dependencies
 * 4. Initialize git repository
 */
async function setupProject() {
  try {
    console.log('🚀 Setting up Trillavision TV Streaming project...');
    
    // Create project directory if it doesn't exist
    await fs.mkdir(projectPath, { recursive: true });
    console.log(`✅ Created project directory: ${projectPath}`);
    
    // Create directory structure
    const directories = [
      'src',
      'src/components',
      'src/components/audio',
      'src/components/audio/processors',
      'src/components/auth',
      'src/components/brand',
      'src/components/layout',
      'src/components/stream',
      'src/components/ui',
      'src/hooks',
      'src/pages',
      'src/services',
      'src/store',
      'src/store/slices',
      'src/types',
      'src/utils',
      'public',
      'public/assets',
      'server',
      'server/routes',
      'server/temp',
      'docs'
    ];
    
    for (const dir of directories) {
      await fs.mkdir(path.join(projectPath, dir), { recursive: true });
    }
    console.log('✅ Created directory structure');
    
    // Copy all files from current directory to project directory
    const sourceFiles = await getAllFiles(__dirname);
    for (const file of sourceFiles) {
      const relativePath = path.relative(__dirname, file);
      const targetPath = path.join(projectPath, relativePath);
      
      // Create parent directory if it doesn't exist
      await fs.mkdir(path.dirname(targetPath), { recursive: true });
      
      // Copy file
      await fs.copyFile(file, targetPath);
    }
    console.log('✅ Copied all project files');
    
    // Initialize git repository
    try {
      execSync('git init', { cwd: projectPath });
      console.log('✅ Initialized git repository');
    } catch (error) {
      console.warn('⚠️ Could not initialize git repository. Make sure git is installed.');
    }
    
    // Install dependencies
    try {
      console.log('📦 Installing dependencies (this may take a few minutes)...');
      execSync('npm install', { cwd: projectPath, stdio: 'inherit' });
      console.log('✅ Installed dependencies');
    } catch (error) {
      console.error('❌ Failed to install dependencies:', error.message);
      console.log('Please run "npm install" manually in the project directory.');
    }
    
    console.log(`
🎉 Trillavision TV Streaming project setup complete!

To start the development server:
1. Navigate to the project directory: cd ${projectPath}
2. Run the development server: npm run dev

Happy coding! 🚀
    `);
  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

/**
 * Get all files in a directory recursively
 * @param {string} dir - Directory to scan
 * @returns {Promise<string[]>} - Array of file paths
 */
async function getAllFiles(dir) {
  const files = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Skip node_modules and .git directories
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist') {
        continue;
      }
      
      const subFiles = await getAllFiles(fullPath);
      files.push(...subFiles);
    } else {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Run setup
setupProject();