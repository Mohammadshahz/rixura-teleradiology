import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { XRayType } from '../../report/enums/x-ray-type.enum';

/**
 * Custom validator to ensure the prices object follows the correct structure:
 * {
 *   [XRayType.CT_SCAN]: { regular: 50, review: 25 },
 *   [XRayType.XRAY]: { regular: 20, review: 10 },
 *   [XRayType.MRI]: { regular: 100, review: 50 }
 * }
 */
export function IsValidXRayPrices(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidXRayPrices',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (value === undefined || value === null) {
            return true; // Skip validation if the field is not provided (it's optional)
          }

          if (typeof value !== 'object' || Array.isArray(value)) {
            return false; // Must be an object
          }

          const validXRayTypes = Object.values(XRayType);
          const keys = Object.keys(value);

          // Check if all keys are valid XRayType values
          for (const key of keys) {
            if (!validXRayTypes.includes(key as XRayType)) {
              return false;
            }

            const priceObj = value[key];
            
            // Check if priceObj has the correct structure
            if (typeof priceObj !== 'object' || 
                Array.isArray(priceObj) ||
                !priceObj.hasOwnProperty('regular') ||
                !priceObj.hasOwnProperty('review')) {
              return false;
            }

            // Check if regular and review are valid numbers
            if (typeof priceObj.regular !== 'number' || 
                isNaN(priceObj.regular) || 
                priceObj.regular < 0 ||
                typeof priceObj.review !== 'number' || 
                isNaN(priceObj.review) || 
                priceObj.review < 0) {
              return false;
            }
          }

          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be an object with XRayType keys and nested 'regular' and 'review' properties with positive number values, e.g., { "${XRayType.XRAY}": { regular: 20, review: 10 }, "${XRayType.CT_SCAN}": { regular: 50, review: 25 } }`;
        },
      },
    });
  };
}
