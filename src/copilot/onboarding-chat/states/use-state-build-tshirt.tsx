import {
  useCopilotAction,
  useCopilotReadable,
  useCopilotAdditionalInstructions,
} from "@copilotkit/react-core";

import { Tshirt, useGlobalState } from "./use-global-state";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const tshirts = [
  {
    id: 1,
    name: "T-Shirt blue",
    price: 10,
  },
  {
    id: 2,
    name: "T-Shirt red",
    price: 100,
  },
  {
    id: 3,
    name: "T-Shirt green",
    price: 80,
  },
  {
    id: 4,
    name: "T-Shirt yellow",
    price: 50,
  },
];

export function useStageBuildTshirt() {
  const { setSelectedTshirt, stage, setStage } = useGlobalState();

  // Conditionally add additional instructions for the agent's prompt.
  useCopilotAdditionalInstructions(
    {
      instructions:
        "CURRENT STATE: You are now helping the user select a tshirt. TO START, say 'Thank you for that information! What sort of tshirt would you like to see?'. If you have a tshirt in mind, give a reason why you recommend it and then call the 'showTshirt' action with the tshirt you have in mind or show multiple tshirts with the 'showMultipleTshirts' action. Never list the tshirts you have in mind, just show them. Do ",
      available: stage === "buildTshirt" ? "enabled" : "disabled",
    },
    [stage]
  );

  // Conditionally add additional readable information for the agent's prompt.
  useCopilotReadable(
    {
      description: "Tshirt Inventory",
      value: tshirts,
      available: stage === "buildTshirt" ? "enabled" : "disabled",
    },
    [stage]
  );

  // Conditionally add an action to show a single car.
  useCopilotAction(
    {
      name: "showTshirt",
      description:
        "Show a single tshirt that you have in mind. Do not call this more than once, show the first tshirt if you have multiple tshirts to show.",
      available: stage === "buildTshirt" ? "enabled" : "disabled",
      parameters: [
        {
          name: "tshirt",
          type: "object",
          description: "The tshirt to show",
          required: true,
          attributes: [
            { name: "id", type: "number" },
            { name: "name", type: "string" },
            { name: "price", type: "number" },
          ],
        },
      ],
      renderAndWaitForResponse: ({ args, status, respond }) => {
        const { tshirt } = args;
        return (
          <ShowTshirt
            tshirt={(tshirt as Tshirt) || ({} as Tshirt)}
            status={status}
            onSelect={() => {
              // Store the selected tshirt in the global state.
              setSelectedTshirt((tshirt as Tshirt) || ({} as Tshirt));

              // Let the agent know that the user has selected a car.
              respond?.(
                "User has selected a tshirt you can see it in your readables, the system will now move to the next state, do not call nextState."
              );

              // Move to the next stage, sellFinancing.
              setStage("getPaymentInfo");
            }}
            onReject={() =>
              respond?.(
                "User wants to select a different car, please stay in this state and help them select a different car"
              )
            }
          />
        );
      },
    },
    [stage]
  );

  // Conditionally add an action to show multiple cars.
  useCopilotAction(
    {
      name: "showMultipleTshirts",
      description:
        "Show a list of tshirts based on the user's query. Do not call this more than once. Call `showTshirt` if you only have a single tshirt to show.",
      parameters: [
        {
          name: "tshirts",
          type: "object[]",
          required: true,
          attributes: [
            { name: "id", type: "number" },
            { name: "name", type: "string" },
            { name: "price", type: "number" },
          ],
        },
      ],
      renderAndWaitForResponse: ({ args, status, respond }) => {
        return (
          <div>
            {args.tshirts?.map((tshirt) => (
              <ShowTshirt
                tshirt={tshirt}
                status={status}
                onSelect={() => {
                  // Store the selected tshirt in the global state.
                  setSelectedTshirt((tshirt as Tshirt) || ({} as Tshirt));

                  // Let the agent know that the user has selected a car.
                  respond?.(
                    "User has selected a tshirt you can see it in your readables, the system will now move to the next state, do not call nextState."
                  );

                  // Move to the next stage, sellFinancing.
                  setStage("getPaymentInfo");
                }}
                onReject={() =>
                  respond?.(
                    "User wants to select a different car, please stay in this state and help them select a different car"
                  )
                }
              />
            ))}
          </div>
        );
      },
    },
    [stage]
  );
}

const ShowTshirt = ({
  tshirt,
  onSelect,
  onReject,
}: {
  tshirt: Tshirt;
  status: string;
  onSelect: () => void;
  onReject: () => void;
}) => {
  // Return JSX element
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{tshirt.name || "T-Shirt Details"}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          Price: ${tshirt.price !== undefined ? tshirt.price.toFixed(2) : "N/A"}
        </p>
        {/* Add more details or image here if needed */}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onReject}>
          Reject
        </Button>
        <Button onClick={onSelect}>Accept</Button>
      </CardFooter>
    </Card>
  );
};
