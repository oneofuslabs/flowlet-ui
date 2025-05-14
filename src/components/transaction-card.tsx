import { Transaction, TransactionType } from "@/types/core";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowUpRight, Lock, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TransactionCardProps {
  transaction: Transaction;
}

const getTokenColor = (token: string | undefined) => {
  const colors: Record<string, string> = {
    BTC: "text-orange-500",
    ETH: "text-blue-500",
    SOL: "text-purple-500",
    USDC: "text-green-500",
  };
  return token && colors[token] ? colors[token] : "text-gray-500";
};

const getTypeIcon = (type: TransactionType) => {
  switch (type) {
    case "stake":
      return <Lock className="h-4 w-4" />;
    case "transfer":
      return <ArrowUpRight className="h-4 w-4" />;
    case "trade":
      return <ArrowRight className="h-4 w-4" />;
    default:
      return null;
  }
};

const getTypeBadgeColor = (type: TransactionType) => {
  switch (type) {
    case "stake":
      return "bg-blue-100 text-blue-800";
    case "transfer":
      return "bg-purple-100 text-purple-800";
    case "trade":
      return "bg-green-100 text-green-800";
    default:
      return "";
  }
};

const getStatusBadgeVariant = (status: string | undefined) => {
  if (!status) return "secondary";

  switch (status) {
    case "Active":
      return "default";
    case "Completed":
      return "secondary";
    case "Failed":
      return "destructive";
    case "Pending":
      return "outline";
    default:
      return "secondary";
  }
};

export function TransactionCard({ transaction }: TransactionCardProps) {
  const date = new Date(transaction.created_at);

  const renderTransactionDetails = () => {
    switch (transaction.type) {
      case "stake":
        return (
          <div className="flex items-center space-x-2">
            <span
              className={`text-lg font-bold ${getTokenColor(
                transaction.tokenName
              )}`}
            >
              {transaction.amount} {transaction.tokenName}
            </span>
            <span className="text-sm text-gray-500">
              Duration: {transaction.duration} days
            </span>
          </div>
        );
      case "transfer":
        return (
          <div className="flex items-center space-x-2">
            <span
              className={`text-lg font-bold ${getTokenColor(
                transaction.tokenName
              )}`}
            >
              {transaction.amount} {transaction.tokenName}
            </span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-sm font-medium cursor-default truncate max-w-[120px]">
                    {transaction.fromWallet?.slice(0, 6)}...
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="break-all">{transaction.fromWallet}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-sm font-medium cursor-default truncate max-w-[120px]">
                    {transaction.toWallet?.slice(0, 6)}...
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="break-all">{transaction.toWallet}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      case "trade":
        return (
          <div className="flex items-center space-x-2">
            <span
              className={`text-lg font-bold ${getTokenColor(
                transaction.fromCurrency
              )}`}
            >
              {transaction.amount} {transaction.fromCurrency}
            </span>
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <span
              className={`text-lg font-bold ${getTokenColor(
                transaction.toCurrency
              )}`}
            >
              {transaction.toCurrency}
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 p-0 w-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div
                className={`p-2 rounded-full ${getTypeBadgeColor(
                  transaction.type
                )}`}
              >
                {getTypeIcon(transaction.type)}
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              {renderTransactionDetails()}

              {/* Custom responsive breakpoint for date and hash */}
              <div className="flex flex-col gap-1 text-sm text-gray-500">
                <div className="flex items-start sm:items-center flex-col sm:flex-row">
                  <span>{format(date, "MMM d, yyyy HH:mm")}</span>

                  <span className="hidden sm:block mx-1">•</span>

                  <div className="flex items-center gap-1 mt-1 sm:mt-0">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge
                            variant="outline"
                            className="text-xs bg-gray-50 hover:bg-gray-100 py-0 h-5"
                          >
                            {transaction.txHash.slice(0, 8)}...
                            {transaction.txHash.slice(-4)}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-md break-all">
                          <p>{transaction.txHash}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <a
                      href={transaction.txHashLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 inline-flex items-center"
                      title="View on Explorer"
                    >
                      <ExternalLink className="h-3.5 w-3.5 mr-1" /> Explorer
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Always show transaction type pill */}
            <Badge
              variant="outline"
              className={`capitalize ${getTypeBadgeColor(transaction.type)}`}
            >
              {transaction.type}
            </Badge>

            {/* Show status pill if available */}
            {transaction.status && (
              <Badge
                variant={getStatusBadgeVariant(transaction.status)}
                className="capitalize"
              >
                {transaction.status}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
