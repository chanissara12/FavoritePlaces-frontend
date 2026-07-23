import { inject, Injectable, signal } from "@angular/core";
import { User } from "../models/users.model";
import { HttpClient } from "@angular/common/http";
import { ErrorService } from "../../../shared/services/error.service";
import { catchError, map, Observable, tap, throwError } from "rxjs";
import { environment } from "../../../../environments/environment.development";
import { getErrorMessages } from "../../../shared/utils/get-error-messages";

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private currentUser = signal<User>({
        userId: 0,
        userName: "",
        roles: []
    });
    isLoggedIn = signal<boolean>(false);
    
    private httpClient = inject(HttpClient);
    private errorService = inject(ErrorService);
    private url: string = environment.urlApi + 'users/';

    currentUserData = this.currentUser.asReadonly();

    public UserLogin(userName: string, password: string): Observable<Object> {
        return this.httpClient.post<{ currentUser: User }>(this.url + 'login', {
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
            roles: []
        });
        this.isLoggedIn.set(false)
    }
}