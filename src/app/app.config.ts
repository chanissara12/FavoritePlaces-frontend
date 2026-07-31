import { APP_INITIALIZER, ApplicationConfig } from "@angular/core";
import { provideRouter, withComponentInputBinding, withRouterConfig } from "@angular/router";
import { routes } from "./app.routes";
import { HttpRequest, HttpHandlerFn, provideHttpClient, withInterceptors, HttpEventType } from '@angular/common/http';
import { tap } from 'rxjs';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
// import { appInterceptor } from "./app.interceptor";

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
        withInterceptors([loggingInterceptor])),
        // withInterceptors([loggingInterceptor, appInterceptor])),
    // {
    //     provide: APP_INITIALIZER,
    //     useFactory: (utils: UtilsService) => utils.initialize(),
    //     deps: [UtilsService],
    //     multi: true
    // },
    provideRouter(routes, withComponentInputBinding(), withRouterConfig({
        paramsInheritanceStrategy: 'always'
    })), provideAnimationsAsync()]
}