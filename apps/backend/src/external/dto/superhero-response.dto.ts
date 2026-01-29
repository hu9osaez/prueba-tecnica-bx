export interface SuperheroResponse {
  id: string;
  name: string;
  image: { url: string };
  biography: {
    fullName: string;
    publisher: string;
  };
  appearance: {
    gender: string;
    race: string;
  };
}

export interface SuperheroErrorResponse {
  error: string;
  message: string;
}
