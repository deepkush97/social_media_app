import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { appCodeToStatusMap } from 'apps/gateway/src/app-code-to-status.map';
import { Request, Response } from 'express';
import { Counter, Histogram } from 'prom-client';
import { map, Observable, tap } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { AppLoggerService } from '@app/shared/app-logger/app-logger.service';
import { AppResponse } from '@app/shared/app-response.dto';
import { AppCodes } from '@app/shared/enums/app-codes.enum';
import { AsyncStore } from '@app/shared/utils/async.store';

import { HTTP_REQUEST_DURATION_SECONDS, HTTP_REQUESTS_TOTAL } from '../metrics/metrics.providers';

@Injectable()
export class GlobalInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: AppLoggerService,
    @InjectMetric(HTTP_REQUESTS_TOTAL) private readonly counter: Counter<string>,
    @InjectMetric(HTTP_REQUEST_DURATION_SECONDS) private readonly histogram: Histogram<string>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const { method, originalUrl } = request;
    const route = request.route?.path || originalUrl || '/unknown';

    if (originalUrl === '/metrics') {
      return next.handle();
    }

    const id = request['requestId'] || request.headers['x-request-id'] || uuid();
    const requestId = id.toString();
    response.setHeader('x-request-id', requestId);
    AsyncStore.set({ requestId });

    const start = Date.now();
    const endTimer = this.histogram.startTimer({ method, route });

    return next.handle().pipe(
      map((res) => {
        if (!(res instanceof AppResponse) && response.statusCode !== HttpStatus.FOUND) {
          this.logger.warn(`received response is not an instance of AppResponse`, {
            context: GlobalInterceptor.name,
          });
        }
        const code = res?.code ?? AppCodes.INTERNAL_ERROR;
        const status = appCodeToStatusMap[code] ?? 500;

        response.status(status);

        this.counter.inc({ method, route, status });
        endTimer({ status });

        return {
          code,
          ...(res?.data !== undefined ? { data: res.data } : {}),
        };
      }),
      tap(() => {
        const duration = Date.now() - start;
        const status = response.statusCode;

        this.logger.info(`${method} ${originalUrl} -> ${status} (${duration}ms)`, {
          context: GlobalInterceptor.name,
        });
      }),
    );
  }
}
