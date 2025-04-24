import {
  useCopilotAction,
  useCopilotAdditionalInstructions,
} from "@copilotkit/react-core";

import { useGlobalOnboardingState } from "./use-global-state";

export function useStageGetFullName() {
  const { setFullName, stage, setStage } = useGlobalOnboardingState();
  // Conditionally add additional instructions for the agent's prompt.
  useCopilotAdditionalInstructions(
    {
      instructions:
        "CURRENT STATE: You are now getting the full name of the user.",
      available: stage === "getFullName" ? "enabled" : "disabled",
    },
    [stage]
  );

  // Render the ContactInfo component and wait for the user's response.
  useCopilotAction(
    {
      name: "getFullName",
      description: "Get the full name of the user",
      available: stage === "getFullName" ? "enabled" : "disabled",
      parameters: [
        {
          name: "fullName",
          type: "string",
          description: "The full name of the user",
        },
      ],
      handler: async (response) => {
        console.log("Full name:", response);
        setFullName(response.fullName);
        setStage("createWallet");
      },
    },
    [stage]
  );
}
