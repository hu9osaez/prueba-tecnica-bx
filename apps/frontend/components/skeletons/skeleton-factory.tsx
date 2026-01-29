"use client";

import { ComponentType } from "react";
import { CharacterCardSkeleton } from "./character-card-skeleton";
import { StatisticsSkeleton } from "./statistics-skeleton";
import { PikachuStatsSkeleton } from "./pikachu-stats-skeleton";
import { VotingButtonsSkeleton } from "./voting-buttons-skeleton";

export type SkeletonType =
  | "character"
  | "statistics"
  | "pikachu-stats"
  | "voting-buttons";

const skeletonRegistry: Record<SkeletonType, ComponentType> = {
  character: CharacterCardSkeleton,
  statistics: StatisticsSkeleton,
  "pikachu-stats": PikachuStatsSkeleton,
  "voting-buttons": VotingButtonsSkeleton,
};

export function getSkeleton(type: SkeletonType): ComponentType {
  const skeleton = skeletonRegistry[type];

  if (!skeleton) {
    throw new Error(`Skeleton component not found for type: ${type}`);
  }

  return skeleton;
}

export function renderSkeleton(type: SkeletonType): React.ReactElement {
  const Component = getSkeleton(type);
  return <Component />;
}

export function getSkeletonTypes(): SkeletonType[] {
  return Object.keys(skeletonRegistry) as SkeletonType[];
}

export function hasSkeletonType(type: string): type is SkeletonType {
  return type in skeletonRegistry;
}
