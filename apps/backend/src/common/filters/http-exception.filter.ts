import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

const SENSITIVE_PATTERNS = [
  /token=[^&\s]+/gi,
  /password=[^&\s]+/gi,
  /apiKey=[^&\s]+/gi,
  /apikey=[^&\s]+/gi,
  /secret=[^&\s]+/gi,
  /authorization=[^&\s]+/gi,
];

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  private readonly isDevelopment = process.env.NODE_ENV === 'development';

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : ((exceptionResponse as Record<string, unknown>).message as string);
    }

    const sanitizedUrl = this.sanitizeUrl(request.url);

    this.logger.error(
      `${request.method} ${sanitizedUrl} - Status: ${status} - Message: ${message}`,
      this.isDevelopment && exception instanceof Error
        ? exception.stack
        : undefined,
    );

    const errorResponse: Record<string, unknown> = {
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: sanitizedUrl,
    };

    // Include stack trace only in development mode
    if (this.isDevelopment && exception instanceof Error) {
      errorResponse.stack = exception.stack;
    }

    response.status(status).json(errorResponse);
  }

  private sanitizeUrl(url: string): string {
    let sanitized = url;

    SENSITIVE_PATTERNS.forEach((pattern) => {
      sanitized = sanitized.replace(pattern, (match) => {
        const key = match.split('=')[0];
        return `${key}=[REDACTED]`;
      });
    });

    return sanitized;
  }
}
