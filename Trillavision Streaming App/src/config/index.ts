import developmentConfig from './development';
import productionConfig from './production';

/**
 * Get the appropriate configuration based on the environment
 */
const getConfig = () => {
  const env = import.meta.env.MODE || 'development';
  
  switch (env) {
    case 'production':
      return productionConfig;
    case 'development':
    default:
      return developmentConfig;
  }
};

/**
 * Application configuration
 */
export const config = getConfig();

export default config;