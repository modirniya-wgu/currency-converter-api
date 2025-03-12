import { AxiosInstance, AxiosRequestHeaders } from 'axios';
import { exchangeRateService } from '../../services/exchangeRateService';

jest.mock('axios');

describe('ExchangeRateService', () => {
  let mockAxios: jest.Mocked<AxiosInstance>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockAxios = {
      get: jest.fn(),
      create: jest.fn().mockReturnThis(),
    } as unknown as jest.Mocked<AxiosInstance>;
    
    jest.spyOn(require('axios'), 'create').mockReturnValue(mockAxios);
    (exchangeRateService as any).apiClient = mockAxios;
    (exchangeRateService as any).cache = null;
  });

  describe('fetchLatestRates', () => {
    const mockResponse = {
      data: {
        rates: {
          USD: 1,
          EUR: 0.85,
          GBP: 0.73,
        },
        timestamp: 1741823172,
      },
      headers: {} as AxiosRequestHeaders,
      config: {} as any,
      status: 200,
      statusText: 'OK',
    };

    it('should fetch rates from API when cache is empty', async () => {
      mockAxios.get.mockResolvedValueOnce(mockResponse);
      const rates = await exchangeRateService.fetchLatestRates();
      expect(rates).toEqual(mockResponse.data.rates);
      expect(mockAxios.get).toHaveBeenCalledWith('/latest.json');
    });

    it('should use cache when available and valid', async () => {
      mockAxios.get.mockResolvedValueOnce(mockResponse);
      // First call to populate cache
      await exchangeRateService.fetchLatestRates();
      // Second call should use cache
      const rates = await exchangeRateService.fetchLatestRates();
      expect(rates).toEqual(mockResponse.data.rates);
      expect(mockAxios.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('convertCurrency', () => {
    const mockResponse = {
      data: {
        rates: {
          USD: 1,
          EUR: 0.85,
          GBP: 0.73,
        },
        timestamp: 1741823172,
      },
      headers: {} as AxiosRequestHeaders,
      config: {} as any,
      status: 200,
      statusText: 'OK',
    };

    it('should convert currency correctly', async () => {
      mockAxios.get.mockResolvedValueOnce(mockResponse);
      const result = await exchangeRateService.convertCurrency(100, 'USD', 'EUR');
      expect(result.result).toBe(85);
    });

    it('should throw error for invalid source currency', async () => {
      mockAxios.get.mockResolvedValueOnce(mockResponse);
      await expect(exchangeRateService.convertCurrency(100, 'INVALID', 'EUR')).rejects.toThrow('Invalid source currency');
    });

    it('should throw error for invalid target currency', async () => {
      mockAxios.get.mockResolvedValueOnce(mockResponse);
      await expect(exchangeRateService.convertCurrency(100, 'USD', 'INVALID')).rejects.toThrow('Invalid target currency');
    });
  });

  describe('getRatesForBase', () => {
    const mockResponse = {
      data: {
        rates: {
          USD: 1,
          EUR: 0.85,
          GBP: 0.73,
        },
        timestamp: 1741823172,
      },
      headers: {} as AxiosRequestHeaders,
      config: {} as any,
      status: 200,
      statusText: 'OK',
    };

    it('should convert rates to requested base currency', async () => {
      mockAxios.get.mockResolvedValueOnce(mockResponse);
      const rates = await exchangeRateService.getRatesForBase('EUR');
      expect(rates.USD).toBeCloseTo(1 / 0.85);
      expect(rates.EUR).toBe(1);
      expect(rates.GBP).toBeCloseTo(0.73 / 0.85);
    });

    it('should throw error for invalid base currency', async () => {
      mockAxios.get.mockResolvedValueOnce(mockResponse);
      await expect(exchangeRateService.getRatesForBase('INVALID')).rejects.toThrow('Invalid base currency');
    });
  });
}); 