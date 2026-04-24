import { registerDecorator, ValidationArguments, ValidatorOptions } from 'class-validator';

export const IsNotEqualTo = (property: string, options?: ValidatorOptions) => {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      name: 'isNotEqualTo',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const [property] = args.constraints;
          const propertyValue = args.object[property];
          return value !== propertyValue;
        },
        defaultMessage: (args: ValidationArguments) => {
          return `${args.property} cannot be same as ${args.constraints[0]}`;
        },
      },
    });
  };
};
