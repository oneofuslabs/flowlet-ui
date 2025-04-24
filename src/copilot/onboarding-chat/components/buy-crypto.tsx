import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CryptoCurrencyAmount } from "../states/use-global-state";

export const BuyCrypto = ({
  onCancel,
  onConfirm,
  onValueChange,
  buyAmount,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  onValueChange: (value: CryptoCurrencyAmount) => void;
  buyAmount: CryptoCurrencyAmount | null;
}) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Buy Cryptocurrency</CardTitle>
        <CardDescription>
          You have $5.00 USD available to purchase cryptocurrency. Choose the
          amount and type of crypto you'd like to buy.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <div className="space-y-2 flex-3">
            <label className="text-sm font-medium">Amount (USD)</label>
            <Input
              type="number"
              placeholder="Enter amount in USD"
              min="0.01"
              max="5.00"
              step="0.01"
              value={buyAmount?.amount || ""}
              onChange={(e) =>
                onValueChange({
                  currency: buyAmount?.currency || "ETH",
                  amount: parseFloat(e.target.value),
                })
              }
              className="font-mono"
            />
          </div>
          <div className="space-y-2 flex-2">
            <label className="text-sm font-medium">Select Cryptocurrency</label>
            <Select
              value={buyAmount?.currency || "ETH"}
              onValueChange={(value) =>
                onValueChange({
                  amount: buyAmount?.amount || 0,
                  currency: value as "ETH" | "BTC" | "SOL",
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a cryptocurrency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                <SelectItem value="SOL">Solana (SOL)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {buyAmount?.amount && buyAmount?.currency && (
          <div className="p-4 bg-muted rounded-lg">
            <p className="font-medium">Transaction Summary</p>
            <p className="text-sm text-muted-foreground mt-1">
              You will receive approximately:{" "}
              {(
                buyAmount.amount /
                (buyAmount.currency === "ETH"
                  ? 2200
                  : buyAmount.currency === "BTC"
                  ? 44000
                  : 20)
              ).toFixed(8)}{" "}
              {buyAmount.currency}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onCancel}>
          Back
        </Button>
        <Button
          disabled={
            !buyAmount?.amount || buyAmount.amount > 5 || buyAmount.amount <= 0
          }
          onClick={onConfirm}
        >
          Confirm Purchase
        </Button>
      </CardFooter>
    </Card>
  );
};
