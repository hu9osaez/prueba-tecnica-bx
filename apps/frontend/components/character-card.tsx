"use client";

import { useState, useEffect, useRef } from "react";
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
  const [displayedCharacter, setDisplayedCharacter] = useState<Character | null>(character);
  const pendingCharacterRef = useRef<Character | null>(null);

  // Initialize displayedCharacter on first render
  if (character && !displayedCharacter) {
    setDisplayedCharacter(character);
  }

  useEffect(() => {
    if (character && displayedCharacter && character.id !== displayedCharacter.id) {
      pendingCharacterRef.current = character;
    }
  }, [character, displayedCharacter]);

  const handleImageLoad = () => {
    if (pendingCharacterRef.current) {
      setDisplayedCharacter(pendingCharacterRef.current);
      pendingCharacterRef.current = null;
    }
  };

  if (isLoading) {
    return <CharacterCardSkeleton />;
  }

  if (!displayedCharacter) {
    return null;
  }

  const imageSource = character?.image || displayedCharacter.image;

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden card-hover">
      <CardContent className="p-6">
        <div className="flex justify-center">
          <StandardizedImage
            src={imageSource}
            alt={displayedCharacter.name}
            width={300}
            height={300}
            className="rounded-lg shadow-md"
            onLoadingComplete={handleImageLoad}
          />
        </div>
        <div className="mt-5 text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            {displayedCharacter.name}
          </h2>
          <Badge className={`mt-3 px-3 py-1 font-medium ${sourceBadgeClasses[displayedCharacter.source]}`}>
            {sourceLabels[displayedCharacter.source]}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
