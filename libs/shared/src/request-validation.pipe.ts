import { BadRequestException, Injectable, ValidationError, ValidationPipe } from '@nestjs/common';

import { AppLoggerService } from './app-logger/app-logger.service';

import { AppCodes } from './app-codes.enum';
import { AppResponse } from './app-response.dto';
import { ValidationErrorCode } from './validation-error-codes.enum';
import { validationErrorToValidationCodeMap } from './validation-error-to-code.map';

@Injectable()
export class RequestValidationPipe extends ValidationPipe {
  constructor(private readonly logger: AppLoggerService) {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const formattedErrors = errors.reduce((acc, err) => {
          acc[err.property] = err.constraints
            ? Object.keys(err.constraints).map((constraint) => {
                const constraintError = validationErrorToValidationCodeMap[constraint];
                if (constraintError) {
                  return constraintError;
                }
                this.logger.warn(`unknown validation error: ${constraint}`, {
                  context: RequestValidationPipe.name,
                });
                return ValidationErrorCode.UNKNOWN;
              })
            : [];
          return acc;
        }, {});

        return new BadRequestException(
          new AppResponse({
            code: AppCodes.BAD_REQUEST,
            data: formattedErrors,
          }),
        );
      },
    });
  }
}
