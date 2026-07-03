import { ApplicationConfig } from "@angular/core";
import { provideRouter, withComponentInputBinding, withRouterConfig } from "@angular/router";
import { routes } from "./app.routes";
import { HttpRequest, HttpHandlerFn, provideHttpClient, withInterceptors, HttpEventType } from '@angular/common/http';
import { tap } from 'rxjs';

function loggingInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {
    console.log('[Outgoing Request]');
    console.log(request);
    return next(request).pipe(
        tap({
            next: event => {
                if (event.type === HttpEventType.Response) {
                    console.log('[Incomimg Response]');
                    console.log(event.status);
                    console.log(event.body);
                }
            }
        })
    );
}

export const appConfig: ApplicationConfig = {
    providers: [provideHttpClient(
        withInterceptors([loggingInterceptor])
    ),
    provideRouter(routes, withComponentInputBinding(), withRouterConfig({
        paramsInheritanceStrategy: 'always'
    }))]
}