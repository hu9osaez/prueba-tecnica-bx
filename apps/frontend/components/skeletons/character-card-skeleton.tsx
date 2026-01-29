"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function CharacterCardSkeleton() {
  return (
    <Card
      className="w-full max-w-md mx-auto overflow-hidden"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading character"
      role="status"
    >
      <span className="sr-only">Loading character...</span>
      <CardContent className="p-6">
        <Skeleton
          variant="shimmer"
          className="w-full aspect-square rounded-lg"
          aria-label="Loading character image"
        />

        <Skeleton
          variant="shimmer"
          className="mt-5 h-8 rounded w-48 mx-auto"
          aria-label="Loading character name"
        />

        <Skeleton
          variant="shimmer"
          className="mt-3 h-7 rounded w-28 mx-auto"
          aria-label="Loading character source badge"
        />
      </CardContent>
    </Card>
  );
}
