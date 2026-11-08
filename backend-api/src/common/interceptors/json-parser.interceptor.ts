import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class JsonParserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    
    // Parse JSON strings in form fields
    if (request.body && request.headers['content-type']?.includes('multipart/form-data')) {
      for (const key of Object.keys(request.body)) {
        try {
          // Check if the value appears to be a JSON string
          if (typeof request.body[key] === 'string' && 
             (request.body[key].startsWith('{') || request.body[key].startsWith('['))) {
            request.body[key] = JSON.parse(request.body[key]);
          }
        } catch (e) {
          // If parsing fails, keep the original value
          console.log(`Failed to parse JSON for field ${key}:`, e);
        }
      }
    }
    
    return next.handle();
  }
}
