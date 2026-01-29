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
    <Card className="w-full hud-panel hud-scanlines">
      <CardHeader className="pb-4">
        <CardTitle className="hud-font-mono hud-text-glow text-cyan-400">
          &gt; STATISTICS_MODULE_
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="hud-stat-card">
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-green-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 hud-font-mono">
                  [MOST_LIKED]
                </p>
                {statistics?.mostLiked ? (
                  <>
                    <p className="text-base font-bold text-zinc-900 dark:text-zinc-100 truncate hud-font-mono">
                      {statistics.mostLiked.character.name.toUpperCase()}
                    </p>
                    <p className="text-sm font-bold text-green-400 hud-font-mono">
                      +{statistics.mostLiked.likes} VOTES
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-zinc-500 hud-font-mono">NO_DATA</p>
                )}
              </div>
            </div>
          </div>

          <div className="hud-stat-card" style={{ borderLeftColor: 'hsl(var(--hud-neon-magenta))' }}>
            <div className="flex items-center gap-3">
              <TrendingDown className="w-5 h-5 text-red-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 hud-font-mono">
                  [MOST_DISLIKED]
                </p>
                {statistics?.mostDisliked ? (
                  <>
                    <p className="text-base font-bold text-zinc-900 dark:text-zinc-100 truncate hud-font-mono">
                      {statistics.mostDisliked.character.name.toUpperCase()}
                    </p>
                    <p className="text-sm font-bold text-red-400 hud-font-mono">
                      -{statistics.mostDisliked.dislikes} VOTES
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-zinc-500 hud-font-mono">NO_DATA</p>
                )}
              </div>
            </div>
          </div>

          <div className="hud-stat-card" style={{ borderLeftColor: 'hsl(var(--hud-text-secondary))' }}>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-zinc-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 hud-font-mono">
                  [LAST_VOTE]
                </p>
                {statistics?.lastEvaluated ? (
                  <>
                    <p className="text-base font-bold text-zinc-900 dark:text-zinc-100 truncate hud-font-mono">
                      {statistics.lastEvaluated.vote.character.name.toUpperCase()}
                    </p>
                    <p className="text-xs text-zinc-500 hud-font-mono">
                      {new Date(statistics.lastEvaluated.vote.votedAt).toLocaleString()}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-zinc-500 hud-font-mono">NO_DATA</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
