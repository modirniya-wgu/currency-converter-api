import axios from 'axios';
import { config } from '../config';
import logger from '../utils/logger';
import type {
  OpenExchangeRatesResponse,
  ExchangeRates,
  ConversionResult,
  CacheData,
} from '../types/currency';

class ExchangeRateService {
  private cache: CacheData | null = null;
  private readonly apiClient;

  constructor() {
    this.apiClient = axios.create({
      baseURL: config.exchangeApi.baseUrl,
      params: {
        app_id: config.exchangeApi.key,
      },
      timeout: 10000, // 10 second timeout
    });

    logger.info('Exchange Rate Service initialized');
  }

  private isCacheValid(): boolean {
    if (!this.cache) {
      logger.debug('Cache is empty');
      return false;
    }
    const now = Date.now();
    const isValid = now - this.cache.timestamp < config.cache.ttl;
    logger.debug(`Cache validity check: ${isValid ? 'valid' : 'expired'}`);
    return isValid;
  }

  async fetchLatestRates(): Promise<ExchangeRates> {
    try {
      if (this.isCacheValid() && this.cache) {
        logger.debug('Returning cached exchange rates');
        return this.cache.rates;
      }

      logger.info('Fetching fresh exchange rates from API');
      const response = await this.apiClient.get<OpenExchangeRatesResponse>('/latest.json');
      const { rates, timestamp } = response.data;

      this.cache = {
        timestamp: timestamp * 1000, // Convert to milliseconds
        rates,
      };

      logger.info(`Successfully fetched rates for ${Object.keys(rates).length} currencies`);
      return rates;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error('API request failed:', {
          status: error.response?.status,
          message: error.message,
          url: error.config?.url,
        });
        
        if (error.response?.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        
        if (error.response?.status === 401) {
          throw new Error('Invalid API key. Please check your configuration.');
        }
      }
      
      logger.error('Failed to fetch exchange rates:', error);
      
      // If cache is available but expired, use it as fallback
      if (this.cache) {
        logger.warn('Using expired cache as fallback');
        return this.cache.rates;
      }
      
      throw new Error('Failed to fetch exchange rates and no cached data available');
    }
  }

  async convertCurrency(
    amount: number,
    from: string,
    to: string
  ): Promise<ConversionResult> {
    logger.debug('Converting currency', { amount, from, to });

    try {
      const rates = await this.fetchLatestRates();
      
      // Validate currencies
      if (!rates[from]) {
        logger.error('Invalid source currency', { currency: from });
        throw new Error('Invalid source currency');
      }
      if (!rates[to]) {
        logger.error('Invalid target currency', { currency: to });
        throw new Error('Invalid target currency');
      }

      // Convert through USD (base currency)
      const fromRate = rates[from];
      const toRate = rates[to];
      const convertedAmount = (amount / fromRate) * toRate;

      const result = {
        from,
        to,
        amount,
        result: Number(convertedAmount.toFixed(2)),
        rate: Number((toRate / fromRate).toFixed(6)),
        timestamp: this.cache?.timestamp || Date.now(),
      };

      logger.debug('Currency conversion successful', result);
      return result;
    } catch (error) {
      logger.error('Currency conversion failed:', error);
      throw error;
    }
  }

  async getSupportedCurrencies(): Promise<string[]> {
    try {
      const rates = await this.fetchLatestRates();
      const currencies = Object.keys(rates).sort();
      logger.debug(`Retrieved ${currencies.length} supported currencies`);
      return currencies;
    } catch (error) {
      logger.error('Failed to get supported currencies:', error);
      throw error;
    }
  }

  async getRatesForBase(base: string): Promise<ExchangeRates> {
    logger.debug('Getting rates for base currency', { base });
    
    try {
      const rates = await this.fetchLatestRates();
      
      if (!rates[base]) {
        logger.error('Invalid base currency requested', { currency: base });
        throw new Error('Invalid base currency');
      }

      const baseRate = rates[base];
      const convertedRates: ExchangeRates = {};

      for (const [currency, rate] of Object.entries(rates)) {
        convertedRates[currency] = Number((rate / baseRate).toFixed(6));
      }

      logger.debug(`Successfully converted rates to base ${base}`);
      return convertedRates;
    } catch (error) {
      logger.error('Failed to get rates for base currency:', error);
      throw error;
    }
  }

  // Method to clear the cache manually if needed
  clearCache(): void {
    this.cache = null;
    logger.info('Cache cleared manually');
  }
}

// Export a singleton instance
export const exchangeRateService = new ExchangeRateService(); 