import { Routes } from "@angular/router";
import { LoginComponent } from "./users/login/login.component";
import { HomeComponent } from "./home/home.component";
import { RegisterComponent } from "./users/register/register.component";

export const routes: Routes = [
        {
            path: '', //starting path
            component: HomeComponent,
            // title: 'No task selected'
        },
        {
            path: 'login',
            component: LoginComponent
        },
        {
            path: 'register',
            component: RegisterComponent
        }
    ]