import { Global, Module } from '@nestjs/common';

import { LoggerModule } from 'nestjs-pino';
import { v4 as uuidV4 } from 'uuid';

import { AppConfigService } from '../app-config/app-config.service';
import { AppEnvironment } from '../enums/app-environment.enum';

import { AppLoggerService } from './app-logger.service';
import { DatabaseLoggerService } from './database-logger.service';

@Global()
@Module({
  imports: [
    LoggerModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => {
        const isProduction = configService.env === AppEnvironment.production;

        const logLevel = configService.logLevel;

        return {
          pinoHttp: {
            level: logLevel,
            genReqId: (req, res): string => {
              const existingID = req.headers['x-request-id'];
              if (existingID) return existingID as string;
              const id = uuidV4();
              res.setHeader('x-request-id', id);
              req.id = id;
              req['requestId'] = id;
              return id;
            },
            autoLogging: false,
            quietReqLogger: true,
            transport: isProduction
              ? undefined
              : {
                  target: 'pino-pretty',
                  options: {
                    colorize: true,
                    singleLine: true,
                    messageFormat: '[{reqId}] [{context}] {msg}',
                    ignore: 'pid,hostname,context,requestId,req,res,reqId',
                    translateTime: 'HH:MM:ss.l',
                  },
                },
            serializers: {
              req: (req): object => ({
                requestId: req.id ?? req['requestId'],
                method: req.method,
                url: req.url,
              }),
              res: (res): object => ({
                statusCode: res.statusCode,
              }),
            },
          },
        };
      },
    }),
  ],
  providers: [AppLoggerService, DatabaseLoggerService],
  exports: [AppLoggerService, DatabaseLoggerService],
})
export class AppLoggerModule {}
