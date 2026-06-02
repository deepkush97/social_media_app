import { appBootstrap } from '@app/shared/app.bootstrap';

import '@app/shared/opentelemetry/opentelemetry.init';

import { AppModule } from './app.module';

void appBootstrap(AppModule);
