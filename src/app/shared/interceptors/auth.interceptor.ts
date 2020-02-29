import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private authService: AuthService,
        private router: Router,
    ) {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

        let requestToSent: HttpRequest<unknown>;

        if (this.authService.isLogged$.getValue() === true) {
            requestToSent = request.clone({ headers: request.headers.append('Authorization', 'Basic mock') });
        } else {
            requestToSent = request;
        }

        return next.handle(requestToSent).pipe(
            catchError((errorResponse: HttpErrorResponse) => {
                if (errorResponse.status === 401) {
                    this.router.navigateByUrl('/login');
                }
                return throwError(errorResponse);
            })
        );

    }

}
