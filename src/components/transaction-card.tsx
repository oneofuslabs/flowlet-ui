import { Transaction, CryptoCurrency } from "@/types/core";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { format } from "date-fns";

interface TransactionCardProps {
  transaction: Transaction;
}

const getCurrencyColor = (currency: CryptoCurrency) => {
  const colors = {
    BTC: "text-orange-500",
    ETH: "text-blue-500",
    SOL: "text-purple-500",
    USDT: "text-green-500",
  };
  return colors[currency];
};

export function TransactionCard({ transaction }: TransactionCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 p-0 max-w-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span
                  className={`text-lg font-bold ${getCurrencyColor(
                    transaction.fromCurrency
                  )}`}
                >
                  {transaction.fromAmount} {transaction.fromCurrency}
                </span>
                <ArrowRight className="h-4 w-4 text-gray-400" />
                <span
                  className={`text-lg font-bold ${getCurrencyColor(
                    transaction.toCurrency
                  )}`}
                >
                  {transaction.toAmount} {transaction.toCurrency}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {format(
                  new Date(transaction.transactionDate),
                  "MMM d, yyyy HH:mm"
                )}
              </span>
            </div>
          </div>
          <Badge
            variant={
              transaction.transactionStatus.toLowerCase() === "completed"
                ? "default"
                : "secondary"
            }
            className="capitalize"
          >
            {transaction.transactionStatus}
          </Badge>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
          <span
            className="truncate max-w-[200px]"
            title={transaction.transactionHash}
          >
            Hash: {transaction.transactionHash.slice(0, 8)}...
          </span>
          <Badge variant="outline" className="capitalize">
            {transaction.transactionType}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
