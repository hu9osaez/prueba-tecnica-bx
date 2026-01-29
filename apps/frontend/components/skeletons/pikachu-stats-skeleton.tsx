"use client";

import { Zap } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PikachuStatsSkeleton() {
  return (
    <Card
      className="w-full max-w-md mx-auto mt-6"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading Pikachu statistics"
      role="status"
    >
      <span className="sr-only">Loading Pikachu statistics...</span>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" aria-hidden="true" />
          Pikachu Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 rounded-lg">
            <Skeleton
              variant="shimmer"
              className="w-20 h-20 rounded-lg flex-shrink-0"
              aria-label="Loading Pikachu image"
            />
            <div className="flex-1 space-y-2">
              <Skeleton
                variant="shimmer"
                className="h-4 rounded w-24"
                aria-label="Loading character name"
              />
              <Skeleton
                variant="shimmer"
                className="h-3 rounded w-16"
                aria-label="Loading character source"
              />
              <Skeleton
                variant="shimmer"
                className="h-5 rounded w-20"
                aria-label="Loading character status badge"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded">
              <Skeleton
                variant="shimmer"
                className="h-3 rounded w-12 mb-1"
                aria-label="Loading likes label"
              />
              <Skeleton
                variant="shimmer"
                className="h-6 rounded w-10"
                aria-label="Loading likes count"
              />
            </div>
            <div className="p-2 rounded">
              <Skeleton
                variant="shimmer"
                className="h-3 rounded w-16 mb-1"
                aria-label="Loading dislikes label"
              />
              <Skeleton
                variant="shimmer"
                className="h-6 rounded w-10"
                aria-label="Loading dislikes count"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 rounded">
              <Skeleton
                variant="shimmer"
                className="h-3 rounded w-8 mb-1"
                aria-label="Loading net score label"
              />
              <Skeleton
                variant="shimmer"
                className="h-4 rounded w-8"
                aria-label="Loading net score value"
              />
            </div>
            <div className="p-2 rounded">
              <Skeleton
                variant="shimmer"
                className="h-3 rounded w-8 mb-1"
                aria-label="Loading total votes label"
              />
              <Skeleton
                variant="shimmer"
                className="h-4 rounded w-8"
                aria-label="Loading total votes value"
              />
            </div>
            <div className="p-2 rounded">
              <Skeleton
                variant="shimmer"
                className="h-3 rounded w-8 mb-1"
                aria-label="Loading approval percentage label"
              />
              <Skeleton
                variant="shimmer"
                className="h-4 rounded w-8"
                aria-label="Loading approval percentage value"
              />
            </div>
          </div>

          <div className="text-center">
            <Skeleton
              variant="shimmer"
              className="h-3 rounded w-32 mx-auto"
              aria-label="Loading first vote date"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
