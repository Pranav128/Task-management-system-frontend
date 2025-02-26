import { ApplicationConfig } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';

import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { AuthService } from './auth/auth.service';
import { AuthInterceptor } from './interceptor/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    AuthService,
    provideAnimationsAsync(),
    provideRouter(routes, withRouterConfig({ onSameUrlNavigation: 'reload' })) ,// ✅ Fix reload issue

    // provideRouter(routes),
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
