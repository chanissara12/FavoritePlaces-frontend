import { Component, inject, Signal } from '@angular/core';
import { AvailablePlacesComponent } from "../../modules/places/components/available-places/available-places.component";
import { HeaderComponent } from "../header/header.component";
import { UsersService } from '../../modules/users/services/users.service';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../modules/users/models/users.model';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        AvailablePlacesComponent,
        HeaderComponent,
        RouterLink,
        MatIconModule
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent {
    private usersService = inject(UsersService);
    currentUser: Signal<User> = this.usersService.currentUserData;

    isLoggedIn: Signal<boolean> = this.usersService.isLoggedIn;

    public onLogOut(): void {
        this.usersService.UserLogout();
    }
}
