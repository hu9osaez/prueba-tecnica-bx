/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

const SENSITIVE_FIELDS = [
  'password',
  'token',
  'apiKey',
  'apikey',
  'api-key',
  'secret',
  'creditCard',
  'credit-card',
  'authorization',
  'auth',
];

const SENSITIVE_URL_PATTERNS = [
  /token=[^&\s]+/gi,
  /password=[^&\s]+/gi,
  /apiKey=[^&\s]+/gi,
  /apikey=[^&\s]+/gi,
  /secret=[^&\s]+/gi,
  /authorization=[^&\s]+/gi,
];

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body } = request;

    const sanitizedUrl = this.sanitizeUrl(url);

    const sanitizedBody = this.sanitizeData(body);

    this.logger.log(`${method} ${sanitizedUrl}`);

    if (
      sanitizedBody &&
      typeof sanitizedBody === 'object' &&
      Object.keys(sanitizedBody).length > 0
    ) {
      this.logger.debug(`Request body: ${JSON.stringify(sanitizedBody)}`);
    }

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse();
          this.logger.log(`${method} ${sanitizedUrl} ${response.statusCode}`);
        },
        error: (error) => {
          this.logger.error(`${method} ${sanitizedUrl} - ${error.message}`);
        },
      }),
    );
  }

  private sanitizeUrl(url: string): string {
    let sanitized = url;

    SENSITIVE_URL_PATTERNS.forEach((pattern) => {
      sanitized = sanitized.replace(pattern, (match) => {
        const key = match.split('=')[0];
        return `${key}=[REDACTED]`;
      });
    });

    return sanitized;
  }

  private sanitizeData(data: any): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.sanitizeData(item));
    }

    const sanitized = { ...data };

    SENSITIVE_FIELDS.forEach((field) => {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    });

    Object.keys(sanitized).forEach((key) => {
      if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
        sanitized[key] = this.sanitizeData(sanitized[key]);
      }
    });

    return sanitized;
  }
}
