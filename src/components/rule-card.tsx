import { format } from "date-fns";
import {
  ArrowRight,
  Calendar,
  Clock,
  Repeat,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rule } from "@/types/core";

interface RuleCardProps {
  rule: Rule;
}

export function RuleCard({ rule }: RuleCardProps) {
  const isRecurringRule = rule.frequency && rule.toWalletAddress;
  const isTradingRule = rule.threshold && rule.thresholdDirection;

  return (
    <Card className="w-full hover:shadow-lg transition-shadow p-0 max-w-md">
      <CardContent className="p-4 space-y-2">
        {/* Header + Currency Exchange Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg">
            <span>
              {rule.fromCurrency} {rule.fromAmount}
            </span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span>{rule.toCurrency ? rule.toCurrency : "?"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Badge
              variant={rule.status === "active" ? "default" : "secondary"}
              className="h-5"
            >
              {rule.status}
            </Badge>
            <Badge variant="outline" className="h-5">
              {isRecurringRule ? "Recurring" : "Trading"}
            </Badge>
          </div>
        </div>

        {/* Rule Details + Dates in one row */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
            {isRecurringRule && (
              <>
                <div className="flex items-center gap-1">
                  <Repeat className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="capitalize">{rule.frequency}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Wallet className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="font-mono text-xs">
                    {rule.toWalletAddress?.slice(0, 4)}...
                    {rule.toWalletAddress?.slice(-4)}
                  </span>
                </div>
              </>
            )}
            {isTradingRule && (
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                <span>
                  {rule.thresholdDirection === "above" ? ">" : "<"} $
                  {rule.threshold}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {rule.startDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(rule.startDate), "MM/dd/yy")}</span>
              </div>
            )}
            {rule.endDate && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{format(new Date(rule.endDate), "MM/dd/yy")}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
