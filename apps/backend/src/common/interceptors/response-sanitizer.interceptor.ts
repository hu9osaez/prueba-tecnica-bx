import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const SENSITIVE_RESPONSE_FIELDS = [
  'password',
  'token',
  'apiKey',
  'apikey',
  'api-key',
  'secret',
  'hash',
  'salt',
  'internalId',
  'internalNotes',
  'adminNotes',
];

const INTERNAL_MONGODB_FIELDS = ['__v', '$__', '$init'];

@Injectable()
export class ResponseSanitizerInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    return next
      .handle()
      .pipe(map((data: unknown) => this.sanitizeResponse(data)));
  }

  private sanitizeResponse(data: unknown): unknown {
    if (!data || typeof data !== 'object') {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.sanitizeResponse(item));
    }

    const sanitized: Record<string, unknown> = {};

    Object.entries(data as Record<string, unknown>).forEach(([key, value]) => {
      if (this.isSensitiveField(key)) {
        return;
      }

      if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeResponse(value);
      } else {
        sanitized[key] = value;
      }
    });

    return sanitized;
  }

  private isSensitiveField(fieldName: string): boolean {
    const lowerFieldName = fieldName.toLowerCase();

    if (
      SENSITIVE_RESPONSE_FIELDS.some(
        (field) => lowerFieldName === field.toLowerCase(),
      )
    ) {
      return true;
    }

    if (INTERNAL_MONGODB_FIELDS.includes(fieldName)) {
      return true;
    }

    const sensitiveSuffixes = ['token', 'secret', 'hash', 'salt'];
    if (sensitiveSuffixes.some((suffix) => lowerFieldName.endsWith(suffix))) {
      return true;
    }

    return false;
  }
}
