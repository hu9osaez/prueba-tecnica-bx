import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  API_PREFIX: Joi.string().default('api'),
  MONGODB_URI: Joi.string().required(),
  SUPERHERO_API_TOKEN: Joi.string().allow('').optional(),
  CORS_ORIGINS: Joi.string().allow('').optional(),
  RICK_AND_MORTY_API_URL: Joi.string()
    .uri()
    .default('https://rickandmortyapi.com/api'),
  POKEMON_API_URL: Joi.string().uri().default('https://pokeapi.co/api/v2'),
  SUPERHERO_API_URL: Joi.string().uri().default('https://superheroapi.com/api'),
  API_TIMEOUT_MS: Joi.number().default(5000),
  API_CACHE_TTL_SECONDS: Joi.number().default(3600),
});
