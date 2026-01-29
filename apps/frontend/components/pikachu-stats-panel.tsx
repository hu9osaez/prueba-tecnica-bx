"use client";

import { Zap } from "lucide-react";

import { PikachuStatsResponse } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StandardizedImage } from "@/components/standardized-image";
import { PikachuStatsSkeleton } from "@/components/skeletons";

interface PikachuStatsPanelProps {
  stats: PikachuStatsResponse | null;
  isLoading: boolean;
}

export function PikachuStatsPanel({ stats, isLoading }: PikachuStatsPanelProps) {
  if (isLoading) {
    return <PikachuStatsSkeleton />;
  }

  if (!stats) {
    return null;
  }

  const exists = stats.character.exists;
  const hasStatistics = stats.statistics !== undefined;
  const hasImage = exists && stats.character.imageUrl;

  return (
    <Card className="w-full hud-panel hud-scanlines">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 hud-font-mono hud-text-glow text-yellow-400">
          <Zap className="w-5 h-5" />
          &gt; PIKACHU_STATUS_
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Character Info with Image */}
          <div className="hud-leaderboard-item">
            {hasImage ? (
              <div className="hud-character-frame" style={{ padding: '4px' }}>
                <StandardizedImage
                  src={stats.character.imageUrl!}
                  alt={stats.character.name}
                  width={60}
                  height={60}
                  className="flex-shrink-0"
                />
              </div>
            ) : (
              <div className="w-16 h-16 bg-yellow-200 dark:bg-yellow-900 hud-character-frame flex items-center justify-center flex-shrink-0" style={{ padding: '4px' }}>
                <Zap className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate hud-font-mono">
                {stats.character.name.toUpperCase()}
              </p>
              <p className="text-xs text-zinc-500 hud-font-mono">[{stats.character.source.toUpperCase()}]</p>
              <Badge
                variant={exists ? "default" : "secondary"}
                className={`mt-1 hud-font-mono text-xs ${exists ? 'bg-green-600 text-white' : 'bg-zinc-600 text-white'}`}
              >
                {exists ? "[EN_DB]" : "[NO_EXISTE]"}
              </Badge>
            </div>
          </div>

          {hasStatistics ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="hud-stat-card text-center">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 hud-font-mono">[LIKES]</p>
                  <p className="text-xl font-bold text-green-400 hud-font-mono">
                    +{stats.statistics?.likes ?? 0}
                  </p>
                </div>
                <div className="hud-stat-card text-center" style={{ borderLeftColor: 'hsl(var(--hud-neon-magenta))' }}>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 hud-font-mono">[DISLIKES]</p>
                  <p className="text-xl font-bold text-red-400 hud-font-mono">
                    -{stats.statistics?.dislikes ?? 0}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-zinc-100 dark:bg-zinc-900 p-2 rounded border border-zinc-300 dark:border-zinc-700">
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 hud-font-mono">NET</p>
                  <p className="text-sm font-semibold hud-font-mono">
                    {(stats.statistics?.netScore ?? 0) > 0 ? "+" : ""}
                    {stats.statistics?.netScore ?? 0}
                  </p>
                </div>
                <div className="bg-zinc-100 dark:bg-zinc-900 p-2 rounded border border-zinc-300 dark:border-zinc-700">
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 hud-font-mono">TOTAL</p>
                  <p className="text-sm font-semibold hud-font-mono">
                    {stats.statistics?.totalVotes ?? 0}
                  </p>
                </div>
                <div className="bg-zinc-100 dark:bg-zinc-900 p-2 rounded border border-zinc-300 dark:border-zinc-700">
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 hud-font-mono">SCORE</p>
                  <p
                    className={`text-sm font-semibold hud-font-mono ${
                      (stats.statistics?.netScore ?? 0) >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {(stats.statistics?.totalVotes ?? 0) > 0
                      ? Math.round(
                          ((stats.statistics?.likes ?? 0) /
                            (stats.statistics?.totalVotes ?? 1)) *
                            100,
                        )
                      : 0}
                    %
                  </p>
                </div>
              </div>

              {stats.statistics?.firstVoteAt && (
                <div className="text-xs text-zinc-500 text-center hud-font-mono">
                  [PRIMER_VOTO]: {new Date(stats.statistics.firstVoteAt).toLocaleDateString()}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-sm text-zinc-500 py-4 hud-font-mono">
              [SIN_VOTOS_REGISTRADOS]
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
