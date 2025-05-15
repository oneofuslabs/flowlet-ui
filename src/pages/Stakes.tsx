import { PageWrapper } from "@/components/page-wrapper";
import { Profile, Stake, StakeStatus } from "@/types/core";
import { getJSON, postJSON } from "@/utils/loaders";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { StakeCard } from "@/components/stake-card";
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

type SortField = "date" | "status" | "amount" | "validator";
type SortOrder = "asc" | "desc";

export default function Stakes() {
  const [statusFilter, setStatusFilter] = useState<"all" | StakeStatus>("all");
  const [sortField, setSortField] = useState<SortField>("status");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const { data: profile } = useQuery<Profile>({
    queryKey: ["profile"],
    queryFn: () => getJSON("/api/v1/users/profile"),
  });

  const {
    data: stakesData,
    isLoading: stakesLoading,
    refetch: refetchStakes,
  } = useQuery<{
    stakes: Stake[];
  }>({
    queryKey: ["stakes", profile?.id],
    queryFn: () =>
      postJSON("/api/v1/stake", {
        userId: profile?.id,
      }),
    enabled: !!profile?.id,
  });

  const stakes = stakesData?.stakes;

  const filteredAndSortedStakes = useMemo(() => {
    if (!stakes) return [];

    let filtered = [...stakes];

    if (statusFilter !== "all") {
      filtered = filtered.filter((stake) => stake.status === statusFilter);
    }

    return filtered.sort((a, b) => {
      switch (sortField) {
        case "date":
          return sortOrder === "asc"
            ? new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime()
            : new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime();
        case "status":
          return sortOrder === "asc"
            ? a.status.localeCompare(b.status)
            : b.status.localeCompare(a.status);
        case "amount":
          return sortOrder === "asc"
            ? a.amount - b.amount
            : b.amount - a.amount;
        case "validator":
          return sortOrder === "asc"
            ? a.validator.localeCompare(b.validator)
            : b.validator.localeCompare(a.validator);
        default:
          return 0;
      }
    });
  }, [stakes, statusFilter, sortField, sortOrder]);

  return (
    <PageWrapper title="Stakes" noPadding className="max-w-2xl w-full mx-auto">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-0">
          <div className="flex gap-4 items-center flex-wrap">
            <div className="space-y-2">
              <Label className="block mb-2">Status</Label>
              <div className="flex gap-2 flex-wrap">
                <Badge
                  variant={statusFilter === "all" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setStatusFilter("all")}
                >
                  All
                </Badge>
                <Badge
                  variant={statusFilter === "delegated" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setStatusFilter("delegated")}
                >
                  Active
                </Badge>
                <Badge
                  variant={statusFilter === "withdrawn" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setStatusFilter("withdrawn")}
                >
                  Completed
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
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                  <SelectItem value="validator">Validator</SelectItem>
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

      {stakesLoading || !profile ? (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="w-full h-24 animate-pulse bg-gray-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredAndSortedStakes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No stakes match your filters
            </div>
          ) : (
            filteredAndSortedStakes.map((stake) => (
              <StakeCard
                key={stake.id}
                stake={stake}
                refetchStakes={refetchStakes}
                userId={profile?.id}
              />
            ))
          )}
        </div>
      )}
    </PageWrapper>
  );
}
