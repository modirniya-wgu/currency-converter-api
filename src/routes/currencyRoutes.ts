import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { config } from '../config';
import {
  getAllRates,
  getRatesForBase,
  convertCurrency,
  getSupportedCurrencies,
  getHealthCheck,
} from '../controllers/currencyController';
import { validateRequest, convertQuerySchema, baseParamSchema } from '../middleware/validators';

const router = Router();

// Rate limiter middleware
const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later.',
    },
  },
});

// Apply rate limiting to all routes
router.use(apiLimiter);

// Routes
router.get('/rates', getAllRates);
router.get('/rates/:base', validateRequest(baseParamSchema), getRatesForBase);
router.get('/convert', validateRequest(convertQuerySchema), convertCurrency);
router.get('/currencies', getSupportedCurrencies);
router.get('/health', getHealthCheck);

export default router; 