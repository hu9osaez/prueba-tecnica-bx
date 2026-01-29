"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function VotingButtonsSkeleton() {
  return (
    <div
      className="flex gap-4 justify-center mt-8"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading voting buttons"
      role="status"
    >
      <span className="sr-only">Loading voting buttons...</span>
      <Skeleton
        variant="shimmer"
        className="h-12 rounded-lg min-w-[140px]"
        aria-label="Loading like button"
      />
      <Skeleton
        variant="shimmer"
        className="h-12 rounded-lg min-w-[140px]"
        aria-label="Loading dislike button"
      />
    </div>
  );
}
