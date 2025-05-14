import { PageWrapper } from "@/components/page-wrapper";
import { Card } from "@/components/ui/card";
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
        {configLoading && (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2].map((i) => (
              <Card
                key={i}
                className="w-full h-[170px] animate-pulse bg-gray-100"
              />
            ))}
          </div>
        )}
        {config?.wallet && <WalletInfo wallet={config.wallet} />}
        {config?.wallet && (
          <WalletBalance balance={config.wallet.balance ?? null} />
        )}
      </div>
    </PageWrapper>
  );
}
