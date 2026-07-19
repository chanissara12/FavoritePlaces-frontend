import { Routes } from "@angular/router";
import { LoginComponent } from "./users/components/login/login.component";
import { HomeComponent } from "./home/home.component";
import { RegisterComponent } from "./users/components/register/register.component";
import { NewPlaceComponent } from "./places/components/new-place/new-place.component";
import { ApprovePlacesComponent } from "./places/components/approve-places/approve-places.component";

export const routes: Routes = [
        {
            path: '', //starting path
            component: HomeComponent,
        },
        {
            path: 'login',
            component: LoginComponent
        },
        {
            path: 'register',
            component: RegisterComponent
        },
        {
            path: 'new-place',
            component: NewPlaceComponent
        },
        {
            path: 'approve-places',
            component: ApprovePlacesComponent
        }
    ]