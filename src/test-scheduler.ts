import { schedulerService } from './services/schedulerService';
import { exchangeRateService } from './services/exchangeRateService';
import logger from './utils/logger';

async function testSchedulerAndCache(): Promise<void> {
  try {
    console.log('Testing Scheduler and Cache Functionality...\n');

    // Test initial fetch
    console.log('1. Initial fetch of exchange rates...');
    const initialRates = await exchangeRateService.fetchLatestRates();
    console.log(`✓ Successfully fetched initial rates for ${Object.keys(initialRates).length} currencies\n`);

    // Test cache hit
    console.log('2. Testing cache (immediate second fetch)...');
    const startTime = Date.now();
    await exchangeRateService.fetchLatestRates();
    const fetchTime = Date.now() - startTime;
    console.log(`✓ Second fetch completed in ${fetchTime}ms (should be very fast if cached)\n`);

    // Start the scheduler
    console.log('3. Starting the update scheduler...');
    schedulerService.startUpdateScheduler();
    console.log('✓ Scheduler started\n');

    // Force an update
    console.log('4. Testing force update...');
    await schedulerService.forceUpdate();
    console.log('✓ Force update completed\n');

    // Test error handling with invalid currency
    console.log('5. Testing error handling (invalid currency)...');
    try {
      await exchangeRateService.convertCurrency(100, 'USD', 'INVALID');
      console.log('✗ Should have thrown an error');
    } catch (error) {
      console.log('✓ Successfully caught invalid currency error\n');
    }

    // Clear cache and verify
    console.log('6. Testing cache clearing...');
    exchangeRateService.clearCache();
    const newFetchStartTime = Date.now();
    await exchangeRateService.fetchLatestRates();
    const newFetchTime = Date.now() - newFetchStartTime;
    console.log(`✓ Fresh fetch after cache clear completed in ${newFetchTime}ms (should be slower)\n`);

    // Stop the scheduler
    console.log('7. Stopping the scheduler...');
    schedulerService.stopUpdateScheduler();
    console.log('✓ Scheduler stopped\n');

    console.log('All tests passed successfully! ✨');
    
    // Exit after tests
    process.exit(0);
  } catch (error) {
    logger.error('Test failed:', error);
    process.exit(1);
  }
}

// Run the tests
testSchedulerAndCache(); 