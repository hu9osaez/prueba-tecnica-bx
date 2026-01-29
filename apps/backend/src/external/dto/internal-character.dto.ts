export interface InternalCharacterDto {
  externalId: string;
  name: string;
  source: 'rick-morty' | 'pokemon' | 'superhero' | 'star-wars';
  imageUrl: string;
}
