export type Profile = {
  id: string;
  email: string;
  full_name: string;
};

export type CryptoCurrency = "ETH" | "BTC" | "SOL" | "USDC";

export type CryptoCurrencyAmount = {
  currency: CryptoCurrency;
  amount: number;
};

export type Wallet = {
  address: string;
  privateKey: string;
  balance?: CryptoCurrencyAmount[] | null;
};

export type ExchangeRates = Record<
  CryptoCurrency,
  { rate: number; tokenAddress: string }
>;

export type TransactionType = "stake" | "transfer" | "trade";
export type TransactionStatus = "Active" | "Completed" | "Failed" | "Pending";

export type Transaction = {
  id: number;
  created_at: string;
  tokenName?: string;
  tokenAddress?: string;
  amount: number;
  duration?: number;
  programId?: string;
  status?: TransactionStatus;
  walletAddress: string;
  fromWallet?: string;
  toWallet?: string;
  fromCurrency?: string;
  toCurrency?: string;
  txHash: string;
  txHashLink: string;
  type: TransactionType;
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
