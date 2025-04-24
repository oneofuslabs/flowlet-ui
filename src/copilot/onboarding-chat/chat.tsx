"use client";
import { useCopilotChat } from "@copilotkit/react-core";
import { useStageGetFullName } from "./states/use-get-full-name";
import { useEffect, useRef } from "react";
import { MessageRole } from "@copilotkit/runtime-client-gql";
import { TextMessage } from "@copilotkit/runtime-client-gql";
import { CopilotChat } from "@copilotkit/react-ui";
import { cn } from "@/lib/utils";
import {
  useStageBuyCrypto,
  useStageCreateWallet,
} from "./states/use-create-wallet";
import { useStageShowWalletInfo } from "./states/use-create-wallet";
export const OnboardingChat = () => {
  const { appendMessage, isLoading } = useCopilotChat();
  const intitialMessage = useRef(false);

  // init stages
  useStageGetFullName();
  useStageCreateWallet();
  useStageShowWalletInfo();
  useStageBuyCrypto();

  useEffect(() => {
    if (intitialMessage.current || isLoading) return;

    setTimeout(() => {
      appendMessage(
        new TextMessage({
          content:
            "Hi, I'm Flowlet, your AI assistant for your web3 wallet. First, let's get your full name before we get started.",
          role: MessageRole.Assistant,
        })
      );
      intitialMessage.current = true;
    }, 500);
  }, [intitialMessage, appendMessage, isLoading]);

  return (
    <div className="flex flex-col h-[600px] w-full rounded-xl shadow-sm border border-neutral-200">
      <div className={cn("flex-1 w-full rounded-xl overflow-y-auto")}>
        <CopilotChat className="h-full w-full" instructions={systemPrompt} />
      </div>
    </div>
  );
};

const systemPrompt = `
GOAL
You are trying to help the user get onboarded into flowlet.ai your ai assistant for your web3 wallet. Flowlet let you create smart rules around crypto trading, recurring payments, and more just using natural language.

The user will be going through a series of stages to accomplish this goal. Please help
them through the process with their tools and data keeping in mind the current stage of the interaction. Do not proceed to the next
stage until the current stage is complete. You must take each stage one at a time, do not skip any stages.

BACKGROUND
You are built by CopilotKit, an open-source framework for building agentic applications.

DETAILS
You will be going through a series of stages to get the user onboarded into flowlet.ai. Each stage will have its own unique instructions, tools and data. Please evaluate your current stage
before responding. Any additional instructions provided in the stage should be followed with the highest priority. DO NOT RESPOND WITH DATA YOU DO NOT HAVE ACCESS TO.
If you cannot perform an action, do not attempt to perform it, just let the know that they cannot do that and reiterate the instructions for the current stage.

NOTICES
- DO NOT mention the word "stage" or "state" in your responses.
- DO NOT mention the word "state machine" in your responses.
- DO NOT answer questions that are not related to the current stage.
- DO NOT answer math questions.`;
