import { ValidationErrorCode } from './validation-error-codes.enum';

export const validationErrorToValidationCodeMap: Record<string, ValidationErrorCode> = {
  isNotEmpty: ValidationErrorCode.REQUIRED,
  maxLength: ValidationErrorCode.MAX_LENGTH,
  isEmail: ValidationErrorCode.SHOULD_BE_AN_EMAIL,
  minLength: ValidationErrorCode.MIN_LENGTH,
  isDate: ValidationErrorCode.INVALID_DATE,
  isDateString: ValidationErrorCode.INVALID_DATE_STRING,
  whitelistValidation: ValidationErrorCode.UNNECESSARY_PARAM,
};
