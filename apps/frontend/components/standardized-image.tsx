"use client";

import { useState } from "react";
import Image from "next/image";

interface StandardizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  onLoadingComplete?: () => void;
}

export function StandardizedImage({
  src,
  alt,
  width = 300,
  height = 300,
  className = "",
  onLoadingComplete,
}: StandardizedImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (imageError) {
    return (
      <div
        className={`flex items-center justify-center bg-zinc-200 dark:bg-zinc-800 rounded-lg ${className}`}
        style={{ width, height }}
      >
        <svg
          className="w-1/2 h-1/2 text-zinc-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-zinc-100 dark:bg-zinc-900 ${className}`}
      style={{ width, height }}
    >
      {isLoading && (
        <div
          className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800 animate-pulse"
          style={{ filter: "blur(8px)" }}
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        style={{ objectFit: "cover" }}
        onError={() => {
          setImageError(true);
          setIsLoading(false);
        }}
        onLoad={() => {
          setIsLoading(false);
          onLoadingComplete?.();
        }}
        priority
      />
    </div>
  );
}
