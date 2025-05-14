import {
  Config,
  CryptoCurrencyAmount,
  ExchangeRates,
  Profile,
  Rule,
  Transaction,
  Wallet,
} from "@/types/core";

import { useCopilotReadable } from "@copilotkit/react-core";
import { createContext, useContext } from "react";

type AssistantContextType = {
  profile: Profile | null;
  wallet: Wallet | null;
  exchangeRates: ExchangeRates | null;
  transactions: Transaction[] | null;
  rules: Rule[] | null;
  refetchProfile: () => void;
  refetchConfig: () => void;
};

const AssistantContext = createContext<AssistantContextType | undefined>(
  undefined
);

export function AssistantProvider({
  children,
  profile,
  refetchProfile,
  config,
  refetchConfig,
}: {
  children: React.ReactNode;
  profile: Profile;
  config: Config;
  refetchProfile: () => void;
  refetchConfig: () => void;
}) {
  // const {
  //   data: wallet,
  //   isLoading: walletLoading,
  //   error: walletError,
  //   refetch: refetchWallet,
  // } = useQuery<Wallet>({
  //   queryKey: ["wallet"],
  //   queryFn: () =>
  //     postJSON("/api/v1/wallet", {
  //       userId: "47701548-3fdb-4690-b36c-2d65ee42d10a",
  //     }),
  // });

  // console.log({ wallet, walletLoading, walletError, refetchWallet });

  useCopilotReadable(
    {
      description: "Wallet",
      value: config?.wallet as Wallet | null,
      available: "enabled",
    },
    [config]
  );

  useCopilotReadable(
    {
      description: "Wallet Balance",
      value: config?.wallet?.balance as CryptoCurrencyAmount[] | null,
      available: "enabled",
    },
    [config]
  );

  useCopilotReadable(
    {
      description: "Exchange Rates",
      value: config?.exchangeRates as ExchangeRates | null,
      available: "enabled",
    },
    [config]
  );

  useCopilotReadable(
    {
      description: "Users Recent Transactions",
      value: config?.transactions as Transaction[] | null,
      available: "enabled",
    },
    [config]
  );

  useCopilotReadable(
    {
      description: "User Created Rules",
      value: config?.rules as Rule[] | null,
      available: "enabled",
    },
    [config]
  );

  return (
    <AssistantContext.Provider
      value={{
        profile: profile ?? null,
        wallet: config?.wallet ?? null,
        exchangeRates: config?.exchangeRates ?? null,
        transactions: config?.transactions ?? null,
        rules: config?.rules ?? null,
        refetchProfile,
        refetchConfig,
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
