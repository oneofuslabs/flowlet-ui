"use client";
import {
  useCopilotAction,
  useCopilotChat,
  useCopilotReadable,
} from "@copilotkit/react-core";
import { useEffect, useRef, useState } from "react";
import { MessageRole } from "@copilotkit/runtime-client-gql";
import { TextMessage } from "@copilotkit/runtime-client-gql";
import { CopilotChat } from "@copilotkit/react-ui";
import { WalletBalance, WalletInfo } from "../../components/wallet-info";
import { useAssistant } from "@/copilot/flowlet-assistant/context";
import { TransactionCard } from "@/components/transaction-card";
import { postJSON } from "@/utils/loaders";
import { RuleCard } from "@/components/rule-card";

export const FlowletAssistant = () => {
  const { appendMessage, isLoading } = useCopilotChat();
  const intitialMessage = useRef(false);
  const { wallet, profile, transactions, rules, refetchConfig, exchangeRates } =
    useAssistant();

  const [txLink, setTxLink] = useState("");
  const [swapDone, setSwapDone] = useState(false);

  useCopilotReadable(
    {
      description: "User Profile",
      value: profile,
      available: "enabled",
    },
    [profile]
  );

  useEffect(() => {
    console.log({ profile, wallet });
    if (intitialMessage.current || isLoading || !profile) return;
    intitialMessage.current = true;
    setTimeout(() => {
      appendMessage(
        new TextMessage({
          content: `Hi, ${profile?.full_name.split(" ")[0]}.`,
          role: MessageRole.Assistant,
        })
      );
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, wallet]);

  useEffect(() => {
    console.log({ txLink });
    if (txLink === "") return;
    appendMessage(
      new TextMessage({ content: txLink, role: MessageRole.Assistant })
    );
  }, [txLink]);

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
    name: "showTransactions",
    description: "Show user their transaction history",
    available: transactions ? "enabled" : "disabled",
    render: () => {
      return (
        <div className="flex flex-col gap-4">
          {transactions?.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}
        </div>
      );
    },
  });

  useCopilotAction({
    name: "showRules",
    description: "Show user their active rules",
    available: rules ? "enabled" : "disabled",
    render: () => {
      return (
        <div className="flex flex-col gap-4">
          {rules?.map((rule) => (
            <RuleCard key={rule.id} rule={rule} />
          ))}
        </div>
      );
    },
  });

  useCopilotAction({
    name: "recurringPayments",
    description: "Help user create recurring payments",
    available: "enabled",
    parameters: [
      {
        name: "fromAmount",
        type: "number",
        description: "The amount to pay",
      },
      {
        name: "fromCurrency",
        type: "string",
        description: "The currency to pay in",
      },
      {
        name: "frequency",
        type: "string",
        description: "The frequency to pay in",
      },
      {
        name: "toWalletAddress",
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
    handler: async (response) => {
      await postJSON("/api/v1/trading/rules", response);
      await refetchConfig();
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
          name: "toAmount",
          type: "number",
          description: "The amount to trade to",
        },
        {
          name: "didUserConfirm",
          type: "boolean",
          description: "Whether the user reviewed and confirmed the trade",
        },
      ],
      handler: async (response) => {
        //await postJSON("/api/v1/trading/transactions", response);
        const apiResponse = await postJSON("/api/v1/trade/swap", response);
        if (apiResponse.txHashLink) {
          setTxLink(apiResponse.txHashLink);
        }
        await refetchConfig();
        console.log("response", response);
        setSwapDone(true);
      },
      render: ({ status }) => {
        if (status === "inProgress" || !swapDone) {
          return <div>Trading...</div>;
        }
        return (
          <a
            href={txLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            View on explorer
          </a>
        );
      },
    },
    [txLink, swapDone]
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
    handler: async (response) => {
      await postJSON("/api/v1/trading/rules", response);
      await refetchConfig();
      console.log("response", response);
    },
  });

  useCopilotAction({
    name: "transferCrypto",
    description: "Transfer crypto to another wallet",
    available: "enabled",
    parameters: [
      {
        name: "tokenName",
        type: "string",
        description: "The name of the token to transfer",
      },
      {
        name: "amount",
        type: "number",
        description: "The amount of the token to transfer",
      },
      {
        name: "toWalletAddress",
        type: "string",
        description: "The wallet address to transfer the token to",
      },
      {
        name: "didUserConfirm",
        type: "boolean",
        description: "Whether the user reviewed and confirmed the transfer",
      },
    ],
    handler: async (response) => {
      await postJSON("/api/v1/transfer/_token", {
        ...response,
        tokenAddress:
          exchangeRates?.[response.tokenName as keyof typeof exchangeRates]
            ?.tokenAddress || "",
      });
      await refetchConfig();
    },
  });

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] w-full rounded-xl shadow-sm border border-neutral-200">
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

<b>Trading:</b> Trade crypto, create smart rules around trading, transfer crypto to another wallet, and set up recurring payments.

<b>Information:</b> View your wallet balance, wallet address and private key, transaction history, and active rules.

Let me know how I can assist you today!
---

You are now here to help the user with crypto operations. These operations are as follows:
1. TRADING
  - Trade crypto
  - Transfer crypto to another wallet
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

TRANSFERRING CRYPTO
The user can transfer crypto to another wallet. You are to analyze the tokenName, amount, and toWalletAddress, and run the transferCrypto action with the response.

Once you have all the paraemters, summarize the operation and ask the user for confirmation before doing anything.

TRADING CRYPTO
The user can trade crypto between two currencies. kinda like "Let's swap 1 ETH to USDC", or "Let's sell 10 USDC and buy btc" or "Let's buy 10 SOL". You are to analayze the currency that the trade is from and to, calculate the toAmount based on the fromAmount and the exchange rate, and run the tradeCrypto action with the response.

EXCHANGE RATES
The type of exchange rates is as follows:
{
  ETH: number,
  BTC: number,
  SOL: number,
  USDC: number,
}

Each number can be a floating point number. You are provided this data through the useCopilotReadable hook with the description "Exchange Rates".

It's a record of the amount of the currency you need to spend to buy 1 USDC.
So if the user wants to buy 10 SOL, you need to calculate the amount in USDC that the user needs to spend to buy 10 SOL. Which is 10 / (0.0058 / 1) = 172.41 USDC. or if they want to sell 10 SOL and buy btc, you need to calculate the amount in btc that the user will get. Which is 10 / (0.0058 / 0.0000097) = 0.016724137931034482 BTC.

FORMULA TO CALCULATE THE EXCHANGE RATES

toCurrencyAmount = fromCurrencyAmount * (toCurrencyExchangeRate / fromCurrencyExchangeRate)

DO NOT Explain the exchange rates to the user. Just calculate it and show the result. The response should be like: "Do you want to proceed with this trade: selling 5 SOL to receive approximately 0.37069 ETH?"


DETAILS
- Do not print the wallet information in your responses. If user asks for it, show the wallet information using the walletInfo action. 
- Always say "Above is your wallet information. What else do you want to do?" after you run the walletInfo action.

- Do not show the wallet balance in your responses. If user asks for it, show the wallet balance using the walletBalance action.
- Always say "Above is your wallet balance. What else do you want to do?" after you run the walletBalance action.

- Do not show the transaction history in your responses. If user asks for it, show the transaction history using the showTransactions action.
- Always say "Above is your transaction history. What else do you want to do?" after you run the showTransactions action.

- Do not show the rules in your responses. If user asks for it, show the rules using the showRules action.
- Always say "Above is a list of your rules. What else do you want to do?" after you run the showRules action.


NOTICES
- DO NOT mention the word "stage" or "state" in your responses.
- DO NOT mention the word "state machine" in your responses.
- DO NOT answer questions that are not related to the current stage.
- DO NOT answer math questions.`;
