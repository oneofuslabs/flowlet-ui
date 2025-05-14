import { PageWrapper } from "@/components/page-wrapper";
import { Rule } from "@/types/core";
import { getJSON } from "@/utils/loaders";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { RuleCard } from "@/components/rule-card";
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

type SortField = "date" | "type";
type SortOrder = "asc" | "desc";

interface RulesResponse {
  rules: {
    active: Rule[];
    completed: Rule[];
  };
}

export default function Rules() {
  const [typeFilter, setTypeFilter] = useState<"all" | "transfer" | "trade">(
    "all"
  );
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "completed"
  >("all");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const { data: rulesData, isLoading } = useQuery<RulesResponse>({
    queryKey: ["rules"],
    queryFn: () => getJSON("/api/v1/rules"),
  });

  const allRules = useMemo(() => {
    if (!rulesData?.rules) return [];

    const active = rulesData.rules.active.map((rule) => ({ ...rule }));
    const completed = rulesData.rules.completed.map((rule) => ({ ...rule }));

    return [...active, ...completed];
  }, [rulesData]);

  const filteredAndSortedRules = useMemo(() => {
    if (!allRules.length) return [];

    let filtered = [...allRules];

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter((rule) => rule.type === typeFilter);
    }

    // Filter by status
    if (statusFilter === "active") {
      filtered = filtered.filter((rule) => !rule.completed_at);
    } else if (statusFilter === "completed") {
      filtered = filtered.filter((rule) => !!rule.completed_at);
    }

    // Sort
    return filtered.sort((a, b) => {
      if (sortField === "date") {
        return sortOrder === "asc"
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortField === "type") {
        return sortOrder === "asc"
          ? a.type.localeCompare(b.type)
          : b.type.localeCompare(a.type);
      }
      return 0;
    });
  }, [allRules, typeFilter, statusFilter, sortField, sortOrder]);

  return (
    <PageWrapper title="Rules" noPadding>
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
                  variant={statusFilter === "active" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setStatusFilter("active")}
                >
                  Active
                </Badge>
                <Badge
                  variant={statusFilter === "completed" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setStatusFilter("completed")}
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
                  <SelectItem value="type">Type</SelectItem>
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
          {filteredAndSortedRules.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No rules match your filters
            </div>
          ) : (
            filteredAndSortedRules.map((rule) => (
              <RuleCard key={rule.id} rule={rule} />
            ))
          )}
        </div>
      )}
    </PageWrapper>
  );
}
