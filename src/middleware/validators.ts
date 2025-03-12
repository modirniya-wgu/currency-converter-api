import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

// Validation schemas
export const convertQuerySchema = z.object({
  from: z.string().toUpperCase().min(3).max(3),
  to: z.string().toUpperCase().min(3).max(3),
  amount: z.string().transform((val) => {
    const num = Number(val);
    if (isNaN(num)) throw new Error('Amount must be a valid number');
    return num;
  }),
});

export const baseParamSchema = z.object({
  base: z.string().toUpperCase().min(3).max(3),
});

// Middleware factory
export const validateRequest = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = {
        ...req.query,
        ...req.params,
        ...req.body,
      };
      
      await schema.parseAsync(data);
      next();
    } catch (error) {
      next(error);
    }
  };
}; 