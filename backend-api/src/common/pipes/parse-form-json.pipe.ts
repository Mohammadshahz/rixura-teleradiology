import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ParseFormJsonPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value && typeof value === 'string') {
      try {
        // Try to parse as JSON
        if (value.startsWith('{') || value.startsWith('[')) {
          return JSON.parse(value);
        }
      } catch (e) {
        // If parsing fails, return original value
        console.error('Failed to parse JSON:', e);
      }
    }
    return value;
  }
}
