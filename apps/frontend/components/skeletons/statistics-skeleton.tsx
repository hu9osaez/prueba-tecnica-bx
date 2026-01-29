"use client";

import { Trophy, TrendingDown, Clock } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StatisticsSkeleton() {
  return (
    <Card
      className="w-full max-w-md mx-auto mt-8"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading statistics"
      role="status"
    >
      <span className="sr-only">Loading statistics...</span>
      <CardHeader>
        <CardTitle>Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg">
            <Trophy className="w-5 h-5 text-zinc-400" aria-hidden="true" />
            <div className="flex-1 space-y-2">
              <Skeleton
                variant="shimmer"
                className="h-4 rounded w-24"
                aria-label="Loading most liked label"
              />
              <Skeleton
                variant="shimmer"
                className="h-6 rounded w-32"
                aria-label="Loading most liked character name"
              />
              <Skeleton
                variant="shimmer"
                className="h-5 rounded w-20"
                aria-label="Loading most liked count"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg">
            <TrendingDown className="w-5 h-5 text-zinc-400" aria-hidden="true" />
            <div className="flex-1 space-y-2">
              <Skeleton
                variant="shimmer"
                className="h-4 rounded w-28"
                aria-label="Loading most disliked label"
              />
              <Skeleton
                variant="shimmer"
                className="h-6 rounded w-32"
                aria-label="Loading most disliked character name"
              />
              <Skeleton
                variant="shimmer"
                className="h-5 rounded w-24"
                aria-label="Loading most disliked count"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg">
            <Clock className="w-5 h-5 text-zinc-400" aria-hidden="true" />
            <div className="flex-1 space-y-2">
              <Skeleton
                variant="shimmer"
                className="h-4 rounded w-28"
                aria-label="Loading last evaluated label"
              />
              <Skeleton
                variant="shimmer"
                className="h-6 rounded w-32"
                aria-label="Loading last evaluated character name"
              />
              <Skeleton
                variant="shimmer"
                className="h-4 rounded w-20"
                aria-label="Loading last evaluated timestamp"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
