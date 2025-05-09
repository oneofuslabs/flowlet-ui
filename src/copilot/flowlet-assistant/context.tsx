import {
  Config,
  CryptoCurrencyAmount,
  ExchangeRates,
  Profile,
  Rule,
  Transaction,
  Wallet,
} from "@/types/core";
import { getJSON } from "@/utils/loaders";
import { useCopilotReadable } from "@copilotkit/react-core";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext } from "react";

type AssistantContextType = {
  profile: Profile | null;
  wallet: Wallet | null;
  exchangeRates: ExchangeRates | null;
  transactions: Transaction[] | null;
  rules: Rule[] | null;
  profileLoading: boolean;
  profileError: Error | null;
  configLoading: boolean;
  configError: Error | null;
  refetchProfile: () => void;
  refetchConfig: () => void;
};

const AssistantContext = createContext<AssistantContextType | undefined>(
  undefined
);

export function AssistantProvider({ children }: { children: React.ReactNode }) {
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useQuery<Profile>({
    queryKey: ["profile"],
    queryFn: () => getJSON("/api/v1/users/profile"),
  });

  const {
    data: config,
    isLoading: configLoading,
    error: configError,
    refetch: refetchConfig,
  } = useQuery<Config>({
    queryKey: ["config"],
    queryFn: () => getJSON("/api/v1/users/config"),
  });

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
        profileLoading,
        profileError,
        wallet: config?.wallet ?? null,
        exchangeRates: config?.exchangeRates ?? null,
        transactions: config?.transactions ?? null,
        rules: config?.rules ?? null,
        configLoading,
        configError,
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
