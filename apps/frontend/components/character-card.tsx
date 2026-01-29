"use client";

import { Character } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StandardizedImage } from "@/components/standardized-image";
import { CharacterCardSkeleton } from "@/components/skeletons";

interface CharacterCardProps {
  character: Character | null;
  isLoading?: boolean;
}

const sourceBadgeClasses = {
  "rick-and-morty": "bg-rickmorty",
  pokemon: "bg-pokemon",
  superhero: "bg-superhero",
  "star-wars": "bg-starwars",
};

const sourceLabels = {
  "rick-and-morty": "Rick and Morty",
  pokemon: "Pokémon",
  superhero: "Superhero",
  "star-wars": "Star Wars",
};

export function CharacterCard({ character, isLoading }: CharacterCardProps) {
  if (isLoading) {
    return <CharacterCardSkeleton />;
  }

  if (!character) {
    return null;
  }

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden card-hover">
      <CardContent className="p-6">
        <div className="flex justify-center">
          <StandardizedImage
            src={character.image}
            alt={character.name}
            width={300}
            height={300}
            className="rounded-lg shadow-md"
          />
        </div>
        <div className="mt-5 text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            {character.name}
          </h2>
          <Badge className={`mt-3 px-3 py-1 font-medium ${sourceBadgeClasses[character.source]}`}>
            {sourceLabels[character.source]}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
