import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, filter, Observable, of, switchMap, take, tap, throwError } from 'rxjs';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<any>(null);

export const appInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    const router = inject(Router)

    // const no401Refresh = request.context.get(NO_401_REFRESH);
    request.addToken(request);

    return next(request)
        .pipe(
            tap(handleTokens),
              catchError((err: HttpErrorResponse) => {
                return throwError(() => err);
            // catchError((err: HttpErrorResponse) => {
            //     if ([401, 403].includes(err.status)) {
            //         if (err.status === 401 && !no401Refresh)
            //             return handle401WithRefreshError(request, next, auth);
            //         else
            //             return handle401Or403Error(err, shared, router);
            //     }
            //     return throwError(() => err);
            })
        )
}

//สำหรับเพิ่ม token 
const addToken = (request: HttpRequest<any>) => {
    const token = getAccessToken();
    return request.clone({
        setHeaders: {
            'Authorization': `Bearer ${token}`
        }
    })
}

//จัดการ token
const handleTokens = (httpEvent: HttpEvent<any>) => {
    if (!(httpEvent instanceof HttpResponse))
        return;
    if (!httpEvent.ok)
        return;

    if (!httpEvent.headers.has('Update-AccessToken')
        && !httpEvent.headers.has('Update-RefreshToken')
        && !httpEvent.headers.has('Update-System'))
        return;

    const accessToken = httpEvent.headers.get('Update-AccessToken') || '';
    if (!!accessToken)
        setAccessToken(accessToken);

    const refreshToken = httpEvent.headers.get('Update-RefreshToken') || '';
    if (!!refreshToken)
        setRefreshToken(refreshToken);

    // const system = httpEvent.headers.get('Update-System') || '';
    // if (!!system)
    //     setSystem(system)
}

const handle401WithRefreshError = (request: HttpRequest<any>, next: HttpHandlerFn, auth: AuthService): Observable<any> => {
    if (!isRefreshing) {
        isRefreshing = true;
        refreshTokenSubject.next(null);

        const refreshToken = getRefreshToken();
        const refreshTokenParam: Partial<RefreshTokenParam> = { refreshToken };
        return auth.refreshToken(refreshTokenParam)
            .pipe(
                switchMap(() => {
                    isRefreshing = false;
                    refreshTokenSubject.next('');
                    return next(addToken(request));
                })
            );
    }
    return refreshTokenSubject
        .pipe(
            filter(token => token != null),
            take(1),
            switchMap(() => {
                return next(addToken(request));
            })
        );
}

const handle401Or403Error = (errorResponse: HttpErrorResponse, shared: SharedService, router: Router): Observable<any> => {
    clearAccessToken();
    clearRefreshToken();

    let errorMessage = getErrorMessage(errorResponse);
    shared.hideLoading(); // for close loading screen opened from before call 401 request 
    router.navigate([Route.unauthorized], {
        skipLocationChange: true,
        state: {
            message: errorMessage
        }
    });
    return of(errorResponse.error);
}

const getErrorMessage = (errorResponse: HttpErrorResponse): string => {
    let errorMessage = '';
    const errorResult = errorResponse.error;
    // const errorResult = errorResponse.error as GlobalExceptionResult;
    const errors = errorResult?.errors;
    if (typeof (errors) === 'string')
        errorMessage = errors;
    else if (typeof (errors) === 'object' && Array.isArray(errors))
        errorMessage = errors[0]?.['message'];
    return errorMessage;
}

const getAccessToken() = () => {
    
}