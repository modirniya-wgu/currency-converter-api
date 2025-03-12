import { exchangeRateService } from '../../services/exchangeRateService';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ExchangeRateService', () => {
  const mockRates = {
    USD: 1,
    EUR: 0.85,
    GBP: 0.73,
    JPY: 110.0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    exchangeRateService.clearCache();
  });

  describe('fetchLatestRates', () => {
    it('should fetch rates from API when cache is empty', async () => {
      mockedAxios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue({
          data: {
            timestamp: Date.now() / 1000,
            base: 'USD',
            rates: mockRates,
          },
        }),
      } as any);

      const rates = await exchangeRateService.fetchLatestRates();
      expect(rates).toEqual(mockRates);
    });

    it('should use cache when available and valid', async () => {
      mockedAxios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue({
          data: {
            timestamp: Date.now() / 1000,
            base: 'USD',
            rates: mockRates,
          },
        }),
      } as any);

      // First call to populate cache
      await exchangeRateService.fetchLatestRates();
      const mockGet = mockedAxios.create().get;

      // Second call should use cache
      await exchangeRateService.fetchLatestRates();
      expect(mockGet).toHaveBeenCalledTimes(1);
    });
  });

  describe('convertCurrency', () => {
    beforeEach(() => {
      mockedAxios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue({
          data: {
            timestamp: Date.now() / 1000,
            base: 'USD',
            rates: mockRates,
          },
        }),
      } as any);
    });

    it('should convert currency correctly', async () => {
      const result = await exchangeRateService.convertCurrency(100, 'USD', 'EUR');
      expect(result.result).toBe(85);
      expect(result.rate).toBe(0.85);
    });

    it('should throw error for invalid source currency', async () => {
      await expect(
        exchangeRateService.convertCurrency(100, 'INVALID', 'EUR')
      ).rejects.toThrow('Invalid currency: INVALID');
    });

    it('should throw error for invalid target currency', async () => {
      await expect(
        exchangeRateService.convertCurrency(100, 'USD', 'INVALID')
      ).rejects.toThrow('Invalid currency: INVALID');
    });
  });

  describe('getRatesForBase', () => {
    beforeEach(() => {
      mockedAxios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue({
          data: {
            timestamp: Date.now() / 1000,
            base: 'USD',
            rates: mockRates,
          },
        }),
      } as any);
    });

    it('should convert rates to requested base currency', async () => {
      const eurRates = await exchangeRateService.getRatesForBase('EUR');
      expect(eurRates.USD).toBeCloseTo(1 / 0.85);
      expect(eurRates.GBP).toBeCloseTo(0.73 / 0.85);
    });

    it('should throw error for invalid base currency', async () => {
      await expect(
        exchangeRateService.getRatesForBase('INVALID')
      ).rejects.toThrow('Invalid base currency: INVALID');
    });
  });
}); 