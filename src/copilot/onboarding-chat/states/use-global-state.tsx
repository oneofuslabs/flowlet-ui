import { createContext, useContext, useState, ReactNode } from "react";
import { Profile, Wallet } from "@/types/core";
import { getJSON, postJSON } from "@/utils/loaders";
import { useQuery } from "@tanstack/react-query";
export const GlobalStateContext = createContext(null);

export interface GlobalStateOnboardingState {
  wallet: Wallet | null;
  setWallet: (wallet: Wallet | null) => void;
  profile: Profile | null;
  profileLoading: boolean;
  createWallet: () => Promise<Wallet>;
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
  const [wallet, setWallet] = useState<Wallet | null>(null);

  const { data: profile, isLoading: profileLoading } = useQuery<Profile>({
    queryKey: ["profile"],
    queryFn: () => getJSON("/api/v1/users/profile"),
  });

  return (
    <GlobalStateOnboardingContext.Provider
      value={{
        wallet,
        setWallet: (wallet: Wallet | null) => {
          setWallet(wallet);
          console.log("Wallet set to:", wallet);
        },
        profile: profile || null,
        profileLoading,
        createWallet: async () => {
          const wallet = await postJSON("/api/v1/wallet", {
            userId: profile?.id,
          });
          const _wallet = {
            address: wallet.walletAddress,
            privateKey: wallet.privateKey,
            balance: wallet.balance,
          };
          setWallet(_wallet);
          return _wallet as Wallet;
        },
      }}
    >
      {children}
    </GlobalStateOnboardingContext.Provider>
  );
}
