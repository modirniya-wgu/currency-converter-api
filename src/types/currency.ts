export interface ExchangeRates {
  [currency: string]: number;
}

export interface OpenExchangeRatesResponse {
  disclaimer?: string;
  license?: string;
  timestamp: number;
  base: string;
  rates: ExchangeRates;
}

export interface ConversionResult {
  from: string;
  to: string;
  amount: number;
  result: number;
  rate: number;
  timestamp: number;
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
  };
}

export interface CacheData {
  timestamp: number;
  rates: ExchangeRates;
}

export type SupportedCurrency = string; 