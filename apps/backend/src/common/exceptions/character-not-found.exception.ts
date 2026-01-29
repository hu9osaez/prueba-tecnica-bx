import { HttpException, HttpStatus } from '@nestjs/common';

export class CharacterNotFoundException extends HttpException {
  constructor(source?: string, id?: string) {
    const message = id
      ? `Character not found in ${source || 'external API'} with id: ${id}`
      : 'Character not found';
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        message,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
