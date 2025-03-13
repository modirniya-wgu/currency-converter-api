// Set up environment variables for testing
process.env.NODE_ENV = 'test';
process.env.EXCHANGE_API_KEY = 'test_api_key';
process.env.PORT = '3000';
process.env.EXCHANGE_API_BASE_URL = 'https://openexchangerates.org/api';
process.env.BASE_CURRENCY = 'USD';
process.env.CACHE_TTL = '7200000';
process.env.RATE_LIMIT_WINDOW = '900000';
process.env.RATE_LIMIT_MAX_REQUESTS = '100';