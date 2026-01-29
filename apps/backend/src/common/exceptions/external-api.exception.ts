import { HttpException, HttpStatus } from '@nestjs/common';

export class ExternalApiException extends HttpException {
  constructor(
    source: string,
    message: string,
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super(
      {
        statusCode: status,
        message: `External API error from ${source}: ${message}`,
        source,
      },
      status,
    );
  }
}

export class ApiTimeoutException extends ExternalApiException {
  constructor(source: string) {
    super(source, 'Request timeout', HttpStatus.REQUEST_TIMEOUT);
  }
}

export class ApiRateLimitException extends ExternalApiException {
  constructor(source: string) {
    super(source, 'Rate limit exceeded', HttpStatus.TOO_MANY_REQUESTS);
  }
}

export class RickAndMortyApiException extends ExternalApiException {
  constructor(
    message: string,
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super('rick-morty', message, status);
  }
}

export class PokemonApiException extends ExternalApiException {
  constructor(
    message: string,
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super('pokemon', message, status);
  }
}

export class SuperheroApiException extends ExternalApiException {
  constructor(
    message: string,
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super('superhero', message, status);
  }
}

export class StarWarsApiException extends ExternalApiException {
  constructor(
    message: string,
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super('star-wars', message, status);
  }
}
