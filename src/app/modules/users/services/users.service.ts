import { inject, Injectable, signal } from "@angular/core";
import { User } from "../models/users.model";
import { HttpClient } from "@angular/common/http";
import { ErrorService } from "../../../shared/error.service";
import { catchError, map, tap, throwError } from "rxjs";
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
    // private currentUserRole = signal<string[]>([]);
    isLoggedIn = signal(false);
    private httpClient = inject(HttpClient);
    private errorService = inject(ErrorService);
    private url = environment.urlApi + 'users/';

    currentUserData = this.currentUser.asReadonly();
    // currentUserRoleData = this.currentUserRole.asReadonly();

    UserLogin(userName: string, password: string) {
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
                let errorMessages = getErrorMessages(error)
                this.errorService.showError(errorMessages);
                return throwError(() => new Error(errorMessages))
            })
        )
    }

    UserRegister(userName: string, password: string) {
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
                let errorMessages = getErrorMessages(error)
                this.errorService.showError(errorMessages);
                return throwError(() => new Error(errorMessages))
            })
        )
    }

    UserLogout() {
        this.currentUser.set({
            userId: 0,
            userName: "",
            roles: []
        });
        this.isLoggedIn.set(false)
    }
}