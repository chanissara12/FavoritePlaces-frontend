import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from "@angular/router";
import { ErrorService } from './shared/error.service';
import { UsersService } from './users/services/users.service';
import { ErrorModalComponent } from "./shared/modal/error-modal/error-modal.component";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, ErrorModalComponent, RouterLink],
})
export class AppComponent {
  private errorService = inject(ErrorService);
  private usersService = inject(UsersService);
  currentUser = this.usersService.currentUserData;

  error = this.errorService.error;
  isLoggedIn = this.usersService.isLoggedIn;

  onLogOut() {
    this.usersService.UserLogout();
  }
}
