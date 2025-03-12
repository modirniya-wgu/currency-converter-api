import axios from 'axios';
import { config } from './config';

const API_URL = `http://localhost:${config.server.port}/api`;

async function testEndpoints(): Promise<void> {
  try {
    console.log('Testing API Endpoints...\n');

    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const health = await axios.get(`${API_URL}/health`);
    console.log('✓ Health check response:', health.data);
    console.log();

    // Test getting all rates
    console.log('2. Testing get all rates...');
    const rates = await axios.get(`${API_URL}/rates`);
    console.log(`✓ Got rates for ${Object.keys(rates.data.rates).length} currencies`);
    console.log();

    // Test getting rates for specific base
    console.log('3. Testing get rates with EUR base...');
    const eurRates = await axios.get(`${API_URL}/rates/EUR`);
    console.log('✓ Got EUR-based rates:', {
      base: eurRates.data.base,
      sampleRates: {
        USD: eurRates.data.rates.USD,
        GBP: eurRates.data.rates.GBP,
      },
    });
    console.log();

    // Test currency conversion
    console.log('4. Testing currency conversion...');
    const conversion = await axios.get(`${API_URL}/convert`, {
      params: {
        from: 'USD',
        to: 'EUR',
        amount: '100',
      },
    });
    console.log('✓ Conversion result:', conversion.data);
    console.log();

    // Test getting supported currencies
    console.log('5. Testing supported currencies...');
    const currencies = await axios.get(`${API_URL}/currencies`);
    console.log(`✓ Got ${currencies.data.count} supported currencies`);
    console.log('Sample currencies:', currencies.data.currencies.slice(0, 5));
    console.log();

    // Test error handling
    console.log('6. Testing error handling (invalid currency)...');
    try {
      await axios.get(`${API_URL}/rates/INVALID`);
      console.log('✗ Should have thrown an error');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log('✓ Got expected error response:', error.response.data);
      }
    }
    console.log();

    // Test rate limiting
    console.log('7. Testing rate limiting...');
    const requests = Array(config.rateLimit.maxRequests + 1).fill(null);
    try {
      await Promise.all(requests.map(() => axios.get(`${API_URL}/health`)));
      console.log('✗ Should have hit rate limit');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log('✓ Rate limiting working:', error.response.data);
      }
    }

    console.log('\nAll endpoint tests completed successfully! ✨');
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the tests
testEndpoints(); 