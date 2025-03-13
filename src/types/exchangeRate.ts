export interface ExchangeRateResponse {
  rates: {
    [key: string]: number;
  };
  timestamp: number;
}

export interface ConversionResult {
  from: string;
  to: string;
  amount: number;
  result: number;
  rate: number;
  timestamp: number;
} 