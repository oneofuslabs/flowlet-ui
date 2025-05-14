import { PageWrapper } from "@/components/page-wrapper";
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";
import { OnboardingChat } from "@/copilot/onboarding-chat/chat";
import { GlobalOnboardingStateProvider } from "@/copilot/onboarding-chat/states/use-global-state";
import { FlowletAssistant } from "@/copilot/flowlet-assistant/chat";
import { AssistantProvider } from "@/copilot/flowlet-assistant/context";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getJSON } from "@/utils/loaders";
import { Config, Profile } from "@/types/core";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const [currentChat, setCurrentChat] = useState<"flowlet" | "onboarding">(
    "onboarding"
  );

  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useQuery<Profile>({
    queryKey: ["profile"],
    queryFn: () => getJSON("/api/v1/users/profile"),
  });

  const {
    data: config,
    isLoading: configLoading,
    error: configError,
    refetch: refetchConfig,
  } = useQuery<Config>({
    queryKey: ["config"],
    queryFn: () => getJSON("/api/v1/users/config"),
  });

  if (profileLoading || configLoading) return <div>Loading...</div>;
  if (profileError || configError)
    return (
      <div>
        Error : {profileError?.message} {configError?.message}
      </div>
    );

  if (!profile || !config) return <div>Profile or Config not found</div>;

  return (
    <PageWrapper title="Flowlet Assistant">
      <div className="container mx-auto px-4 py-8">
        <Button variant="outline" onClick={() => setCurrentChat("flowlet")}>
          Flowlet
        </Button>
        <Button variant="outline" onClick={() => setCurrentChat("onboarding")}>
          Onboarding
        </Button>
        <div className="flex justify-end">
          <CopilotKit publicApiKey={import.meta.env.VITE_COPILOT_PUBLIC_KEY}>
            {config.wallet ? (
              <AssistantProvider
                profile={profile}
                config={config}
                refetchProfile={refetchProfile}
                refetchConfig={refetchConfig}
              >
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
