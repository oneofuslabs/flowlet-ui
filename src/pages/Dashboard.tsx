import { PageWrapper } from "@/components/page-wrapper";
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";
// import { useEffect } from "react";
import { OnboardingChat } from "@/copilot/onboarding-chat/chat";
import { GlobalOnboardingStateProvider } from "@/copilot/onboarding-chat/states/use-global-state";
import { FlowletAssistant } from "@/copilot/flowlet-assistant/chat";
import { AssistantProvider } from "@/copilot/flowlet-assistant/context";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  // const { data, isLoading, error } = useQuery({
  //   queryKey: ["homeData"],
  //   queryFn: () => getJSON("/"),
  // });

  const [currentChat, setCurrentChat] = useState<"flowlet" | "onboarding">(
    "flowlet"
  );

  return (
    <PageWrapper title="Dashboard">
      <div className="container mx-auto px-4 py-8">
        <Button variant="outline" onClick={() => setCurrentChat("flowlet")}>
          Flowlet
        </Button>
        <Button variant="outline" onClick={() => setCurrentChat("onboarding")}>
          Onboarding
        </Button>
        <div className="flex justify-end">
          <CopilotKit publicApiKey={import.meta.env.VITE_COPILOT_PUBLIC_KEY}>
            {currentChat === "flowlet" ? (
              <AssistantProvider>
                <FlowletAssistant />
              </AssistantProvider>
            ) : (
              <GlobalOnboardingStateProvider>
                <OnboardingChat />
              </GlobalOnboardingStateProvider>
            )}
          </CopilotKit>
        </div>
      </div>
    </PageWrapper>
  );
}
