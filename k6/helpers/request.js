import { check } from 'k6';
import http from 'k6/http';

export function request(method, endpoint, { token, body, label, checks, tags = {} } = {}) {
  const params = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    tags: { endpoint, ...tags },
  };

  const payload = body ? JSON.stringify(body) : null;
  const response =
    method === 'GET' ? http.get(endpoint, params) : http.post(endpoint, payload, params);

  check(response, {
    [label || endpoint]: (r) => {
      try {
        const parsed = JSON.parse(r.body);
        const isSuccess = checks(r, parsed.data, parsed.code, parsed);
        if (!isSuccess) {
          console.log(`FAILURE: ${label}`);
          console.log(`  endpoint: ${endpoint}`);
          console.log(`  status: ${r.status}`);
          console.log(`  body: ${r.body}`);
          console.log(`  payload: ${payload}`);
        }
        return isSuccess;
      } catch (err) {
        console.log(`FAILURE: ${label} — parse error: ${err}`);
        console.log(`  endpoint: ${endpoint}`);
        console.log(`  status: ${r.status}`);
        console.log(`  body: ${r.body}`);
        return false;
      }
    },
  });

  return response;
}
