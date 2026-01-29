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
    <Card className="w-full overflow-hidden hud-panel hud-border-tech hud-scanlines">
      <CardContent className="p-6">
        <div className="flex justify-center">
          <div className="hud-character-frame">
            <StandardizedImage
              src={imageSource}
              alt={displayedCharacter.name}
              width={300}
              height={300}
              className="rounded-none"
              onLoadingComplete={handleImageLoad}
            />
          </div>
        </div>
        <div className="mt-6 text-center">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight hud-font-mono hud-text-glow">
            {displayedCharacter.name.toUpperCase()}
          </h2>
          <Badge className={`mt-4 px-4 py-2 font-bold hud-font-mono ${sourceBadgeClasses[displayedCharacter.source]} border-2 border-current`}>
            [{sourceLabels[displayedCharacter.source].toUpperCase()}]
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
