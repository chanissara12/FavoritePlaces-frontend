import { inject, Injectable, signal } from "@angular/core";
import { User } from "../models/users.model";
import { HttpClient } from "@angular/common/http";
import { ErrorService } from "../../../shared/services/error.service";
import { catchError, map, Observable, tap, throwError } from "rxjs";
import { environment } from "../../../../environments/environment.development";
import { getErrorMessages } from "../../../shared/utils/get-error-messages";
import { clearAccessToken, clearRefreshToken } from "../../../shared/utils/token-handler";

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private currentUser = signal<User>({
        userId: 0,
        userName: "",
        roles: [],
        accessToken: "",
        refreshToken: ""
    });
    isLoggedIn = signal<boolean>(false);

    private httpClient = inject(HttpClient);
    private errorService = inject(ErrorService);
    private url: string = environment.urlApi + 'users/';
    private urlLogin: string = environment.urlApi + 'login/';

    currentUserData = this.currentUser.asReadonly();

    public loadUserFromLocalStorage(): void {
        const user = localStorage.getItem('currentUser');

        if (user) {
            this.currentUser.set(JSON.parse(user));
            this.isLoggedIn.set(true)
        }
    }

    public UserLogin(userName: string, password: string): Observable<Object> {
        return this.httpClient.post<{ currentUser: User }>(this.urlLogin, {
            userName: userName,
            password: password
        }).pipe(
            tap({
                next: (resData) => {
                    this.currentUser.set(resData.currentUser);
                    localStorage.setItem('currentUser', JSON.stringify(this.currentUser()));
                    localStorage.setItem('accessToken', resData.currentUser.accessToken)
                    localStorage.setItem('refreshToken', resData.currentUser.refreshToken)
                }
            }),
            catchError(error => {
                let errorMessages: string = getErrorMessages(error)
                this.errorService.showError(errorMessages);
                return throwError(() => new Error(errorMessages))
            })
        )
    }

    public UserRegister(userName: string, password: string): Observable<Object> {
        return this.httpClient.post<{ currentUser: User }>(this.url + 'register', {
            userName: userName,
            password: password
        }).pipe(
            tap({
                next: (resData) => {
                    this.currentUser.set(resData.currentUser);
                }
            }),
            catchError(error => {
                let errorMessages: string = getErrorMessages(error)
                this.errorService.showError(errorMessages);
                return throwError(() => new Error(errorMessages))
            })
        )
    }

    public UserLogout(): void {
        this.currentUser.set({
            userId: 0,
            userName: "",
            roles: [],
            accessToken: "",
            refreshToken: ""
        });
        localStorage.setItem('currentUser', "");
        clearAccessToken();
        clearRefreshToken();
        this.isLoggedIn.set(false)
    }
}