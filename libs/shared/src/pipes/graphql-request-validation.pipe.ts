import { BadRequestException, Injectable, ValidationError, ValidationPipe } from '@nestjs/common';

import { AppLoggerService } from '@app/shared/app-logger/app-logger.service';

import { ValidationErrorCode } from '../enums/validation-error-codes.enum';
import { validationErrorToValidationCodeMap } from '../validation-error-to-code.map';

@Injectable()
export class GraphqlRequestValidationPipe extends ValidationPipe {
  constructor(private readonly logger: AppLoggerService) {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const stringifiedErrors = errors
          .map((err) => {
            const constr = err.constraints
              ? Object.entries(err.constraints)
                  .map(([key, message]) => {
                    let constraintError = validationErrorToValidationCodeMap[key];
                    if (!constraintError) {
                      this.logger.warn(`No map for validation key ${key}`, {
                        context: this.constructor.name,
                      });
                      constraintError = ValidationErrorCode.UNKNOWN;
                    }
                    return `[${constraintError}]: ${message}`;
                  })
                  .join(', ')
              : ``;
            return `${err.property} ${constr}`;
          })
          .join(', ');

        return new BadRequestException(stringifiedErrors, {
          description: stringifiedErrors,
        });
      },
    });
  }
}
