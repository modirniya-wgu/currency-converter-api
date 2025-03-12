import cron from 'node-cron';
import logger from '../utils/logger';
import { exchangeRateService } from './exchangeRateService';

class SchedulerService {
  private updateJob: cron.ScheduledTask | null = null;
  private readonly maxRetries = 3;
  private readonly retryDelay = 5 * 60 * 1000; // 5 minutes in milliseconds

  startUpdateScheduler(): void {
    // Schedule updates every 2 hours
    this.updateJob = cron.schedule('0 */2 * * *', () => {
      this.updateRatesWithRetry();
    });

    logger.info('Exchange rate update scheduler started');
  }

  stopUpdateScheduler(): void {
    if (this.updateJob) {
      this.updateJob.stop();
      logger.info('Exchange rate update scheduler stopped');
    }
  }

  private async updateRatesWithRetry(retryCount = 0): Promise<void> {
    try {
      logger.debug('Starting scheduled exchange rate update');
      await exchangeRateService.fetchLatestRates();
      logger.info('Successfully updated exchange rates');
    } catch (error) {
      logger.error('Failed to update exchange rates:', error);

      if (retryCount < this.maxRetries) {
        logger.info(`Retrying update in ${this.retryDelay / 1000} seconds... (Attempt ${retryCount + 1}/${this.maxRetries})`);
        setTimeout(() => {
          this.updateRatesWithRetry(retryCount + 1);
        }, this.retryDelay);
      } else {
        logger.error(`Failed to update exchange rates after ${this.maxRetries} attempts`);
      }
    }
  }

  // Method to force an immediate update
  async forceUpdate(): Promise<void> {
    logger.info('Forcing immediate exchange rate update');
    await this.updateRatesWithRetry();
  }
}

// Export a singleton instance
export const schedulerService = new SchedulerService(); 