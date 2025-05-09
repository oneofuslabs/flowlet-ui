import {
  CryptoCurrencyAmount,
  ExchangeRates,
  Rule,
  Transaction,
  Wallet,
} from "@/types/core";
import { useCopilotReadable } from "@copilotkit/react-core";
import { createContext, useContext, useState } from "react";

type AssistantContextType = {
  wallet: Wallet | null;
  setWallet: (wallet: Wallet | null) => void;
  exchangeRates: ExchangeRates | null;
  setExchangeRates: (exchangeRates: ExchangeRates | null) => void;
  transactions: Transaction[] | null;
  setTransactions: (transactions: Transaction[] | null) => void;
  rules: Rule[] | null;
  setRules: (rules: Rule[] | null) => void;
};

const AssistantContext = createContext<AssistantContextType | undefined>(
  undefined
);

export function AssistantProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<Wallet | null>({
    walletAddress: "0x4f3C6b6F54eA215D24C36d4f3B6D80D50E9fE6a8",
    walletPrivateKey:
      "0x9b5e19fc2dd8f486b213768e245c70571e9bcb5b6c1ab38ea2f439d210b7262a",
    balance: [
      {
        currency: "ETH",
        amount: 2,
      },
      {
        currency: "BTC",
        amount: 0.1,
      },
      {
        currency: "SOL",
        amount: 2,
      },
      {
        currency: "USDT",
        amount: 5,
      },
    ],
  });
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>({
    USDT: 1,
    ETH: 3,
    BTC: 5,
    SOL: 20,
  });
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [rules, setRules] = useState<Rule[] | null>(null);

  useCopilotReadable(
    {
      description: "Wallet",
      value: wallet as Wallet,
      available: "enabled",
    },
    [wallet]
  );

  useCopilotReadable(
    {
      description: "Wallet Balance",
      value: wallet?.balance as CryptoCurrencyAmount[],
      available: "enabled",
    },
    [wallet]
  );

  useCopilotReadable(
    {
      description:
        "Exchange Rates representing the amount you can buy with 1 USDT",
      value: exchangeRates as ExchangeRates,
      available: "enabled",
    },
    [exchangeRates]
  );

  useCopilotReadable(
    {
      description: "Users Recent Transactions",
      value: transactions as Transaction[],
      available: "enabled",
    },
    [transactions]
  );

  useCopilotReadable(
    {
      description: "Users Active Rules",
      value: rules as Rule[],
      available: "enabled",
    },
    [rules]
  );

  return (
    <AssistantContext.Provider
      value={{
        wallet,
        setWallet,
        exchangeRates,
        setExchangeRates,
        transactions,
        setTransactions,
        rules,
        setRules,
      }}
    >
      {children}
    </AssistantContext.Provider>
  );
}

export function useAssistant() {
  const context = useContext(AssistantContext);
  if (context === undefined) {
    throw new Error("useAssistant must be used within an AssistantProvider");
  }
  return context;
}
