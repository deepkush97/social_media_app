export enum MetricName {
  REDIRECT_TOTAL = 'url_redirect_total',
  LOGIN_TOTAL = 'auth_login_total',
  REGISTRATION_TOTAL = 'auth_registration_total',
  SESSION_TOTAL = 'session_session_total',
}

export enum MetricLabel {
  STATUS = 'status',
  SOURCE = 'source',
  CAUSE = 'cause',
}

export enum MetricStatus {
  SUCCESS = 'success',
  FAIL = 'fail',
  OPEN = 'open',
  CLOSED = 'closed',
}

export enum MetricDataSource {
  CACHE = 'cache',
  DATABASE = 'database',
}

export enum MetricCause {
  BAD_REQUEST = 'bad_request',
  INVALID_CREDENTIALS = 'invalid_credentials',
  INVALID_EMAIL = 'invalid_email',
}
