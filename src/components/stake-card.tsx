import { Stake, StakeStatus } from "@/types/core";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Lock } from "lucide-react";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { postJSON } from "@/utils/loaders";
import { useQueryClient } from "@tanstack/react-query";

interface StakeCardProps {
  stake: Stake;
  userId: string;
  refetchStakes: () => void;
}

const getTokenColor = (token: string) => {
  const colors: Record<string, string> = {
    BTC: "text-orange-500",
    ETH: "text-blue-500",
    SOL: "text-purple-500",
    USDC: "text-green-500",
  };
  return colors[token] ? colors[token] : "text-gray-500";
};

const getStatusBadgeVariant = (status: StakeStatus) => {
  switch (status) {
    case "delegated":
      return "default";
    case "withdrawn":
      return "secondary";
    default:
      return "secondary";
  }
};

const getStatusLabel = (status: StakeStatus) => {
  switch (status) {
    case "delegated":
      return "Active";
    case "withdrawn":
      return "Completed";
    default:
      return status;
  }
};

export function StakeCard({ stake, userId }: StakeCardProps) {
  const date = new Date(stake.created_at);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const queryClient = useQueryClient();

  const handleWithdraw = async () => {
    try {
      setIsWithdrawing(true);
      await postJSON("/api/v1/stake/withdraw", {
        stakeId: stake.id,
        userId,
      });
      // Invalidate stakes query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["stakes"] });
    } catch (error) {
      console.error("Failed to withdraw stake:", error);
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 p-0 w-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="p-2 rounded-full bg-blue-100 text-blue-800">
                <Lock className="h-4 w-4" />
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <span
                  className={`text-lg font-bold ${getTokenColor(
                    stake.tokenName
                  )}`}
                >
                  {stake.amount} {stake.tokenName}
                </span>
              </div>

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
                            {stake.txHash.slice(0, 8)}...
                            {stake.txHash.slice(-4)}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-md break-all">
                          <p>{stake.txHash}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <a
                      href={`https://solscan.io/tx/${stake.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 inline-flex items-center"
                      title="View on Explorer"
                    >
                      <ExternalLink className="h-3.5 w-3.5 mr-1" /> Explorer
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs text-gray-500">Validator:</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-xs font-medium cursor-default truncate max-w-[120px]">
                          {stake.validator.slice(0, 8)}...
                          {stake.validator.slice(-4)}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="break-all">{stake.validator}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="capitalize bg-blue-100 text-blue-800"
              >
                stake
              </Badge>

              <Badge
                variant={getStatusBadgeVariant(stake.status)}
                className="capitalize"
              >
                {getStatusLabel(stake.status)}
              </Badge>
            </div>

            {stake.status === "delegated" && (
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={handleWithdraw}
                disabled={isWithdrawing}
              >
                {isWithdrawing ? "Processing..." : "Withdraw"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
