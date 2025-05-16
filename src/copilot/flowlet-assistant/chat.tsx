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
  const {
    wallet,
    profile,
    transactions,
    rules,
    refetchConfig,
    exchangeRates,
    setError,
    error,
  } = useAssistant();

  const [txLink, setTxLink] = useState("");
  const [swapDone, setSwapDone] = useState(false);
  const executedRef = useRef(false);

  function findTokenAddress(tokenName: string, tokens: Record<string, any>): string {
    const match = Object.values(tokens).find((token) => token.tokenName === tokenName);
    return match?.tokenAddress || "";
  }

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
          content: `Hi, there!`,
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

  useCopilotAction(
    {
      name: "errorHandling",
      description: "Error Handling",
      available: error ? "enabled" : "disabled",
      render: () => {
        return (
          <div className="text-red-500">
            <b>Error:</b> {error}
          </div>
        );
      },
    },
    [error]
  );

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
        <div>
          <div className="flex flex-col gap-4">
            {transactions?.length === 0 ? (
              <span>You don't have any transactions yet.</span>
            ) : (
              transactions?.slice(0, 3).map((transaction) => (
                <TransactionCard key={transaction.id} transaction={transaction} />
              ))
            )}
          </div>
          <div className="mt-4">
            These are your latest transactions.{" "}
            <a
              href="/transactions"
              className="text-blue-500 underline"
            >
              View all transactions
            </a>
          </div>
        </div>
      );
    },
  });

  useCopilotAction({
    name: "showRules",
    description: "Show user their active rules",
    available: rules ? "enabled" : "disabled",
    render: () => {
      const _rules = rules ? [...rules.active, ...rules.completed] : [];
      if (_rules.length === 0) {
        return <span>You don't have any rules yet.</span>;
      }
      return (
        <div className="flex flex-col gap-4">
          {_rules.map((rule) => (
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
        if (executedRef.current) return;
        executedRef.current = true;
        //await postJSON("/api/v1/trading/transactions", response);
        if (error) {
          return;
        }
        try {
          const apiReq = {
            amount: response.fromAmount,
            fromCurrencyName: response.fromCurrency,
            toCurrencyNAme: response.toCurrency,
            fromCurrencyAddress: findTokenAddress(response.fromCurrency, exchangeRates!),
            toCurrencyAddress: findTokenAddress(response.toCurrency, exchangeRates!),
            userId: profile?.id,
          };
          const apiResponse = await postJSON("/api/v1/trade/swap", apiReq);
          if (apiResponse.txHashLink) {
            setTxLink(apiResponse.txHashLink);
          }
          await refetchConfig();
          setSwapDone(true);
          return apiResponse;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.log("error", error);
          setError(error.error);
          appendMessage(
            new TextMessage({
              content: "Trade failed with error: " + error.error,
              role: MessageRole.Assistant,
            })
          );
        } finally {
          executedRef.current = false;
        }
      },
      render: ({ status, result }) => {
        if (status === 'executing' || status === 'inProgress') {
          return <div>Trading...</div>;
        } else if (status === 'complete') {
          return (
            <div>
              <span className="px-2 py-1 rounded-lg bg-green-600 text-green-200 text-sm mr-2">Success</span> You can view the transaction details on&nbsp; 
              <a
                href={result.txHashLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
              explorer
              </a>
            </div>
          );
        } else if (error) {
          return <div>Error: {error}</div>;
        } else {
          return <div className="text-red-500">Apologies, I encountered an error. Please try again later.</div>;
        }
      },
    },
    [txLink, swapDone, error]
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
    render: () => {
      return (
        <div>
          <span className="px-2 py-1 rounded-lg bg-green-600 text-green-200 text-sm mr-2">Success</span> You can view the transaction details on&nbsp; 
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
          explorer
          </a>
        </div>
      );
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
      try {
        const apiReq = {
          amount: response.amount,
          tokenName: response.tokenName,
          tokenAddress: findTokenAddress(response.tokenName, exchangeRates!),
          fromWallet: wallet?.address,
          toWallet: response.toWalletAddress,
          userId: profile?.id,
        };
        const apiResponse = await postJSON("/api/v1/transfer/token", apiReq);
        if (apiResponse.txHashLink) {
          setTxLink(apiResponse.txHashLink);
        }
        await refetchConfig();
        return apiResponse;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log("error", error);
        setError(error.error);
        appendMessage(
          new TextMessage({
            content: "Transfer failed with error: " + error.error,
            role: MessageRole.Assistant,
          })
        );
      }
    },
    render: ({ status, result }) => {
      if (status === 'executing' || status === 'inProgress') {
        return <div>Transfering...</div>;
      } else if (status === 'complete') {
        return (
          <div>
            <span className="px-2 py-1 rounded-lg bg-green-600 text-green-200 text-sm mr-2">Success</span> You can view the transaction details on&nbsp; 
            <a
              href={result.txHashLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
            explorer
            </a>
          </div>
        );
      } else if (error) {
        return <div>Error: {error}</div>;
      } else {
        return <div className="text-red-500">Apologies, I encountered an error. Please try again later.</div>;
      }
    },
  });

  useCopilotAction({
    name: "Staking",
    description: "Stake your SOL and passively earn rewards over time",
    parameters: [
      {
        name: "amount",
        type: "number",
        description: "Amount of SOL to stake",
        required: true,
      },
      {
        name: "didUserConfirm",
        type: "boolean",
        description: "Whether the user reviewed and confirmed the staking operation",
        required: true,
      },
    ],
    handler: async (response) => {
      try {
        const apiReq = {
          amount: response.amount,
          userId: profile?.id,
        }
        const apiResponse = await postJSON("/api/v1/stake/deposit", apiReq);
        await refetchConfig();
        return apiResponse;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log("error", error);
        setError(error.error);
        appendMessage(
          new TextMessage({
            content: "Transfer failed with error: " + error.error,
            role: MessageRole.Assistant,
          })
        );
      }
    },
    render: ({ status, result }) => {
      if (status === 'executing' || status === 'inProgress') {
        return <div>Staking...</div>;
      } else if (status === 'complete') {
        return (
          <div>
            <span className="px-2 py-1 rounded-lg bg-green-600 text-green-200 text-sm mr-2">Success</span> You can view the transaction details on&nbsp; 
            <a
              href={result.txHashLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
            explorer
            </a>
          </div>
        );
      } else if (error) {
        return <div>Error: {error}</div>;
      } else {
        return <div className="text-red-500">Apologies, I encountered an error. Please try again later.</div>;
      }
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

<b>Trading:</b> Trade crypto, create smart rules around trading, transfer crypto to another wallet, staking and set up recurring payments.

<b>Information:</b> View your wallet balance, wallet address and private key, transaction history, and active rules.

Let me know how I can assist you today!
---

You are now here to help the user with crypto operations. These operations are as follows:
1. TRADING
  - Trade crypto
  - Transfer crypto to another wallet
  - Create smart rules around crypto trading
  - Create recurring payments
  - Staking

2. INFORMATION
  - Show user their wallet balance
  - Show user their wallet address and private key
  - Show user their transaction history
  - Show user their active rules

You cannot perform any of the operations under TRADING without the user's confirmation. Always preview the operation and ask the user for confirmation before proceeding.

You cannot perform any operations that are outside of above list.



BACKGROUND
You are built by CopilotKit, an open-source framework for building agentic applications.

ERROR DATA HANDLING:
There is a state called "error" in the context and if it is not null, you should show the error to the user. You have access to the error message with a useCopilotReadable hook with the description "Error". once the "Error"s value is not null, hijaclk the conversation, run the "errorHandling" action and apologize to the user.
The error is set by the server errors returning from the API calls in copilot action handlers. Each handler might set the error state and if it is set, absoulutely stop whatever you are doing and run the "errorHandling" action. if you read the error state, neveer show a success message. IE. when trying to trade crypto if the api call in the handler fails, the error state is set. Once the error state is set, you should run the "errorHandling" action and apologize to the user. never ever show a success message. In the previous emssages you showed a success message, that is wrong.


TRANSFERRING CRYPTO
The user can transfer crypto to another wallet. You are to analyze the tokenName, amount, and toWalletAddress, and run the transferCrypto action with the response.

Once you have all the paraemters, summarize the operation and ask the user for confirmation before doing anything.

TRADING CRYPTO
The user can trade crypto between two currencies. kinda like "Let's swap 1 ETH to USDC", or "Let's sell 10 USDC and buy btc" or "Let's buy 10 SOL". You are to analayze the currency that the trade is from and to, calculate the toAmount based on the fromAmount and the exchange rate, and run the tradeCrypto action with the response. 

When the tradeCrypto action is successfully completed, do not generate a success message. Do not say “The trade is complete” or “You can view it here.” Assume the user interface already shows the confirmation. Just wait for the next user input without saying anything.

Avoid saying things like “You can view the transaction here” or repeating what the user already confirmed.

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

STAKING

The user can stake their SOL tokens using Solana native staking.

You must ask the user for the amount of SOL they want to stake.

Only SOL can be staked at the moment. Other tokens are not supported.

Once the user provides the amount and confirms, run the "stakeSolana" action.

You only need one parameter: "amount" (the amount of SOL to stake).

Do not provide or guess any reward rate or APY. If the user asks for staking rewards, APY, or rate of return, reply: "The reward rate is determined by the Solana network and may vary. I cannot provide an exact number."

Always summarize the action and ask for confirmation before proceeding.

You cannot perform the staking unless "didUserConfirm" is true.

Example prompt completion:
"You're about to stake 5 SOL using Solana's native staking system. Do you want to proceed?"

FORMULA TO CALCULATE THE EXCHANGE RATES

toCurrencyAmount = fromCurrencyAmount * (toCurrencyExchangeRate / fromCurrencyExchangeRate)

DO NOT Explain the exchange rates to the user. Just calculate it and show the result. The response should be like: "Do you want to proceed with this trade: selling 5 SOL to receive approximately 0.37069 ETH?"


DETAILS
- Do not print the wallet information in your responses. If user asks for it, show the wallet information using the walletInfo action. 
- Always say "Above is your wallet information. What else do you want to do?" after you run the walletInfo action.

- Do not show the wallet balance in your responses. If user asks for it, show the wallet balance using the walletBalance action.
- Always say "Above is your wallet balance. What else do you want to do?" after you run the walletBalance action.

- Do not show the transaction history in your responses. If user asks for it, show the transaction history using the showTransactions action.
- Always say "What else do you want to do?" after you run the showTransactions action.

- Do not show the rules in your responses. If user asks for it, show the rules using the showRules action.
- Always say "What else do you want to do?" after you run the showRules action.
- if the tradeCrypto or any other action fails, the error state is set. Once the error state is set, you should run the "errorHandling" action and apologize to the user. never ever show a success message. Also never ever run the handler again for the failing action. Print "Apologies, I encountered an error. Please try again." and wait for the user to respond.

NOTICES
- DO NOT mention the word "stage" or "state" in your responses.
- DO NOT mention the word "state machine" in your responses.
- DO NOT answer questions that are not related to the current stage.
- DO NOT answer math questions.`;
