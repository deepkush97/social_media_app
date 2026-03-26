import { Injectable, NestMiddleware } from '@nestjs/common';

import { NextFunction, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';

import { AsyncStore, IAsyncStore } from '../utils/async.store';

@Injectable()
export class AsyncStorageMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const idFromRequest = req['requestId'] || req.headers['x-request-id'];

    const requestId = idFromRequest ?? uuid();
    res.setHeader('x-request-id', requestId.toString());

    const store: IAsyncStore = { requestId };
    AsyncStore.run(store, next);
  }
}
