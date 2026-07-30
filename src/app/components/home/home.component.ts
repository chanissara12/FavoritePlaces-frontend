import { Component, inject, OnInit, signal, Signal } from '@angular/core';
import { AvailablePlacesComponent } from "../../modules/places/components/available-places/available-places.component";
import { HeaderComponent } from "../header/header.component";
import { UsersService } from '../../modules/users/services/users.service';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../modules/users/models/users.model';
import { FeedComponent } from "../../modules/posts/components/feed/feed.component";

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        AvailablePlacesComponent,
        HeaderComponent,
        RouterLink,
        MatIconModule,
        FeedComponent
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
    private usersService = inject(UsersService);
    currentUser: Signal<User> = this.usersService.currentUserData;

    isLoggedIn: Signal<boolean> = this.usersService.isLoggedIn;

    ngOnInit(): void {
        this.usersService.loadUserFromLocalStorage();
    }

    public onLogOut(): void {
        this.usersService.UserLogout();
    }
}
