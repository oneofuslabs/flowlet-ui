import { useGlobalState } from "@/copilot/onboarding-chat/states/use-global-state";
import {
  useCopilotAction,
  useCopilotAdditionalInstructions,
} from "@copilotkit/react-core";
// import { RenderProps } from "@copilotkit/react-ui"; // RenderProps is not exported, define props manually
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export interface UseGetContactInfoStateOptions {
  enabled: boolean;
  onNextState: () => void;
}

/**
  useStateGetContactInfo is a hook that will add this stage to the state machine. It is responsible for:
  - Getting the contact information of the user.
  - Storing the contact information in the global state.
  - Moving to the next stage, getPaymentInfo.
*/
export function useStageGetContactInfo() {
  const { setContactInfo, stage, setStage } = useGlobalState();

  // Conditionally add additional instructions for the agent's prompt.
  useCopilotAdditionalInstructions(
    {
      instructions:
        "CURRENT STATE: You are now getting the contact information of the user.",
      available: stage === "getContactInfo" ? "enabled" : "disabled",
    },
    [stage]
  );

  // Render the ContactInfo component and wait for the user's response.
  useCopilotAction(
    {
      name: "getContactInformation",
      description: "Get the contact information of the user",
      available: stage === "getContactInfo" ? "enabled" : "disabled",
      renderAndWaitForResponse: ({ status, respond }) => {
        return (
          <ContactInfo
            status={status}
            onSubmit={(name: string, email: string, phone: string) => {
              // Commit the contact information to the global state.
              setContactInfo({ name, email, phone });

              // Let the agent know that the user has submitted their contact information.
              respond?.("User has submitted their contact information.");

              // This move the state machine to the next stage, getPaymentInfo deterministically.
              setStage("getPaymentInfo"); // Corrected stage name
            }}
          />
        );
      },
    },
    [stage]
  );
}

interface ContactInfoProps {
  status: "complete" | "executing" | "inProgress";
  onSubmit: (name: string, email: string, phone: string) => void;
}

function ContactInfo({ status, onSubmit }: ContactInfoProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = () => {
    onSubmit(name, email, phone);
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
        <CardDescription>Please enter your contact details.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={status !== "executing"}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="Your email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status !== "executing"}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="Your phone number"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={status !== "executing"}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          onClick={handleSubmit}
          disabled={status !== "executing" || !name || !email || !phone}
        >
          {status === "executing" ? "Submit" : "Waiting..."}
        </Button>
      </CardFooter>
    </Card>
  );
}
