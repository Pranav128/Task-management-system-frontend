import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { AuthInterceptor } from './interceptor/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    provideHttpClient(
      withInterceptorsFromDi(),
  ),
  {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,

  }, provideAnimationsAsync(), provideAnimationsAsync()
  ]
};
