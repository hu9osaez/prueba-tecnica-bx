"use client";

import { Zap } from "lucide-react";

import { PikachuStatsResponse } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StandardizedImage } from "@/components/standardized-image";

interface PikachuStatsPanelProps {
  stats: PikachuStatsResponse | null;
  isLoading: boolean;
}

export function PikachuStatsPanel({ stats, isLoading }: PikachuStatsPanelProps) {
  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Pikachu Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-12 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded" />
            <div className="h-12 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return null;
  }

  const exists = stats.character.exists;
  const hasStatistics = stats.statistics !== undefined;
  const hasImage = exists && stats.character.imageUrl;

  return (
    <Card className="w-full max-w-md mx-auto mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Pikachu Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Character Info with Image */}
          <div className="flex items-center gap-4 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
            {hasImage ? (
              <StandardizedImage
                src={stats.character.imageUrl!}
                alt={stats.character.name}
                width={80}
                height={80}
                className="flex-shrink-0"
              />
            ) : (
              <div className="w-20 h-20 bg-yellow-200 dark:bg-yellow-900 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {stats.character.name}
              </p>
              <p className="text-xs text-zinc-500">{stats.character.source}</p>
              <Badge variant={exists ? "default" : "secondary"} className="mt-1">
                {exists ? "En DB" : "No existe"}
              </Badge>
            </div>
          </div>

          {hasStatistics ? (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-green-50 dark:bg-green-950/20 p-2 rounded text-center">
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">Likes</p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    {stats.statistics?.likes ?? 0}
                  </p>
                </div>
                <div className="bg-red-50 dark:bg-red-950/20 p-2 rounded text-center">
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">Dislikes</p>
                  <p className="text-lg font-bold text-red-600 dark:text-red-400">
                    {stats.statistics?.dislikes ?? 0}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-zinc-100 dark:bg-zinc-900 p-2 rounded">
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">Net</p>
                  <p className="text-sm font-semibold">
                    {(stats.statistics?.netScore ?? 0) > 0 ? "+" : ""}
                    {stats.statistics?.netScore ?? 0}
                  </p>
                </div>
                <div className="bg-zinc-100 dark:bg-zinc-900 p-2 rounded">
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">Total</p>
                  <p className="text-sm font-semibold">
                    {stats.statistics?.totalVotes ?? 0}
                  </p>
                </div>
                <div className="bg-zinc-100 dark:bg-zinc-900 p-2 rounded">
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">Score</p>
                  <p
                    className={`text-sm font-semibold ${
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
                <div className="text-xs text-zinc-500 text-center">
                  Primer voto:{" "}
                  {new Date(stats.statistics.firstVoteAt).toLocaleDateString()}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-sm text-zinc-500 py-4">
              Sin votos registrados
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
