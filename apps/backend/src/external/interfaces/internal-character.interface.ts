export interface InternalCharacter {
  externalId: string;
  name: string;
  source: 'rick-morty' | 'pokemon' | 'superhero' | 'star-wars';
  imageUrl: string;
}
