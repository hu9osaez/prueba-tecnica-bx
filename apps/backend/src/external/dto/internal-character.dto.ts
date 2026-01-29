export interface InternalCharacterDto {
  externalId: string;
  name: string;
  source: 'rick-morty' | 'pokemon' | 'superhero';
  imageUrl: string;
}
