"use client";
import {
  useCopilotAction,
  useCopilotAdditionalInstructions,
  useCopilotReadable,
} from "@copilotkit/react-core";
import { useGlobalOnboardingState } from "./use-global-state";

export function useStageCreateWallet() {
  const { setWallet, wallet, stage, setStage, fullName, createWallet } =
    useGlobalOnboardingState();

  useCopilotReadable(
    {
      description: "Full Name",
      value: fullName,
      available: stage === "createWallet" ? "enabled" : "disabled",
    },
    [stage]
  );

  useCopilotReadable(
    {
      description: "Wallet",
      value: wallet,
      available: wallet ? "enabled" : "disabled",
    },
    [wallet]
  );

  // Conditionally add additional instructions for the agent's prompt.
  useCopilotAdditionalInstructions(
    {
      instructions:
        "CURRENT STATE: You are now creating a wallet for the user. Confirm whether the user would like to create a wallet? while confirming, use the fullName that is provided in the response. Explain the user that the wallet is required to continue. There will be $5 usd in the wallet to start with. Do not ask for email or any other additional information. Just confirm if the user would like to create a wallet.",
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
          // TODO: move to the assistant chat here gracefully possibly with the card component
          setWallet(wallet);
        } else {
          setStage("getFullName");
        }
      },
    },
    [stage]
  );
}
