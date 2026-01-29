export class CreateSessionDto {
  sessionId?: string;
}

export class SessionResponseDto {
  sessionId: string;
  expiresAt: Date;
}
