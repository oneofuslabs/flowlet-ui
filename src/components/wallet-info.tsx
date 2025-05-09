import { Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";
import { CryptoCurrencyAmount } from "../copilot/onboarding-chat/states/use-global-state";

const handleCopy = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
};

const handleDownload = (wallet: {
  walletAddress: string;
  walletPrivateKey: string;
  balance: CryptoCurrencyAmount[] | null;
}) => {
  const element = document.createElement("a");
  const file = new Blob([JSON.stringify(wallet, null, 2)], {
    type: "application/json",
  });
  element.href = URL.createObjectURL(file);
  element.download = "flowlet-wallet.json";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const WalletInfo = ({
  wallet,
}: {
  wallet: {
    walletAddress: string;
    walletPrivateKey: string;
    balance: CryptoCurrencyAmount[] | null;
  };
}) => {
  return (
    <Card className="w-full max-w-2xl mx-auto gap-1">
      <CardHeader className="pb-1 gap-0">
        <div className="flex items-center justify-between">
          <CardTitle>Wallet Information</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDownload(wallet)}
            className="flex gap-2"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
        <CardDescription className="text-sm">
          🔒 Save this information securely and never share it with anyone.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Address
            </label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={wallet.walletAddress}
                className="font-mono h-9"
              />
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={() => handleCopy(wallet.walletAddress)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Private Key
            </label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={wallet.walletPrivateKey}
                className="font-mono h-9"
                type="password"
              />
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={() => handleCopy(wallet.walletPrivateKey)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const WalletBalance = ({
  balance,
}: {
  balance: CryptoCurrencyAmount[] | null;
}) => {
  return (
    <Card className="w-full max-w-[200px]  py-1 gap-1">
      <CardHeader className="pb-1 pt-2">
        <CardTitle className="text-base font-medium">
          Your Wallet Balance
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {balance?.map((balance) => (
          <div
            key={balance.currency}
            className="flex items-center justify-between py-1.5 border-b last:border-0 text-sm"
          >
            <span className="text-muted-foreground">{balance.currency}</span>
            <span className="font-mono">{balance.amount}</span>
          </div>
        ))}
        {(!balance || balance.length === 0) && (
          <div className="text-center py-2 text-sm text-muted-foreground">
            No balance to display
          </div>
        )}
      </CardContent>
    </Card>
  );
};
