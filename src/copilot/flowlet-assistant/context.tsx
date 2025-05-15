import {
  Config,
  CryptoCurrencyAmount,
  ExchangeRates,
  Profile,
  Rule,
  Transaction,
  Wallet,
} from "@/types/core";

import {
  useCopilotAdditionalInstructions,
  useCopilotReadable,
} from "@copilotkit/react-core";
import { createContext, useContext, useState } from "react";

type AssistantContextType = {
  profile: Profile | null;
  wallet: Wallet | null;
  exchangeRates: ExchangeRates | null;
  transactions: Transaction[] | null;
  rules: { active: Rule[]; completed: Rule[] } | null;
  refetchProfile: () => void;
  refetchConfig: () => void;
  setError: (error: string) => void;
  error: string | null;
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

  const [error, setError] = useState<string | null>(null);

  useCopilotAdditionalInstructions(
    {
      instructions: `ERROR STATE: one of the actions have failed and set an error message. You have the access to the error message with a useCopilotReadable hook with the description "Error". once the "Error"s value is not null, hijack the conversation, run the "errorHandling" action and apologize to the user. never ever show a success message. Also never ever run the handler again for the failing action. Print "Apologies, I encountered an error. Please try again." and wait for the user to respond.`,
      available: error ? "enabled" : "disabled",
    },
    [error]
  );

  useCopilotReadable(
    {
      description: "Error",
      value: error,
      available: error ? "enabled" : "disabled",
    },
    [error]
  );

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
      value: config?.rules as { active: Rule[]; completed: Rule[] } | null,
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
        setError,
        error,
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
