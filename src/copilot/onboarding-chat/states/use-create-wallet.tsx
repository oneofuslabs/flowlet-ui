"use client";
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import { useGlobalOnboardingState } from "./use-global-state";
import { useRef } from "react";
export function useStageCreateWallet() {
  const { wallet, createWallet } = useGlobalOnboardingState();

  const walletCreateInitiated = useRef(false);

  useCopilotReadable(
    {
      description: "Wallet",
      value: wallet,
      available: wallet ? "enabled" : "disabled",
    },
    [wallet]
  );

  useCopilotReadable(
    {
      description: "Wallet address",
      value: wallet?.address,
      available: wallet?.address ? "enabled" : "disabled",
    },
    [wallet?.address]
  );

  useCopilotAction(
    {
      name: "createWallet",
      description: "Confirm the user wants to create a wallet",
      available: !wallet ? "enabled" : "disabled",
      parameters: [
        {
          name: "isUserWantsToCreateWallet",
          type: "boolean",
          description: "Whether the user would like to create a wallet.",
        },
      ],
      handler: async (response) => {
        if (
          response.isUserWantsToCreateWallet &&
          !walletCreateInitiated.current
        ) {
          walletCreateInitiated.current = true;
          const wallet = await createWallet();
          console.log({ wallet });
          window.location.reload();
        }
      },
    },
    [wallet]
  );
}
