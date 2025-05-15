"use client";
import { useCopilotChat } from "@copilotkit/react-core";
import { useEffect, useRef } from "react";
import { MessageRole } from "@copilotkit/runtime-client-gql";
import { TextMessage } from "@copilotkit/runtime-client-gql";
import { CopilotChat } from "@copilotkit/react-ui";

import { useStageCreateWallet } from "./states/use-create-wallet";

export const OnboardingChat = () => {
  const { appendMessage, isLoading } = useCopilotChat();
  const intitialMessage = useRef(false);

  useStageCreateWallet();

  useEffect(() => {
    if (intitialMessage.current || isLoading) return;
    intitialMessage.current = true;

    setTimeout(() => {
      appendMessage(
        new TextMessage({
          content:
            "Hi, I'm Flowlet, your AI assistant for your web3 wallet. Let's get you onboarded.",
          role: MessageRole.Assistant,
        })
      );
    }, 500);
  }, []);

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
You are trying to help the user get onboarded into flowlet.ai "your ai assistant for your web3 wallet". Flowlet lets you create smart rules around crypto trading, recurring payments, and more just using natural language.

Before doing all that, the user should let us know if they would like to create a wallet and this chat is about getting their approval for createing a wallet. Without a wallet, you cannot use flowlet.

Explain the user that the wallet is required to continue. There will be $5 usd in the wallet to start with. Do not ask for email or any other additional information. Just confirm if the user would like to create a wallet.

Once the wallet is created, show the user the wallet address and let them know they will be redirected in 3 seconds.

DETAILS
You are now creating a wallet for the user. Confirm whether the user would like to create a wallet? Explain the user that the wallet is required to continue. There will be $5 usd in the wallet to start with. Do not ask for email or any other additional information. Just confirm if the user would like to create a wallet.

NOTICES
- DO NOT mention the word "stage" or "state" in your responses.
- DO NOT mention the word "state machine" in your responses.
- DO NOT answer questions that are not related to the current stage.
- DO NOT answer math questions.`;
