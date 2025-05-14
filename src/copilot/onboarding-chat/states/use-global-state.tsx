import { useCopilotReadable } from "@copilotkit/react-core";
import { createContext, useContext, useState, ReactNode } from "react";
import { Profile, Wallet } from "@/types/core";
import { getJSON, postJSON, patchJSON } from "@/utils/loaders";
import { useQuery } from "@tanstack/react-query";
export const GlobalStateContext = createContext(null);

export type OnboardingStage = "getFullName" | "createWallet";

export interface GlobalStateOnboardingState {
  stage: OnboardingStage;
  setStage: (stage: OnboardingStage) => void;
  fullName: string;
  setFullName: (fullName: string) => void;
  wallet: Wallet | null;
  setWallet: (wallet: Wallet | null) => void;
  profile: Profile | null;
  profileLoading: boolean;
  createWallet: () => Promise<Wallet>;
  saveName: (fullName: string) => Promise<void>;
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
  const [wallet, setWallet] = useState<Wallet | null>(null);

  const { data: profile, isLoading: profileLoading } = useQuery<Profile>({
    queryKey: ["profile"],
    queryFn: () => getJSON("/api/v1/users/profile"),
  });

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
        },
        wallet,
        setWallet: (wallet: Wallet | null) => {
          setWallet(wallet);
          console.log("Wallet set to:", wallet);
        },
        profile: profile || null,
        profileLoading,
        saveName: async (fullName: string) =>
          await patchJSON("/api/v1/users/profile", {
            full_name: fullName,
          }),
        createWallet: async () => {
          const wallet = await postJSON("/api/v1/wallet", {
            userId: profile?.id,
          });
          setWallet(wallet as Wallet);
          return wallet as Wallet;
        },
      }}
    >
      {children}
    </GlobalStateOnboardingContext.Provider>
  );
}
