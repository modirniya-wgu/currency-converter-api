import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const rapidApiAuth = (req: Request, res: Response, next: NextFunction) => {
  const rapidApiProxy = req.headers['x-rapidapi-proxy-secret'];
  const rapidApiKey = req.headers['x-rapidapi-key'];

  if (!rapidApiProxy || !rapidApiKey) {
    logger.error('Missing RapidAPI authentication headers');
    return res.status(401).json({
      error: 'Unauthorized: Missing RapidAPI authentication headers',
    });
  }

  // You'll get this value from RapidAPI when you publish your API
  const expectedProxySecret = process.env.RAPIDAPI_PROXY_SECRET;

  if (rapidApiProxy !== expectedProxySecret) {
    logger.error('Invalid RapidAPI proxy secret');
    return res.status(401).json({
      error: 'Unauthorized: Invalid RapidAPI proxy secret',
    });
  }

  next();
};