"use client";
import {
  useCopilotAction,
  useCopilotAdditionalInstructions,
  useCopilotReadable,
} from "@copilotkit/react-core";
import { CryptoCurrency, useGlobalOnboardingState } from "./use-global-state";
// import { BuyCrypto } from "../components/buy-crypto";
// import { WalletInfo } from "../components/wallet-info";
const createWallet = async () => ({
  walletAddress: "0x4f3C6b6F54eA215D24C36d4f3B6D80D50E9fE6a8", // 32 bytes base58 encoded
  walletPrivateKey:
    "0x9b5e19fc2dd8f486b213768e245c70571e9bcb5b6c1ab38ea2f439d210b7262a", // 32 bytes base58 encoded
});

export function useStageCreateWallet() {
  const { setWallet, wallet, stage, setStage, fullName } =
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
          setStage("buyCrypto");
          setWallet(wallet);
        } else {
          setStage("getFullName");
        }
      },
    },
    [stage]
  );
}

export function useStageBuyCrypto() {
  const { wallet, stage, setStage, buyAmount, setBuyAmount } =
    useGlobalOnboardingState();

  useCopilotAdditionalInstructions(
    {
      instructions:
        "CURRENT STATE: You are now helping them buy some crypto with the buyCrypto action. Give a link to the wallet page at '/wallet' explaining they can review their wallet information.Tell the user we gifted them $5 in the newly created wallet. In a new paragraph tell them they can buy ETH, BTC or SOL with that $5. Make sure to use the amount that is provided in the response.  Make sure to use the currency that is provided in the response. wait for user to respond with an amount and currency.  Once you have all the information run the approveBuyCrypto action to get users approval to buy the crypto.",
      available: stage === "buyCrypto" && !buyAmount ? "enabled" : "disabled",
    },
    [stage]
  );

  useCopilotAdditionalInstructions(
    {
      instructions:
        "CURRENT STATE: You are now waiting for the user to approve the buy crypto action. preview the buyAmount (currency and amount in bold like: $10 worth of ETH not 10 ETH. We are buting crypto using usd.) and wait for the user to approve the buy crypto action and ask them whether they would like to buy the crypto.",
      available: stage === "buyCrypto" && buyAmount ? "enabled" : "disabled",
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

  useCopilotReadable(
    {
      description: "Buy Amount",
      value: buyAmount,
      available: buyAmount ? "enabled" : "disabled",
    },
    [buyAmount]
  );

  useCopilotAction(
    {
      name: "buyCrypto",
      description: "Help the user buy crypto currency.",
      available: stage === "buyCrypto" && !buyAmount ? "enabled" : "disabled",
      parameters: [
        {
          name: "amount",
          type: "number",
          description:
            "The amount of crypto to buy. Make sure to use the amount that is provided in the response.",
        },
        {
          name: "currency",
          type: "string",
          description:
            "The currency to buy. Make sure to use the currency that is provided in the response.",
        },
      ],
      handler: (response) => {
        setBuyAmount({
          amount: response.amount,
          currency: response.currency as CryptoCurrency,
        });
      },
    },
    [stage]
  );

  useCopilotAction(
    {
      name: "reviewBuyCrypto",
      description: "Wait for approval from the user to buy crypto.",
      available: stage === "buyCrypto" && buyAmount ? "enabled" : "disabled",
      parameters: [
        {
          name: "isUserWantsToBuyCrypto",
          type: "boolean",
          description: "Whether the user would like to buy the crypto.",
        },
      ],
      handler: (response) => {
        console.log("response", response);
        if (response.isUserWantsToBuyCrypto) {
          setStage("createRule");
        } else {
          setStage("getFullName");
        }
      },
    },
    [stage, buyAmount]
  );
}
