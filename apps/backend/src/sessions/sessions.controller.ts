import {
  Controller,
  Post,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { SessionsService } from './sessions.service';
import { SessionResponseDto } from './dto';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  async create(): Promise<SessionResponseDto> {
    const session = await this.sessionsService.create();
    return {
      sessionId: session.sessionId,
      expiresAt: session.expiresAt,
    };
  }

  @Delete(':sessionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('sessionId') sessionId: string): Promise<void> {
    await this.sessionsService.delete(sessionId);
  }
}
