import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  isEmail,
} from 'class-validator';

interface ValidateGroupFieldOptions {
  groupField: string;
  type?: 'string' | 'email' | 'number';
  emailDomain?: string;
}

export function ValidateGroupField(
  options: ValidateGroupFieldOptions,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'validateGroupField',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [options],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const { groupField, type, emailDomain } = args.constraints[0];
          const isGroup = (args.object as any)[groupField];

          if (typeof value !== 'string') return false;

          const items = value
            .split(',')
            .map((item) => item.trim())
            .filter((item) => item.length > 0);

          if (isGroup && items.length < 2) {
            return false;
          }

          if (!isGroup && items.length !== 1) {
            return false;
          }

          for (const item of items) {
            if (item.length === 0) return false;

            if (type === 'email') {
              const emailValid = isEmail(item);
              const domainValid = emailDomain
                ? item.toLowerCase().endsWith(emailDomain.toLowerCase())
                : true;

              if (!emailValid || !domainValid) {
                return false;
              }
            }
            if (type === 'number') {
              const numberValue = Number(item);
              if (isNaN(numberValue)) {
                return false;
              }
            }
          }

          return true;
        },

        defaultMessage(args: ValidationArguments) {
          const { groupField, type, emailDomain } = args.constraints[0];
          const isGroup = (args.object as any)[groupField];

          if (type === 'email') {
            if (emailDomain) {
              return isGroup
                ? `All emails must be valid and use the domain ${emailDomain}, separated by commas.`
                : `Email must be valid and use the domain ${emailDomain}.`;
            } else {
              return isGroup
                ? `All emails must be valid, separated by commas.`
                : `Email must be valid.`;
            }
          }

          return isGroup
            ? `All ${args.property} must be non-empty and separated by commas.`
            : `${args.property} cannot be empty and must not contain commas.`;
        },
      },
    });
  };
}
