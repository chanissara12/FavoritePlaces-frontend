import { Component, inject, Signal } from '@angular/core';
import { ModalComponent } from "../../../../shared/modal/modal.component";
import { MatIconModule } from "@angular/material/icon";
import { UserPlacesComponent } from "../../../places/components/user-places/user-places.component";
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/users.model';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [ModalComponent, MatIconModule, UserPlacesComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  private router = inject(Router);
  private usersService = inject(UsersService);

  currentUser: Signal<User> = this.usersService.currentUserData;

  public onClose(): void {
    this.router.navigate([''], {
      replaceUrl: true
    })
  }

}
