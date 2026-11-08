import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsS3UrlConstraint implements ValidatorConstraintInterface {
  validate(url: string) {
    return (
      typeof url === 'string' &&
      /^https:\/\/s3\.[a-z0-9-]+\.amazonaws\.com\/.+/.test(url)
    );
  }

  defaultMessage() {
    return 'The URL must be a valid S3 bucket link.';
  }
}

export function IsS3Url(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsS3UrlConstraint,
    });
  };
}
