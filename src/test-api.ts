import { exchangeRateService } from './services/exchangeRateService';

async function testExchangeRateAPI(): Promise<void> {
  try {
    console.log('Testing Exchange Rate API Integration...\n');

    // Test fetching latest rates
    console.log('1. Fetching latest rates...');
    const rates = await exchangeRateService.fetchLatestRates();
    console.log(`✓ Successfully fetched rates for ${Object.keys(rates).length} currencies\n`);

    // Test currency conversion
    console.log('2. Testing currency conversion...');
    const conversion = await exchangeRateService.convertCurrency(100, 'USD', 'EUR');
    console.log('✓ Successfully converted currency:');
    console.log(conversion);
    console.log();

    // Test getting supported currencies
    console.log('3. Getting supported currencies...');
    const currencies = await exchangeRateService.getSupportedCurrencies();
    console.log(`✓ Successfully retrieved ${currencies.length} supported currencies`);
    console.log('First 5 currencies:', currencies.slice(0, 5).join(', '));
    console.log();

    // Test getting rates for specific base currency
    console.log('4. Getting rates for EUR base...');
    const eurRates = await exchangeRateService.getRatesForBase('EUR');
    console.log('✓ Successfully retrieved EUR-based rates');
    console.log('Sample rates:', {
      USD: eurRates.USD,
      GBP: eurRates.GBP,
      JPY: eurRates.JPY,
    });

    console.log('\nAll tests passed successfully! ✨');
  } catch (error) {
    console.error('\n❌ Error during API testing:');
    console.error(error);
    process.exit(1);
  }
}

// Run the tests
testExchangeRateAPI(); 