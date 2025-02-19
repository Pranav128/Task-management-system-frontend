import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  // private authService = inject(AuthService);
  constructor(private router: Router, private authService: AuthService) {}

   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const token = this.authService.getToken();
  
      // Clone request and attach token if available
      let clonedReq = req;
      if (token) {
        clonedReq = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        });
      }
  
      return next.handle(clonedReq).pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('HTTP Error:', error);
  
          if (error.status === 401) {
            // Unauthorized - redirect to login
            this.authService.logout();
            this.router.navigate(['/login']);
          } else if (error.status === 403) {
            // Forbidden - show access denied page
            this.router.navigate(['/access-denied']);
          } else if (error.status >= 400 && error.status < 500) {
            // Other client errors - go to error page
            this.router.navigate(['/error']);
          } else if (error.status >= 500) {
            // Server errors - show generic error page
            this.router.navigate(['/server-error']);
          }
  
          return throwError(() => new Error(error.message));
        })
      );
    }
}


  // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   const token = this.authService.getToken();

  //   if (token) {
  //     const clonedReq = req.clone({
  //       setHeaders: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     return next.handle(clonedReq);
  //   }

  //   return next.handle(req);
  // }