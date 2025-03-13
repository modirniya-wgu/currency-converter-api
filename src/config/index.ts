import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file based on NODE_ENV
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: path.join(__dirname, '../../', envFile) });

export const config = {
  server: {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  exchangeApi: {
    key: process.env.EXCHANGE_API_KEY,
    baseUrl: process.env.EXCHANGE_API_BASE_URL || 'https://openexchangerates.org/api',
    baseCurrency: process.env.BASE_CURRENCY || 'USD',
  },
  cache: {
    ttl: parseInt(process.env.CACHE_TTL || '7200000', 10), // 2 hours in milliseconds
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '900000', 10), // 15 minutes in milliseconds
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
} as const;

// Type checking for required environment variables
if (!config.exchangeApi.key) {
  throw new Error('EXCHANGE_API_KEY is required');
} 