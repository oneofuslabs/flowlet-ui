import {
  useCopilotAction,
  useCopilotAdditionalInstructions,
  useCopilotReadable,
} from "@copilotkit/react-core";
import { useGlobalOnboardingState } from "./use-global-state";
import { useState } from "react";

export function useStageCreateRule() {
  const { stage, wallet } = useGlobalOnboardingState();
  const [rule] = useState<string | null>(null);

  useCopilotAdditionalInstructions(
    {
      instructions: `CURRENT STATE: You are now creating a rule for the user. Explain the user following in seperate paragraphs.
      - They can buy or sell (trade) the crypto they own.
      - They can create a rule to buy or sell (thresholdTrade) the crypto they own based on the threshold and currency they provide. Kinda like "If solana is above 100 USD, sell 10 USD of solana" or "If solana is below 80 USD, buy 10 USD of solana".
      - They can stake part of or all of their crypto, and unstake it if they have any staked, providing a crypto amount.

      Once they create a rule, you will ask them to review the rule and confirm it. Use bold text for important information.
    `,
      available: stage === "createRule" ? "enabled" : "disabled",
    },
    [stage]
  );

  useCopilotReadable(
    {
      description: "Wallet",
      value: wallet,
      available:
        wallet && (stage === "createRule" || stage === "reviewRule")
          ? "enabled"
          : "disabled",
    },
    [wallet, stage]
  );

  useCopilotAction(
    {
      name: "createRule",
      description: "Create a rule for the user",
      available: stage === "createRule" ? "enabled" : "disabled",
      parameters: [
        {
          name: "ruleType",
          type: "string",
          description: "The type of rule to create",
          enum: ["trade", "thresholdTrade", "stake", "recurringPayment"],
        },
        {
          name: "threshold",
          type: "number",
          description: "The threshold to create the rule for",
        },
        {
          name: "currency",
          type: "string",
          description: "The currency to create the rule for",
        },
        {
          name: "cryptoAmount",
          type: "number",
          description:
            "The crypto amount to create the rule for. positive number for buy and stake, negative number for sell and unstake",
        },
        {
          name: "destinationWalletAddress",
          type: "string",
          description: "The destination wallet address to create the rule for",
          required: rule === "recurringPayment",
        },
        {
          name: "recurringPaymentFrequency",
          type: "string",
          description: "The frequency to create the rule for",
          required: rule === "recurringPayment",
        },
        {
          name: "isUserWantsToCreateRule",
          type: "boolean",
          description:
            "Whether the user reviewed and confirmed the rule. Use bold text for important information.",
        },
      ],
      handler: (response) => {
        console.log("response", response);
      },
    },
    [stage]
  );
}
