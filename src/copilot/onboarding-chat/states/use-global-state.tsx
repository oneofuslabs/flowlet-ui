import { useCopilotReadable } from "@copilotkit/react-core";
import { createContext, useContext, useState, ReactNode } from "react";

export const GlobalStateContext = createContext(null);

export type OnboardingStage =
  | "getFullName"
  | "createWallet"
  | "buyCrypto"
  | "showWalletInfo"
  | "approveBuyCrypto";

export type CryptoCurrency = "ETH" | "BTC" | "SOL";
export type CryptoCurrencyAmount = {
  currency: CryptoCurrency;
  amount: number;
};

export interface GlobalStateOnboardingState {
  stage: OnboardingStage;
  setStage: (stage: OnboardingStage) => void;
  fullName: string;
  setFullName: (fullName: string) => void;
  wallet: {
    walletAddress: string;
    walletPrivateKey: string;
  } | null;
  setWallet: (
    wallet: {
      walletAddress: string;
      walletPrivateKey: string;
    } | null
  ) => void;
  buyAmount: CryptoCurrencyAmount | null;
  setBuyAmount: (buyAmount: CryptoCurrencyAmount | null) => void;
}

export const GlobalStateOnboardingContext =
  createContext<GlobalStateOnboardingState | null>(null);

export function useGlobalOnboardingState() {
  const context = useContext(GlobalStateOnboardingContext);
  if (!context) {
    throw new Error(
      "useGlobalOnboardingState must be used within a GlobalOnboardingStateProvider"
    );
  }
  return context;
}

export function GlobalOnboardingStateProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [stage, setStage] = useState<OnboardingStage>("getFullName");
  const [fullName, setFullName] = useState<string>("");
  const [wallet, setWallet] = useState<{
    walletAddress: string;
    walletPrivateKey: string;
  } | null>(null);
  const [buyAmount, setBuyAmount] = useState<CryptoCurrencyAmount | null>(null);

  useCopilotReadable({
    description: "Currently Specified Information",
    value: {
      currentStage: stage,
    },
  });

  return (
    <GlobalStateOnboardingContext.Provider
      value={{
        stage,
        setStage: (stage: OnboardingStage) => {
          setStage(stage);
          console.log("Stage set to:", stage);
        },
        fullName,
        setFullName: (fullName: string) => {
          setFullName(fullName);
          console.log("Full name set to:", fullName);
        },
        wallet,
        setWallet: (
          wallet: {
            walletAddress: string;
            walletPrivateKey: string;
          } | null
        ) => {
          setWallet(wallet);
          console.log("Wallet set to:", wallet);
        },
        buyAmount,
        setBuyAmount: (buyAmount: CryptoCurrencyAmount | null) => {
          setBuyAmount(buyAmount);
          console.log("Buy amount set to:", buyAmount);
        },
      }}
    >
      {children}
    </GlobalStateOnboardingContext.Provider>
  );
}
