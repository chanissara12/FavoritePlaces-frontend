import { Routes } from "@angular/router";
import { LoginComponent } from "./modules/users/components/login/login.component";
import { HomeComponent } from "./components/home/home.component";
import { RegisterComponent } from "./modules/users/components/register/register.component";
import { NewPlaceComponent } from "./modules/places/components/new-place/new-place.component";
import { ApprovePlacesComponent } from "./modules/places/components/approve-places/approve-places.component";

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