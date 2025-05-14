import { PageWrapper } from "@/components/page-wrapper";
import { postJSON } from "@/utils/loaders";
import { useQuery } from "@tanstack/react-query";
import { TransactionCard } from "@/components/transaction-card";
import { Transaction, TransactionType } from "@/types/core";
import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

type SortField = "date" | "status" | "type" | "token";
type SortOrder = "asc" | "desc";

export default function Transactions() {
  const [typeFilter, setTypeFilter] = useState<TransactionType | "all">("all");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const { data: transactionData, isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: () =>
      postJSON("/api/v1/transaction/all", {
        walletAddress: "DG34bJWRt5CM2dVdi6b9mXzmMZRmBPhEm3UcUNEhNnab",
      }),
  });

  const filteredAndSortedTransactions = useMemo(() => {
    if (!transactionData?.transactions) return [];

    let filtered = [...transactionData.transactions] as Transaction[];

    if (typeFilter !== "all") {
      filtered = filtered.filter((tx) => tx.type === typeFilter);
    }

    let compareResult = 0;

    return filtered.sort((a, b) => {
      switch (sortField) {
        case "date":
          compareResult =
            sortOrder === "asc"
              ? new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime()
              : new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime();
          break;
        case "type":
          compareResult =
            sortOrder === "asc"
              ? a.type.localeCompare(b.type)
              : b.type.localeCompare(a.type);
          break;
        case "status":
          if (!a.status || !b.status) {
            compareResult = 0;
          } else {
            compareResult =
              sortOrder === "asc"
                ? a.status.localeCompare(b.status)
                : b.status.localeCompare(a.status);
          }
          break;
        case "token": {
          const aToken = a.tokenName || a.fromCurrency || "";
          const bToken = b.tokenName || b.fromCurrency || "";
          compareResult =
            sortOrder === "asc"
              ? aToken.localeCompare(bToken)
              : bToken.localeCompare(aToken);
          break;
        }
      }

      return compareResult;
    });
  }, [transactionData, typeFilter, sortField, sortOrder]);

  return (
    <PageWrapper title="Transactions">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-0">
          <div className="flex gap-4 items-center flex-wrap">
            <div className="space-y-2">
              <Label className="block mb-2">Type</Label>
              <div className="flex gap-2 flex-wrap">
                <Badge
                  variant={typeFilter === "all" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setTypeFilter("all")}
                >
                  All
                </Badge>
                <Badge
                  variant={typeFilter === "stake" ? "default" : "outline"}
                  className={`cursor-pointer ${
                    typeFilter !== "stake"
                      ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                      : ""
                  }`}
                  onClick={() => setTypeFilter("stake")}
                >
                  Stake
                </Badge>
                <Badge
                  variant={typeFilter === "transfer" ? "default" : "outline"}
                  className={`cursor-pointer ${
                    typeFilter !== "transfer"
                      ? "bg-purple-100 text-purple-800 hover:bg-purple-200"
                      : ""
                  }`}
                  onClick={() => setTypeFilter("transfer")}
                >
                  Transfer
                </Badge>
                <Badge
                  variant={typeFilter === "trade" ? "default" : "outline"}
                  className={`cursor-pointer ${
                    typeFilter !== "trade"
                      ? "bg-green-100 text-green-800 hover:bg-green-200"
                      : ""
                  }`}
                  onClick={() => setTypeFilter("trade")}
                >
                  Trade
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-row gap-4 items-end">
            <div className="w-28">
              <Label htmlFor="sort-field" className="mb-2">
                Sort By
              </Label>
              <Select
                value={sortField}
                onValueChange={(value) => setSortField(value as SortField)}
              >
                <SelectTrigger id="sort-field">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="type">Type</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="token">Token</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-28">
              <Label htmlFor="sort-order" className="mb-2">
                Order
              </Label>
              <Select
                value={sortOrder}
                onValueChange={(value) => setSortOrder(value as SortOrder)}
              >
                <SelectTrigger id="sort-order">
                  <SelectValue placeholder="Sort order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="w-full h-24 animate-pulse bg-gray-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredAndSortedTransactions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No transactions match your filters
            </div>
          ) : (
            filteredAndSortedTransactions.map((transaction) => (
              <TransactionCard
                key={`${transaction.id}-${transaction.type}`}
                transaction={transaction}
              />
            ))
          )}
        </div>
      )}
    </PageWrapper>
  );
}
