import { Component, inject, OnInit, signal, Signal } from '@angular/core';
import { AvailablePlacesComponent } from "../../modules/places/components/available-places/available-places.component";
import { HeaderComponent } from "../header/header.component";
import { UsersService } from '../../modules/users/services/users.service';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../modules/users/models/users.model';
import { FeedComponent } from "../../modules/posts/components/feed/feed.component";
import { AuthService } from '../../shared/services/auth.service';
import { PostsService } from '../../modules/posts/services/posts.service';
import { FormsModule } from '@angular/forms';
import { DxButtonModule } from 'devextreme-angular';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        AvailablePlacesComponent,
        HeaderComponent,
        RouterLink,
        MatIconModule,
        FeedComponent,
        FormsModule,
        DxButtonModule 
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
    private usersService = inject(UsersService);
    private postsService = inject(PostsService);
    private authService = inject(AuthService);
    private router = inject(Router);
    currentUser: Signal<User> = this.usersService.currentUserData;

    isLoggedIn: Signal<boolean> = this.usersService.isLoggedIn;

    isPostsPage = signal<boolean>(true);

    ngOnInit(): void {
        this.usersService.loadUserFromLocalStorage();
    }

    public onLogOut(): void {
        this.usersService.UserLogout();
        this.router.navigate([''], {
            replaceUrl: true
        })
        this.postsService.clearPostList();
    }
}
