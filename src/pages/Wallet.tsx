import { PageWrapper } from "@/components/page-wrapper";
import { WalletBalance, WalletInfo } from "@/components/wallet-info";
import { Config } from "@/types/core";
import { getJSON } from "@/utils/loaders";
import { useQuery } from "@tanstack/react-query";
export default function Wallet() {
  const { data: config, isLoading: configLoading } = useQuery<Config>({
    queryKey: ["config"],
    queryFn: () => getJSON("/api/v1/users/config"),
  });

  return (
    <PageWrapper title="Wallet">
      <div className="flex flex-col gap-4">
        {configLoading && <div>Loading...</div>}
        {config?.wallet && <WalletInfo wallet={config.wallet} />}
        {config?.wallet && (
          <WalletBalance balance={config.wallet.balance ?? null} />
        )}
      </div>
    </PageWrapper>
  );
}
