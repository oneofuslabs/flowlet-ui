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
import { CryptoCurrencyAmount, Wallet } from "@/types/core";

const handleCopy = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
};

const handleDownload = (wallet: Wallet) => {
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

// Add color mapping function for cryptocurrencies
const getCurrencyColor = (currency: string) => {
  const colors: Record<string, string> = {
    BTC: "text-orange-500",
    ETH: "text-blue-500",
    SOL: "text-purple-500",
    USDC: "text-green-500",
  };
  return colors[currency] || "text-gray-500";
};

export const WalletInfo = ({ wallet }: { wallet: Wallet }) => {
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
            Export
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
                value={wallet.address}
                className="font-mono h-9"
              />
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={() => handleCopy(wallet.address)}
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
    <Card className="w-full py-1 gap-1 hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-1 pt-2">
        <CardTitle className="text-base font-medium">
          Your Wallet Balance
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {balance?.map((balance) => (
          <div
            key={balance.currency}
            className="flex items-center justify-between py-2.5 border-b last:border-0"
          >
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  balance.currency === "BTC"
                    ? "bg-orange-500"
                    : balance.currency === "ETH"
                    ? "bg-blue-500"
                    : balance.currency === "SOL"
                    ? "bg-purple-500"
                    : "bg-green-500"
                }`}
              ></div>
              <span className="font-medium">{balance.currency}</span>
            </div>
            <span
              className={`text-lg font-bold ${getCurrencyColor(
                balance.currency
              )}`}
            >
              {balance.amount}
            </span>
          </div>
        ))}
        {(!balance || balance.length === 0) && (
          <div className="text-center py-4 text-sm text-muted-foreground">
            <span className="block mb-1">No balance to display</span>
            <span className="text-xs">Deposit funds to get started</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
