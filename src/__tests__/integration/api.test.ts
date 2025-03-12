import request from 'supertest';
import app from '../../index';
import { exchangeRateService } from '../../services/exchangeRateService';
import { schedulerService } from '../../services/schedulerService';

describe('API Integration Tests', () => {
  const mockRates = {
    USD: 1,
    EUR: 0.85,
    GBP: 0.73,
    JPY: 110.0,
  };

  beforeAll(() => {
    // Mock exchangeRateService methods
    jest.spyOn(exchangeRateService, 'fetchLatestRates').mockResolvedValue(mockRates);
    jest.spyOn(schedulerService, 'startUpdateScheduler').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('GET /api/health', () => {
    it('should return healthy status', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('healthy');
    });
  });

  describe('GET /api/rates', () => {
    it('should return all exchange rates', async () => {
      const response = await request(app).get('/api/rates');
      expect(response.status).toBe(200);
      expect(response.body.base).toBe('USD');
      expect(response.body.rates).toEqual(mockRates);
    });
  });

  describe('GET /api/rates/:base', () => {
    it('should return rates for valid base currency', async () => {
      const response = await request(app).get('/api/rates/EUR');
      expect(response.status).toBe(200);
      expect(response.body.base).toBe('EUR');
      expect(response.body.rates).toBeDefined();
    });

    it('should return 400 for invalid base currency', async () => {
      const response = await request(app).get('/api/rates/INVALID');
      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /api/convert', () => {
    it('should convert currency correctly', async () => {
      const response = await request(app)
        .get('/api/convert')
        .query({ from: 'USD', to: 'EUR', amount: '100' });
      
      expect(response.status).toBe(200);
      expect(response.body.result).toBeDefined();
      expect(response.body.from).toBe('USD');
      expect(response.body.to).toBe('EUR');
    });

    it('should return 400 for invalid currency', async () => {
      const response = await request(app)
        .get('/api/convert')
        .query({ from: 'INVALID', to: 'EUR', amount: '100' });
      
      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 400 for invalid amount', async () => {
      const response = await request(app)
        .get('/api/convert')
        .query({ from: 'USD', to: 'EUR', amount: 'invalid' });
      
      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /api/currencies', () => {
    it('should return list of supported currencies', async () => {
      const response = await request(app).get('/api/currencies');
      expect(response.status).toBe(200);
      expect(response.body.currencies).toEqual(Object.keys(mockRates));
      expect(response.body.count).toBe(Object.keys(mockRates).length);
    });
  });

  describe('Rate Limiting', () => {
    it('should limit requests according to configuration', async () => {
      // Make requests up to the limit
      const requests = Array(101).fill(null);
      const responses = await Promise.all(
        requests.map(() => request(app).get('/api/health'))
      );

      // The last request should be rate limited
      const lastResponse = responses[responses.length - 1];
      expect(lastResponse.status).toBe(429);
      expect(lastResponse.body.error.code).toBe('RATE_LIMIT_EXCEEDED');
    });
  });
}); 