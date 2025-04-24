import { PageWrapper } from "@/components/page-wrapper";
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";
import { useEffect } from "react";
import { OnboardingChat } from "@/copilot/onboarding-chat/chat";
import { GlobalOnboardingStateProvider } from "@/copilot/onboarding-chat/states/use-global-state";

export default function Dashboard() {
  // const { data, isLoading, error } = useQuery({
  //   queryKey: ["homeData"],
  //   queryFn: () => getJSON("/"),
  // });

  useEffect(() => {
    console.log("stage__getContactInfo");
  }, []);

  return (
    <PageWrapper title="Dashboard">
      <div className="container mx-auto px-4 py-8">
        <p className="mb-4">Welcome to your dashboard</p>

        <CopilotKit
          threadId="123"
          publicApiKey={import.meta.env.VITE_COPILOT_PUBLIC_KEY}
        >
          <GlobalOnboardingStateProvider>
            <OnboardingChat />
          </GlobalOnboardingStateProvider>
        </CopilotKit>
      </div>
    </PageWrapper>
  );
}
