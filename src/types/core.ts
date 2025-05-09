export type CryptoCurrency = "ETH" | "BTC" | "SOL" | "USDT";
export type CryptoCurrencyAmount = {
  currency: CryptoCurrency;
  amount: number;
};

export type Wallet = {
  walletAddress: string;
  walletPrivateKey: string;
  balance: CryptoCurrencyAmount[] | null;
};

export type ExchangeRates = Record<CryptoCurrency, number>;

export type Transaction = {
  transactionId: string;
  fromAmount: number;
  fromCurrency: CryptoCurrency;
  toCurrency: CryptoCurrency;
  transactionDate: Date;
  transactionStatus: string;
  transactionHash: string;
  transactionType: string;
};

export type Rule = {
  ruleId: string;
  fromCurrency: CryptoCurrency;
  fromAmount: number;
  toCurrency: CryptoCurrency;
  threshold: number;
  thresholdDirection: "above" | "below";
  status: "active" | "inactive";
  created_at: Date;
  updated_at: Date;
};
