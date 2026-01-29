"use client";

import { ComponentType } from "react";

export function withSkeleton<
  P extends { isLoading?: boolean },
  T extends { isLoading?: boolean } = P
>(
  Component: ComponentType<P>,
  SkeletonComponent: ComponentType<T>,
  isLoadingProp: keyof P = "isLoading" as keyof P
): ComponentType<P> {
  return function WithSkeletonComponent(props: P) {
    const isLoading = props[isLoadingProp] as boolean;

    if (isLoading) {
      return <SkeletonComponent {...(props as unknown as T)} />;
    }

    return <Component {...props} />;
  };
}

export function createSkeletonLoader<
  T extends { isLoading?: boolean } = { isLoading?: boolean }
>(
  SkeletonComponent: ComponentType<T>,
  isLoadingProp: keyof T = "isLoading"
) {
  return function <P extends { isLoading?: boolean }>(
    Component: ComponentType<P>
  ): ComponentType<P> {
    return withSkeleton<P, T>(Component, SkeletonComponent, isLoadingProp as keyof P);
  };
}

export function withConditionalSkeleton<
  P extends Record<string, unknown>,
  T extends Record<string, unknown> = P
>(
  Component: ComponentType<P>,
  SkeletonComponent: ComponentType<T>,
  shouldShowSkeleton: (props: P) => boolean
): ComponentType<P> {
  return function WithConditionalSkeletonComponent(props: P) {
    if (shouldShowSkeleton(props)) {
      return <SkeletonComponent {...(props as unknown as T)} />;
    }

    return <Component {...props} />;
  };
}
