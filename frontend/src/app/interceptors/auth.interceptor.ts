import { inject, Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth';
import { environment } from '../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private authService = inject(AuthService);

    intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const token = this.authService.getToken();
        if (!token || !req.url.startsWith(environment.apiUrl)) {
            return next.handle(req);
        }

        const securedReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${ token }`
            }
        });

        return next.handle(securedReq);
    }
}
