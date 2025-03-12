// Mock environment variables for testing
process.env.EXCHANGE_API_KEY = 'test-api-key';

import request from 'supertest';
import app from '../../index';
import { exchangeRateService } from '../../services/exchangeRateService';
import { schedulerService } from '../../services/schedulerService';

jest.mock('../../services/exchangeRateService');
jest.mock('../../services/schedulerService');

describe('API Integration Tests', () => {
  beforeAll(() => {
    // Mock the exchange rate service methods
    (exchangeRateService.fetchLatestRates as jest.Mock).mockResolvedValue({
      USD: 1,
      EUR: 0.85,
      GBP: 0.73,
      JPY: 110.45,
    });

    (exchangeRateService.convertCurrency as jest.Mock).mockImplementation(
      async (amount: number, from: string, to: string) => {
        if (from === 'USD' && to === 'EUR') {
          return {
            from,
            to,
            amount,
            result: amount * 0.85,
            rate: 0.85,
            timestamp: Date.now(),
          };
        }
        throw new Error(`Invalid currency pair: ${from}/${to}`);
      }
    );

    (exchangeRateService.getRatesForBase as jest.Mock).mockImplementation(
      async (base: string) => {
        if (base === 'EUR') {
          return {
            EUR: 1,
            USD: 1.18,
            GBP: 0.86,
            JPY: 130,
          };
        }
        throw new Error(`Invalid base currency: ${base}`);
      }
    );

    (exchangeRateService.getSupportedCurrencies as jest.Mock).mockResolvedValue([
      'USD',
      'EUR',
      'GBP',
      'JPY',
    ]);
  });

  describe('GET /api/health', () => {
    it('should return 200 OK', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('OK');
    });
  });

  describe('GET /api/rates', () => {
    it('should return current exchange rates', async () => {
      const response = await request(app).get('/api/rates');
      expect(response.status).toBe(200);
      expect(response.body.rates).toBeDefined();
    });

    it('should return rates for specific base currency', async () => {
      const response = await request(app).get('/api/rates/EUR');
      expect(response.status).toBe(200);
      expect(response.body.base).toBe('EUR');
      expect(response.body.rates).toBeDefined();
    });

    it('should return 400 for invalid base currency', async () => {
      const response = await request(app).get('/api/rates/INVALID');
      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/convert', () => {
    it('should convert currency correctly', async () => {
      const response = await request(app)
        .get('/api/convert')
        .query({ from: 'USD', to: 'EUR', amount: '100' });

      expect(response.status).toBe(200);
      expect(response.body.result).toBe(85);
    });

    it('should return 400 for invalid amount', async () => {
      const response = await request(app)
        .get('/api/convert')
        .query({ from: 'USD', to: 'EUR', amount: 'invalid' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should return 400 for invalid source currency', async () => {
      const response = await request(app)
        .get('/api/convert')
        .query({ from: 'INVALID', to: 'EUR', amount: '100' });

      expect(response.status).toBe(400);
    });

    it('should return 400 for invalid target currency', async () => {
      const response = await request(app)
        .get('/api/convert')
        .query({ from: 'USD', to: 'INVALID', amount: '100' });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/currencies', () => {
    it('should return list of supported currencies', async () => {
      const response = await request(app).get('/api/currencies');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.currencies)).toBe(true);
    });
  });

  describe('Rate Limiting', () => {
    it('should handle multiple requests within rate limit', async () => {
      const requests = Array(10).fill(null).map(() =>
        request(app).get('/api/health')
      );
      const responses = await Promise.all(requests);
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });

    it('should handle burst of requests', async () => {
      const requests = Array(20).fill(null).map(() =>
        request(app).get('/api/health')
      );
      const responses = await Promise.all(requests);
      responses.forEach(response => {
        expect([200, 429]).toContain(response.status);
      });
    });
  });
}); 