import { Download } from "lucide-react";
import { Card, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";

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
  onProceed,
  wallet,
}: {
  onProceed: () => void;
  wallet: { walletAddress: string; walletPrivateKey: string };
}) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Your Wallet Information</CardTitle>
        <CardDescription className="text-base">
          🔒 Important: Please save your wallet information securely. Your
          private key grants complete access to your wallet - never share it
          with anyone and store it in a safe place. Consider downloading the
          wallet file and keeping it in an encrypted storage.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Wallet Address</label>
          <div className="flex gap-2">
            <Input
              readOnly
              value={wallet.walletAddress}
              className="font-mono"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleCopy(wallet.walletAddress)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Private Key</label>
          <div className="flex gap-2">
            <Input
              readOnly
              value={wallet.walletPrivateKey}
              className="font-mono"
              type="password"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleCopy(wallet.walletPrivateKey)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => handleDownload(wallet)}
          className="flex gap-2"
        >
          <Download className="h-4 w-4" />
          Download Wallet
        </Button>
        <Button onClick={onProceed}>I've Saved My Wallet Info - Proceed</Button>
      </CardFooter>
    </Card>
  );
};
