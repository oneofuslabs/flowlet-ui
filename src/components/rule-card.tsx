import { Rule } from "@/types/core";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  ExternalLink,
  Calendar,
  Repeat,
  TrendingDown,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RuleCardProps {
  rule: Rule;
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

const getTypeIcon = (type: string) => {
  switch (type) {
    case "transfer":
      return <ArrowUpRight className="h-4 w-4" />;
    case "trade":
      return <ArrowRight className="h-4 w-4" />;
    default:
      return null;
  }
};

const getTypeBadgeColor = (type: string) => {
  switch (type) {
    case "transfer":
      return "bg-purple-100 text-purple-800";
    case "trade":
      return "bg-green-100 text-green-800";
    default:
      return "";
  }
};

const getTrendIcon = (direction: string | undefined) => {
  if (!direction) return null;

  return direction === "ABOVE" ? (
    <TrendingUp className="h-4 w-4 text-green-600" />
  ) : (
    <TrendingDown className="h-4 w-4 text-red-600" />
  );
};

export function RuleCard({ rule }: RuleCardProps) {
  const isActive = !rule.completed_at;
  const createdDate = new Date(rule.created_at);
  const startDate = rule.startDate ? new Date(rule.startDate) : null;

  const renderRuleDetails = () => {
    switch (rule.type) {
      case "transfer":
        return (
          <div className="flex items-center space-x-2">
            <span
              className={`text-lg font-bold ${getTokenColor(rule.currency)}`}
            >
              {rule.amount} {rule.currency}
            </span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-sm font-medium cursor-default truncate max-w-[120px]">
                    {rule.fromWallet?.slice(0, 6)}...
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="break-all">{rule.fromWallet}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-sm font-medium cursor-default truncate max-w-[120px]">
                    {rule.toWallet?.slice(0, 6)}...
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="break-all">{rule.toWallet}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      case "trade":
        return (
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">{rule.tradeType}</span>
            <span
              className={`text-lg font-bold ${getTokenColor(
                rule.fromCurrency
              )}`}
            >
              {rule.amount} {rule.fromCurrency}
            </span>
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <span
              className={`text-lg font-bold ${getTokenColor(rule.toCurrency)}`}
            >
              {rule.toCurrency}
            </span>
            {rule.tresholdDirection && (
              <div className="flex items-center gap-1 ml-2">
                <span className="text-sm font-medium">
                  {getTrendIcon(rule.tresholdDirection)}
                </span>
                <span className="text-sm font-medium">
                  ${rule.tresholdPrice}
                </span>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card
      className={`hover:shadow-lg transition-shadow duration-200 p-0 w-full ${
        isActive ? "" : "opacity-80"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex flex-col max-[960px]:flex-col min-[960px]:flex-row min-[960px]:items-center min-[960px]:justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div
                className={`p-2 rounded-full ${getTypeBadgeColor(rule.type)}`}
              >
                {getTypeIcon(rule.type)}
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              {renderRuleDetails()}

              <div className="flex flex-col gap-1 text-sm text-gray-500">
                <div className="flex items-start sm:items-center flex-col sm:flex-row">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Created: {format(createdDate, "MMM d, yyyy")}</span>
                  </div>

                  {rule.type === "transfer" && rule.frequency && startDate && (
                    <>
                      <span className="hidden sm:block mx-1">•</span>
                      <div className="flex items-center gap-1 mt-1 sm:mt-0">
                        <Repeat className="h-3.5 w-3.5" />
                        <span className="capitalize">
                          {rule.frequency}, starting{" "}
                          {format(startDate, "MMM d, yyyy")}
                        </span>
                      </div>
                    </>
                  )}

                  {rule.transaction?.txHash && (
                    <>
                      <span className="hidden sm:block mx-1">•</span>
                      <div className="flex items-center gap-1 mt-1 sm:mt-0">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge
                                variant="outline"
                                className="text-xs bg-gray-50 hover:bg-gray-100 py-0 h-5"
                              >
                                {rule.transaction.txHash.slice(0, 8)}...
                                {rule.transaction.txHash.slice(-4)}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-md break-all">
                              <p>{rule.transaction.txHash}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <a
                          href={rule.transaction.txHashLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700 inline-flex items-center"
                          title="View on Explorer"
                        >
                          <ExternalLink className="h-3.5 w-3.5 mr-1" /> Explorer
                        </a>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Status badges for mobile view */}
              <div className="flex items-center gap-2 mt-2 min-[960px]:hidden">
                <Badge
                  variant="outline"
                  className={`capitalize ${getTypeBadgeColor(rule.type)}`}
                >
                  {rule.type}
                </Badge>

                <Badge
                  variant={isActive ? "default" : "secondary"}
                  className="capitalize"
                >
                  {isActive ? "Active" : "Completed"}
                </Badge>
              </div>
            </div>
          </div>
          {/* Status badges for desktop view */}
          <div className="hidden min-[960px]:flex items-center gap-2 mt-4 min-[960px]:mt-0">
            <Badge
              variant="outline"
              className={`capitalize ${getTypeBadgeColor(rule.type)}`}
            >
              {rule.type}
            </Badge>

            <Badge
              variant={isActive ? "default" : "secondary"}
              className="capitalize"
            >
              {isActive ? "Active" : "Completed"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
