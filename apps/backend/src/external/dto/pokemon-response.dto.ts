export interface PokemonSprites {
  front_default: string | null;
  other: {
    'official-artwork': {
      front_default: string | null;
    };
  };
}

export interface PokemonResponse {
  id: number;
  name: string;
  sprites: PokemonSprites;
  species: { name: string };
  types: Array<{ type: { name: string } }>;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{ name: string; url: string }>;
}
