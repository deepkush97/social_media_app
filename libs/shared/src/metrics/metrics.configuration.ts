import { Provider } from '@nestjs/common';

import { makeCounterProvider } from '@willsoto/nestjs-prometheus';

import { MetricLabel, MetricName } from './metrics.constant';

export const providers: Provider[] = [
  makeCounterProvider({
    name: MetricName.REDIRECT_TOTAL,
    labelNames: [MetricLabel.SOURCE, MetricLabel.STATUS] as const,
    help: 'Url redirect counter',
  }),
  makeCounterProvider({
    name: MetricName.LOGIN_TOTAL,
    labelNames: [MetricLabel.STATUS, MetricLabel.CAUSE] as const,
    help: 'Login counter',
  }),
  makeCounterProvider({
    name: MetricName.REGISTRATION_TOTAL,
    labelNames: [MetricLabel.STATUS, MetricLabel.CAUSE] as const,
    help: 'Registration counter',
  }),
  makeCounterProvider({
    name: MetricName.SESSION_TOTAL,
    labelNames: [MetricLabel.STATUS] as const,
    help: 'session counter',
  }),
];
