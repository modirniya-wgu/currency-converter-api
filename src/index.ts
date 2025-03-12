import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { config } from './config';
import currencyRoutes from './routes/currencyRoutes';
import { errorHandler } from './middleware/errorHandler';
import logger from './utils/logger';
import { schedulerService } from './services/schedulerService';
import swaggerDocument from './docs/swagger.json';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Request logging middleware
app.use((req, res, next) => {
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip,
  });
  next();
});

// Routes
app.use('/api', currencyRoutes);

// Error handling
app.use(errorHandler);

// Start the server
const server = app.listen(config.server.port, () => {
  logger.info(`Server started on port ${config.server.port} in ${config.server.nodeEnv} mode`);
  logger.info(`API Documentation available at http://localhost:${config.server.port}/api-docs`);
  
  // Start the exchange rate update scheduler
  schedulerService.startUpdateScheduler();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Starting graceful shutdown...');
  
  schedulerService.stopUpdateScheduler();
  
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

export default app; 