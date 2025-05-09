export type Profile = {
  id: string;
  email: string;
  full_name: string;
};

export type CryptoCurrency = "ETH" | "BTC" | "SOL" | "USDT";

export type CryptoCurrencyAmount = {
  currency: CryptoCurrency;
  amount: number;
};

export type Wallet = {
  address: string;
  privateKey: string;
  balance?: CryptoCurrencyAmount[] | null;
};

export type ExchangeRates = Record<CryptoCurrency, number>;

export type Transaction = {
  id: string;
  fromAmount: number;
  fromCurrency: CryptoCurrency;
  toCurrency: CryptoCurrency;
  toAmount: number;
  transactionDate: Date;
  transactionStatus: string;
  transactionHash: string;
  transactionType: string;
};

export type Rule = {
  id: string;
  fromCurrency: CryptoCurrency;
  fromAmount: number;
  toCurrency?: CryptoCurrency;
  // For recurring rules
  toWalletAddress?: string;
  frequency?: "daily" | "weekly" | "monthly" | "yearly";
  // For trading rules
  threshold?: number;
  thresholdDirection?: "above" | "below";
  status: "active" | "inactive";
  startDate?: Date;
  endDate?: Date;
  created_at: Date;
  updated_at: Date;
};

export type Config = {
  wallet: Wallet;
  exchangeRates: ExchangeRates;
  transactions: Transaction[];
  rules: Rule[];
};
