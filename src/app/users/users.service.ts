import { inject, Injectable, signal } from "@angular/core";
import { User } from "./users.model";
import { HttpClient } from "@angular/common/http";
import { ErrorService } from "../shared/error.service";
import { catchError, map, tap, throwError } from "rxjs";
import { environment } from "../../environments/environment.development";

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private currentUser = signal<User>({
        user_id: 0,
        user_name: "",
        password: ""
    });
    private currentUserRole = signal<string[]>([]);
    isLoggedIn = signal(false);
    private httpClient = inject(HttpClient);
    private errorService = inject(ErrorService);
    private url = environment.urlApi + 'users/';

    currentUserData = this.currentUser.asReadonly();
    currentUserRoleData = this.currentUserRole.asReadonly();

    UserLogin(user_name: string, password: string) {
        return this.httpClient.post<{ currentUser: User, roles: { user_id: number, role_id: string }[] }>(this.url + 'login', {
            user_name: user_name,
            password: password
        }).pipe(
            tap({
                next: (resData) => {
                    this.currentUser.set(resData.currentUser);
                    const roles = resData.roles.map(x => x.role_id);
                    this.currentUserRole.set(roles);
                }
            }),
            catchError(error => {
                this.errorService.showError(error.error);
                this.errorService.showError(error.error.title);
                return throwError(() => new Error(error.error.title))
            })
        )
    }

    UserRegister(user_name: string, password: string) {
        return this.httpClient.post<{ currentUser: User }>(this.url + 'register', {
            user_name: user_name,
            password: password
        }).pipe(
            // map((resData) => {
            //     if (Array.isArray(resData.currentUser)) {
            //         return resData.currentUser[0];
            //     }
            //     return resData.currentUser;
            // }),
            tap({
                next: (resData) => {
                    this.currentUser.set(resData.currentUser);
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