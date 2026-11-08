import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface, ValidationOptions, registerDecorator } from 'class-validator';
import { TemplateType } from '../enums/template-type.enum';

@ValidatorConstraint({ name: 'TemplateTypeRadiologistConstraint', async: false })
export class TemplateTypeRadiologistConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const object = args.object as any;
    const type = object.type;
    
    // Check if radiologistId property exists in the object
    const radiologistIdExists = 'radiologistId' in object;
    
    if (type === TemplateType.DEFAULT && radiologistIdExists) {
      return false; // DEFAULT templates should not have radiologistId in body
    }
    
    if (type === TemplateType.CUSTOM && !radiologistIdExists) {
      return false; // CUSTOM templates must have radiologistId property
    }
    
    return true;
  }
  
  defaultMessage(args: ValidationArguments) {
    const object = args.object as any;
    const type = object.type;
    
    if (type === TemplateType.DEFAULT) {
      return 'DEFAULT templates should not include radiologistId in the request';
    }
    
    if (type === TemplateType.CUSTOM) {
      return 'CUSTOM templates must include a radiologistId in the request';
    }
    
    return 'Invalid template type and radiologistId combination';
  }
}

export function IsValidTemplateTypeRadiologist(validationOptions?: ValidationOptions) {
  return function (object: Function) {
    registerDecorator({
      name: 'isValidTemplateTypeRadiologist',
      target: object,
      propertyName: undefined,
      options: validationOptions,
      constraints: [],
      validator: TemplateTypeRadiologistConstraint
    });
  };
}
