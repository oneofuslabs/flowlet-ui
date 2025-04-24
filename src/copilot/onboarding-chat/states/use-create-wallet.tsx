"use client";
import {
  useCopilotAction,
  useCopilotAdditionalInstructions,
  useCopilotReadable,
} from "@copilotkit/react-core";
import { useGlobalOnboardingState } from "./use-global-state";
import { WalletInfo } from "../components/wallet-info";
import { BuyCrypto } from "../components/buy-crypto";
const createWallet = async () => ({
  walletAddress: "0x4f3C6b6F54eA215D24C36d4f3B6D80D50E9fE6a8", // 32 bytes base58 encoded
  walletPrivateKey:
    "0x9b5e19fc2dd8f486b213768e245c70571e9bcb5b6c1ab38ea2f439d210b7262a", // 32 bytes base58 encoded
});

export function useStageCreateWallet() {
  const { setWallet, stage, setStage, fullName } = useGlobalOnboardingState();

  useCopilotReadable(
    {
      description: "Full Name",
      value: fullName,
      available: stage === "createWallet" ? "enabled" : "disabled",
    },
    [stage]
  );
  // Conditionally add additional instructions for the agent's prompt.
  useCopilotAdditionalInstructions(
    {
      instructions:
        "CURRENT STATE: You are now creating a wallet for the user. Confirm whether the user would like to create a wallet? while confirming, use the fullName that is provided in the response.",
      available: stage === "createWallet" ? "enabled" : "disabled",
    },
    [stage]
  );

  useCopilotAction(
    {
      name: "createWallet",
      description: "Confirm the user wants to create a wallet",
      available: stage === "createWallet" ? "enabled" : "disabled",
      parameters: [
        {
          name: "isUserWantsToCreateWallet",
          type: "boolean",
          description:
            "Whether the user would like to create a wallet. Make sure to use the name that is provided in the response.",
        },
      ],
      handler: async (response) => {
        if (response.isUserWantsToCreateWallet) {
          const wallet = await createWallet();
          setWallet(wallet);
          setStage("showWalletInfo");
        } else {
          setStage("getFullName");
        }
      },
    },
    [stage]
  );
}

export function useStageShowWalletInfo() {
  const { wallet, stage, setStage } = useGlobalOnboardingState();

  useCopilotAdditionalInstructions(
    {
      instructions:
        "CURRENT STATE: You are now showing the wallet information to the user. Say 'Great! Here is your wallet information. Please save it in a safe place.' but do not print the keys as text, show them as the component from showWalletInfo action.",
      available: stage === "showWalletInfo" ? "enabled" : "disabled",
    },
    [stage]
  );

  useCopilotReadable(
    {
      description: "Wallet Information",
      value: wallet,
      available: stage === "showWalletInfo" ? "enabled" : "disabled",
    },
    [stage]
  );

  useCopilotAction({
    name: "showWalletInfo",
    description:
      "Show the wallet information to the user. Do not call this more than once. Make sure to run this action as soon as this stage starts.",
    available: stage === "showWalletInfo" ? "enabled" : "disabled",
    renderAndWaitForResponse: ({ respond }) => {
      if (!wallet) return <div>Loading wallet information...</div>;

      return (
        <WalletInfo
          onProceed={() => {
            respond?.(
              "The user has saved their wallet info - we are proceeding to the next step."
            );
            setStage("buyCrypto");
          }}
          wallet={wallet}
        />
      );
    },
  });
}

export function useStageBuyCrypto() {
  const { wallet, stage, setStage, buyAmount, setBuyAmount } =
    useGlobalOnboardingState();

  useCopilotAdditionalInstructions(
    {
      instructions:
        "CURRENT STATE: You are now helping them buy some crypto with the buyCrypto action. Let the user know that we gave them $5 usd to start with. Make sure to run the buyCrypto action as soon as you explain the situation.",
      available: stage === "buyCrypto" ? "enabled" : "disabled",
    },
    [stage]
  );

  useCopilotAction({
    name: "buyCrypto",
    description: "Buy crypto currency for the user.",
    available: stage === "buyCrypto" ? "enabled" : "disabled",
    renderAndWaitForResponse: ({ respond }) => {
      if (!wallet) return <div>Loading wallet information...</div>;

      return (
        <BuyCrypto
          onCancel={() => {
            setStage("showWalletInfo");
          }}
          onConfirm={() => {
            respond?.(
              `Say 'Great! your order for ${buyAmount?.amount} USD worth of ${buyAmount?.currency} has been placed.'. this stage is finished. We are moving to the next one.`
            );
            setStage("approveBuyCrypto");
          }}
          onValueChange={(value) => {
            setBuyAmount(value);
          }}
          buyAmount={buyAmount}
        />
      );
    },
  });
}
