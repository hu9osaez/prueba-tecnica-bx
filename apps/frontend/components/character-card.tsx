"use client";

import { useState } from "react";
import Image from "next/image";

import { Character } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CharacterCardProps {
  character: Character | null;
  isLoading?: boolean;
}

const sourceColors = {
  "rick-and-morty": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  pokemon: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  superhero: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
};

const sourceLabels = {
  "rick-and-morty": "Rick and Morty",
  pokemon: "Pokémon",
  superhero: "Superhero",
};

export function CharacterCard({ character, isLoading }: CharacterCardProps) {
  const [imageError, setImageError] = useState(false);

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto overflow-hidden">
        <CardContent className="p-6">
          <div className="aspect-video w-full bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded-lg" />
          <div className="mt-4 h-6 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded w-3/4 mx-auto" />
        </CardContent>
      </Card>
    );
  }

  if (!character) {
    return null;
  }

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="p-6">
        <div className="relative aspect-video w-full bg-zinc-100 dark:bg-zinc-900 rounded-lg overflow-hidden">
          {imageError ? (
            <div className="w-full h-full flex items-center justify-center text-zinc-400">
              <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          ) : (
            <Image
              src={character.image}
              alt={character.name}
              fill
              className="object-contain"
              onError={() => setImageError(true)}
              priority
            />
          )}
        </div>
        <div className="mt-4 text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{character.name}</h2>
          <Badge className={`mt-2 ${sourceColors[character.source]}`}>
            {sourceLabels[character.source]}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
