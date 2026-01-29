"use client";

import { Trophy, TrendingDown, Clock } from "lucide-react";

import { Statistics } from "@/types";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { StatisticsSkeleton } from "@/components/skeletons";

interface StatisticsPanelProps {
  statistics: Statistics | null;
  isLoading: boolean;
}

export function StatisticsPanel({ statistics, isLoading }: StatisticsPanelProps) {
  if (isLoading) {
    return <StatisticsSkeleton />;
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <Trophy className="w-5 h-5 text-green-600 dark:text-green-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Most Liked</p>
              {statistics?.mostLiked ? (
                <>
                  <p className="text-lg font-bold">{statistics.mostLiked.character.name}</p>
                  <Badge variant="secondary" className="text-green-600 dark:text-green-400">
                    {statistics.mostLiked.likes} likes
                  </Badge>
                </>
              ) : (
                <p className="text-sm text-zinc-500">No data yet</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
            <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Most Disliked</p>
              {statistics?.mostDisliked ? (
                <>
                  <p className="text-lg font-bold">{statistics.mostDisliked.character.name}</p>
                  <Badge variant="secondary" className="text-red-600 dark:text-red-400">
                    {statistics.mostDisliked.dislikes} dislikes
                  </Badge>
                </>
              ) : (
                <p className="text-sm text-zinc-500">No data yet</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
            <Clock className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Last Evaluated</p>
              {statistics?.lastEvaluated ? (
                <>
                  <p className="text-lg font-bold">{statistics.lastEvaluated.vote.character.name}</p>
                  <p className="text-xs text-zinc-500">
                    {new Date(statistics.lastEvaluated.vote.votedAt).toLocaleString()}
                  </p>
                </>
              ) : (
                <p className="text-sm text-zinc-500">No data yet</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
