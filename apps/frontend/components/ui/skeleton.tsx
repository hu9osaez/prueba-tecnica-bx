import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "pulse" | "shimmer";
  "aria-busy"?: boolean;
  "aria-label"?: string;
}

function Skeleton({
  className,
  variant = "pulse",
  "aria-busy": ariaBusy = true,
  "aria-label": ariaLabel,
  ...props
}: SkeletonProps) {
  const baseClasses = "rounded-md bg-zinc-200 dark:bg-zinc-800";
  const variantClasses = variant === "shimmer" ? "shimmer" : "animate-pulse";

  return (
    <div
      className={cn(baseClasses, variantClasses, className)}
      aria-busy={ariaBusy}
      aria-label={ariaLabel}
      role="status"
      {...props}
    />
  );
}

export { Skeleton };
