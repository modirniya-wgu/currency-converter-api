import { Request, Response, NextFunction } from 'express';
import { config } from '../config';

export const rapidApiAuth = (req: Request, res: Response, next: NextFunction) => {
  const rapidApiKey = req.headers['x-rapidapi-key'];
  const rapidApiProxySecret = req.headers['x-rapidapi-proxy-secret'];

  if (!rapidApiKey || !rapidApiProxySecret) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Missing RapidAPI authentication credentials'
      }
    });
  }

  if (rapidApiProxySecret !== config.rapidApi.proxySecret) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid RapidAPI proxy secret'
      }
    });
  }

  next();
}; 