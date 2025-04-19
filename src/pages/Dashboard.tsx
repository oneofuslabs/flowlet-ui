import { PageWrapper } from "@/components/page-wrapper";
import { getJSON } from "@/utils/loaders";
import { useQuery } from "@tanstack/react-query";
import { CopilotKit } from "@copilotkit/react-core";
import { TshirtSalesChat } from "@/copilot/onboarding-chat/chat";
import "@copilotkit/react-ui/styles.css";
import { GlobalStateProvider } from "@/copilot/onboarding-chat/states/use-global-state";
import { useEffect } from "react";

export default function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["homeData"],
    queryFn: () => getJSON("/"),
  });

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
          <GlobalStateProvider>
            <TshirtSalesChat />
          </GlobalStateProvider>
        </CopilotKit>

        {isLoading && <p className="mb-4">Loading test data...</p>}
        {error && (
          <p className="mb-4 text-red-500">
            Error loading data: {error.message}
          </p>
        )}
        {data && (
          <div className="mb-4 p-4 mt-4 bg-gray-100 rounded">
            <h2 className="text-xl font-semibold mb-2">Data from API:</h2>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
