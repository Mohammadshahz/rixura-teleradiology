import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Custom decorator to extract and parse JSON fields from multipart/form-data requests
 * If no keys are provided, it will try to parse all fields in the request body
 */
export const FormDataJson = createParamDecorator(
  (keys: string | string[] | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const result: Record<string, any> = {};
    
    // If no keys provided, process all fields in request body
    if (!keys) {
      const bodyKeys = Object.keys(request.body || {});
      
      bodyKeys.forEach(key => {
        try {
          if (request.body[key] && typeof request.body[key] === 'string') {
            // Try to parse as JSON
            if (request.body[key].startsWith('{') || request.body[key].startsWith('[')) {
              result[key] = JSON.parse(request.body[key]);
            } else {
              // Not JSON, keep as is
              result[key] = request.body[key];
            }
          } else {
            // If not a string or not present, keep as is
            result[key] = request.body[key];
          }
        } catch (e) {
          console.error(`Error parsing JSON for ${key}:`, e);
          // If parsing fails, use original
          result[key] = request.body[key];
        }
      });
      
      return result;
    }
    
    // Handle both single key and array of keys
    const targetKeys = typeof keys === 'string' ? [keys] : keys;
    
    targetKeys.forEach(key => {
      try {
        if (request.body && request.body[key] && typeof request.body[key] === 'string') {
          // Try to parse as JSON
          if (request.body[key].startsWith('{') || request.body[key].startsWith('[')) {
            result[key] = JSON.parse(request.body[key]);
          } else {
            // Not JSON, keep as is
            result[key] = request.body[key];
          }
        } else {
          // If not a string or not present, keep as is
          result[key] = request.body[key];
        }
      } catch (e) {
        console.error(`Error parsing JSON for ${key}:`, e);
        // If parsing fails, use original
        result[key] = request.body[key];
      }
    });
    
    return targetKeys.length === 1 && typeof keys === 'string' ? result[keys] : result;
  },
);
