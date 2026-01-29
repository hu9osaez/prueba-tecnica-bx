export interface RickAndMortyCharacterResponse {
  id: number;
  name: string;
  image: string;
  species: string;
  status: string;
}

export interface RickAndMortyInfoResponse {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface RickAndMortyApiResponse {
  info: RickAndMortyInfoResponse;
  results: RickAndMortyCharacterResponse[];
}
