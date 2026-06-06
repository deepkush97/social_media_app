import { check, sleep } from 'k6';
import http from 'k6/http';

export function request(
  method,
  endpoint,
  { token, body, label, expect: ex, retry, tags = {} } = {},
) {
  const params = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    tags: { endpoint, ...tags },
  };

  const payload = body && typeof body === 'object' ? JSON.stringify(body) : body;

  function doRequest() {
    const httpMethod = method.toLowerCase();
    if (typeof http[httpMethod] !== 'function') {
      throw new Error(`Unsupported HTTP method: ${method}`);
    }

    const res =
      httpMethod === 'get' || httpMethod === 'delete'
        ? http[httpMethod](endpoint, params)
        : http[httpMethod](endpoint, payload, params);

    let parsed = null;
    try {
      if (res.body) {
        parsed = JSON.parse(res.body);
      }
    } catch {
      // Gracefully catch non-JSON responses (e.g. 204 No Content or HTML error pages)
    }

    return { res, parsed };
  }

  function isValid({ res, parsed }) {
    if (ex.status !== undefined && res.status !== ex.status) return false;

    // If the test expects code/data assertions, the response MUST have valid parsed JSON
    if ((ex.code !== undefined || ex.data !== undefined) && !parsed) return false;
    if (ex.code !== undefined && parsed.code !== ex.code) return false;

    if (ex.data !== undefined && ex.data !== null) {
      if (typeof ex.data === 'function') {
        if (!ex.data(parsed.data)) return false;
      } else {
        for (const [key, validator] of Object.entries(ex.data)) {
          const actual =
            parsed.data && typeof parsed.data === 'object' ? parsed.data[key] : undefined;

          if (typeof validator === 'function') {
            if (!validator(actual)) return false;
          } else if (actual !== validator) {
            return false;
          }
        }
      }
    }
    return true;
  }

  let result = doRequest();

  if (retry && !isValid(result)) {
    for (let i = 0; i < retry.count; i++) {
      sleep(retry.delayMs / 1000);
      console.log('>>>>> retrying');
      result = doRequest();
      if (isValid(result)) break;
    }
  }

  check(result.res, {
    [label]: () => {
      const ok = isValid(result);
      if (!ok) {
        console.error(
          `FAILURE: ${label} 
          Endpoint: ${endpoint}
          Status: ${result.res.status}
          Body: ${result.res.body}`,
        );
      }
      return ok;
    },
  });

  return result.res;
}

export function expect(overrides = {}) {
  return {
    status: 200,
    code: 'OPERATION_SUCCESS',
    data: undefined,
    ...overrides,
  };
}
