"use client";
import {
  useCopilotAction,
  useCopilotChat,
  useCopilotReadable,
} from "@copilotkit/react-core";
import { useEffect, useRef } from "react";
import { MessageRole } from "@copilotkit/runtime-client-gql";
import { TextMessage } from "@copilotkit/runtime-client-gql";
import { CopilotChat } from "@copilotkit/react-ui";
import { getJSON } from "@/utils/loaders";
import { useQuery } from "@tanstack/react-query";
import { WalletBalance, WalletInfo } from "../../components/wallet-info";
import { useAssistant } from "@/copilot/flowlet-assistant/context";

export const FlowletAssistant = () => {
  const { appendMessage, isLoading } = useCopilotChat();
  const intitialMessage = useRef(false);
  const { wallet } = useAssistant();

  const {
    data,
    isLoading: profileLoading,
    error,
  } = useQuery({
    queryKey: ["homeData"],
    queryFn: () => getJSON("/api/v1/users/profile"),
  });

  useCopilotReadable(
    {
      description: "User Profile",
      value: data?.profile as { full_name: string },
      available: "enabled",
    },
    [data]
  );

  useEffect(() => {
    if (intitialMessage.current || isLoading || !data) return;
    intitialMessage.current = true;
    setTimeout(() => {
      appendMessage(
        new TextMessage({
          content: `Hi, ${data.profile.full_name.split(" ")[0]}.`,
          role: MessageRole.Assistant,
        })
      );
    }, 500);
  }, [data]);

  useCopilotAction({
    name: "walletInfo",
    description: "Show user their wallet information",
    available: wallet ? "enabled" : "disabled",
    render: () => {
      return <WalletInfo wallet={wallet!} />;
    },
  });

  useCopilotAction({
    name: "walletBalance",
    description: "Show user their wallet balance",
    available: wallet ? "enabled" : "disabled",
    render: () => {
      return <WalletBalance balance={wallet?.balance ?? null} />;
    },
  });

  useCopilotAction({
    name: "recurringPayments",
    description: "Help user create recurring payments",
    available: "enabled",
    parameters: [
      {
        name: "amount",
        type: "number",
        description: "The amount to pay",
      },
      {
        name: "currency",
        type: "string",
        description: "The currency to pay in",
      },
      {
        name: "frequency",
        type: "string",
        description: "The frequency to pay in",
      },
      {
        name: "destinationWalletAddress",
        type: "string",
        description: "The wallet address to pay to",
      },
      {
        name: "startDate",
        type: "string",
        description: "The start date of the recurring payment",
      },
      {
        name: "didUserConfirm",
        type: "boolean",
        description: "Whether the user reviewed and confirmed the payment",
      },
    ],
    handler: (response) => {
      console.log("response", response);
    },
  });

  useCopilotAction(
    {
      name: "tradeCrypto",
      description: "Trade crypto between two currencies",
      available: "enabled",
      parameters: [
        {
          name: "fromAmount",
          type: "number",
          description: "The amount to trade",
        },

        {
          name: "fromCurrency",
          type: "string",
          description: "The crypto currency to trade",
        },
        {
          name: "toCurrency",
          type: "string",
          description: "The crypto currency to trade to",
        },
        {
          name: "didUserConfirm",
          type: "boolean",
          description: "Whether the user reviewed and confirmed the trade",
        },
      ],
      handler: (response) => {
        console.log("response", response);
      },
    },
    []
  );

  useCopilotAction({
    name: "tradeRules",
    description:
      "Help user create smart rules (automated trading) around crypto trading",
    available: "enabled",
    parameters: [
      {
        name: "fromCurrency",
        type: "string",
        description: "The crypto currency to trade",
      },
      {
        name: "fromAmount",
        type: "number",
        description:
          "The amount to trade can be a percentage or a fixed amount. if positive buy, if negative sell",
      },
      {
        name: "toCurrency",
        type: "string",
        description: "The crypto currency to trade to",
      },
      {
        name: "threshold",
        type: "number",
        description: "The threshold for the rule.",
      },
      {
        name: "thresholdDirection",
        type: "string",
        description: "The direction of the threshold",
        enum: ["above", "below"],
      },
      {
        name: "didUserConfirm",
        type: "boolean",
        description: "Whether the user reviewed and confirmed the rule",
      },
    ],
    handler: (response) => {
      console.log("response", response);
    },
  });

  if (error) return <div>Error: {error.message}</div>;

  if (profileLoading || !data) return <div>Loading...</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-150px)] w-full rounded-xl shadow-sm border border-neutral-200">
      <div className="flex-1 w-full rounded-xl overflow-y-auto">
        <CopilotChat className="h-full w-full" instructions={systemPrompt} />
      </div>
    </div>
  );
};

const systemPrompt = `
GOAL
Always start with the following message:

---
I'm your AI assistant for your web3 wallet. I can help you with the following operations:

<b>Trading:</b> Trade crypto, create smart rules around trading, and set up recurring payments.

<b>Information:</b> View your wallet balance, wallet address and private key, transaction history, and active rules.

Let me know how I can assist you today!
---

You are now here to help the user with crypto operations. These operations are as follows:
1. TRADING
  - Trade crypto
  - Create smart rules around crypto trading
  - Create recurring payments

2. INFORMATION
  - Show user their wallet balance
  - Show user their wallet address and private key
  - Show user their transaction history
  - Show user their active rules

You cannot perform any of the operations under TRADING without the user's confirmation. Always preview the operation and ask the user for confirmation before proceeding.

You cannot perform any operations that are outside of above list.



BACKGROUND
You are built by CopilotKit, an open-source framework for building agentic applications.

DETAILS
- Do not print the wallet information in your responses. If user asks for it, show the wallet information using the walletInfo action. 
- Always say "Above is your wallet information. What else do you want to do?" after you run the walletInfo action.

- Do not show the wallet balance in your responses. If user asks for it, show the wallet balance using the walletBalance action.
- Always say "Above is your wallet balance. What else do you want to do?" after you run the walletBalance action.


NOTICES
- DO NOT mention the word "stage" or "state" in your responses.
- DO NOT mention the word "state machine" in your responses.
- DO NOT answer questions that are not related to the current stage.
- DO NOT answer math questions.`;
