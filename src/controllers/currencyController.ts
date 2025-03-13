import { Request, Response, NextFunction } from 'express';
import { exchangeRateService } from '../services/exchangeRateService';
import { ApiError } from '../middleware/errorHandler';

export async function getAllRates(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const rates = await exchangeRateService.fetchLatestRates();
    res.json({
      base: 'USD',
      timestamp: Date.now(),
      rates,
    });
  } catch (error) {
    next(error);
  }
}

export async function getRatesForBase(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { base } = req.params;
    const rates = await exchangeRateService.getRatesForBase(base.toUpperCase());
    res.json({
      base: base.toUpperCase(),
      timestamp: Date.now(),
      rates,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Invalid base currency')) {
      next(new ApiError(400, `Invalid base currency: ${req.params.base}`, 'INVALID_CURRENCY'));
      return;
    }
    next(error);
  }
}

export async function convertCurrency(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { from, to, amount } = req.query;
    
    const result = await exchangeRateService.convertCurrency(
      Number(amount),
      from as string,
      to as string
    );

    res.json({
      result: result.result,
      from: result.from,
      to: result.to,
      amount: result.amount,
      rate: result.rate,
      timestamp: result.timestamp,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Invalid currency')) {
      next(new ApiError(400, error.message, 'INVALID_CURRENCY'));
      return;
    }
    next(error);
  }
}

export async function getSupportedCurrencies(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const currencies = await exchangeRateService.getSupportedCurrencies();
    res.json({
      count: currencies.length,
      currencies,
    });
  } catch (error) {
    next(error);
  }
}

export async function getHealthCheck(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Try to fetch rates to verify API connectivity
    await exchangeRateService.fetchLatestRates();
    
    res.json({
      status: 'OK',
      timestamp: Date.now(),
      service: 'currency-converter-api',
      environment: process.env.NODE_ENV,
    });
  } catch (error) {
    next(error);
  }
} 