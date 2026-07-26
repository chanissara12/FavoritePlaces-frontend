import { Routes } from "@angular/router";
import { LoginComponent } from "./modules/users/components/login/login.component";
import { HomeComponent } from "./components/home/home.component";
import { RegisterComponent } from "./modules/users/components/register/register.component";
import { NewPlaceComponent } from "./modules/places/components/new-place/new-place.component";
import { ApprovePlacesComponent } from "./modules/places/components/approve-places/approve-places.component";
import { PlaceDetailComponent } from "./modules/places/components/place-detail/place-detail.component";
import { UserProfileComponent } from "./modules/users/components/user-profile/user-profile.component";
import { PostDetailComponent } from "./modules/posts/components/post-detail/post-detail.component";
import { NewPostComponent } from "./modules/posts/components/new-post/new-post.component";

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
    },
    {
        path: 'place-detail/:placeId',
        component: PlaceDetailComponent
    },
    {
        path: 'user-profile/:userId',
        component: UserProfileComponent
    },
    {
        path: 'new-post',
        component: NewPostComponent
    },
    {
        path: 'post-detail/:postId',
        component: PostDetailComponent
    },
]