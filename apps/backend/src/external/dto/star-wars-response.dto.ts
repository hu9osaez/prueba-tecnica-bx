export interface StarWarsPersonResponse {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  films: string[];
  species: string[];
  vehicles: string[];
  starships: string[];
  created: string;
  edited: string;
  url: string;
}

export interface StarWarsListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: StarWarsPersonResponse[];
}

export interface StarWarsSearchResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: StarWarsPersonResponse[];
}
