import { inject, Injectable, signal } from "@angular/core";
import { User } from "./users.model";
import { HttpClient } from "@angular/common/http";
import { ErrorService } from "../shared/error.service";
import { catchError, map, tap, throwError } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private currentUser = signal<User>({
        user_id: 0,
        user_name: "",
        password: ""
    });
    isLoggedIn = signal(false);
    private httpClient = inject(HttpClient);
    private errorService = inject(ErrorService);

    currentUserData = this.currentUser.asReadonly();

    UserLogin(user_name: string, password: string) {
        return this.httpClient.post<{ currentUser: User }>('https://localhost:44304/api/users/login', {
            user_name: user_name,
            password: password
        }).pipe(
            map((resData) => {
                if (Array.isArray(resData.currentUser)) {
                    return resData.currentUser[0];
                }
                return resData.currentUser;
            }),
            tap({
                next: (currentUser) => {
                    this.currentUser.set(currentUser);
                }
            }),
            catchError(error => {
                this.errorService.showError(error.error);
                return throwError(() => new Error(error.error))
            })
        )
    }

    UserRegister(user_name: string, password: string) {
        return this.httpClient.post<{ currentUser: User }>('https://localhost:44304/api/users/register', {
            user_name: user_name,
            password: password
        }).pipe(
            map((resData) => {
                if (Array.isArray(resData.currentUser)) {
                    return resData.currentUser[0];
                }
                return resData.currentUser;
            }),
            tap({
                next: (currentUser) => {
                    this.currentUser.set(currentUser);
                }
            }),
            catchError(error => {
                this.errorService.showError(error.error);
                return throwError(() => new Error(error.error))
            })
        )
    }

    UserLogout() {
        this.currentUser.set({
            user_id: 0,
            user_name: "",
            password: ""
        });
        this.isLoggedIn.set(false)
    }
}