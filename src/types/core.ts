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
  id: number;
  type: "transfer" | "trade";
  fromWallet?: string;
  toWallet?: string;
  currency?: string;
  amount: number;
  frequency?: "daily" | "weekly" | "monthly" | "yearly";
  startDate?: string;
  created_at: string;
  completed_at?: string;
  transaction?: {
    created_at: string;
    txHash: string;
    txHashLink: string;
  };
  // For trade rules
  tradeType?: "BUY" | "SELL";
  fromCurrency?: string;
  toCurrency?: string;
  tresholdPrice?: number;
  tresholdDirection?: "ABOVE" | "BELOW";
};

export type Config = {
  wallet: Wallet;
  exchangeRates: ExchangeRates;
  transactions: Transaction[];
  rules: Rule[];
};
