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
import { PromoteComponent } from "./modules/posts/components/promote/promote.component";
import { EditPostComponent } from "./modules/posts/components/edit-post/edit-post.component";
import { EditPostCommentComponent } from "./modules/posts/components/edit-post-comment/edit-post-comment.component";
import { UnauthorizeComponent } from "./shared/pages/unauthorize/unauthorize.component";

export const routes: Routes = [
    {
        path: '', //starting path
        component: HomeComponent,
    },
    {
        path: 'unauthorize',
        component: UnauthorizeComponent,
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
        path: 'user-profile/:userId/:userName',
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
    {
        path: 'promote-posts',
        component: PromoteComponent
    },
    {
        path: 'edit-post/:postId',
        component: EditPostComponent
    },
    {
        path: 'edit-post-comment/:commentId',
        component: EditPostCommentComponent
    },
]