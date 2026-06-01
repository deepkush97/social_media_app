import { describe, expect, it } from 'vitest';

import { AppCodes } from './enums/app-codes.enum';

import { AppResponse } from './app-response.dto';

describe('AppResponse', () => {
  it('stores code and data', () => {
    const response = new AppResponse({ code: AppCodes.OK_CREATED, data: { id: 1 } });

    expect(response.code).toBe(AppCodes.OK_CREATED);
    expect(response.data).toEqual({ id: 1 });
  });

  it('allows data to be undefined', () => {
    const response = new AppResponse({ code: AppCodes.OPERATION_SUCCESS });

    expect(response.code).toBe(AppCodes.OPERATION_SUCCESS);
    expect(response.data).toBeUndefined();
  });

  it('copies values from the input object', () => {
    const input = { code: AppCodes.OPERATION_SUCCESS as AppCodes, data: 'result' };
    const response = new AppResponse(input);

    expect(response.code).toBe(AppCodes.OPERATION_SUCCESS);
    expect(response.data).toBe('result');
  });
});
