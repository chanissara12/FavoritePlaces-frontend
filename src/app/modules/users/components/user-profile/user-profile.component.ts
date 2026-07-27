import { Component, inject, input, Signal } from '@angular/core';
import { ModalComponent } from "../../../../shared/modal/modal.component";
import { MatIconModule } from "@angular/material/icon";
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/users.model';
import { CloseBtnComponent } from "../../../../shared/buttons/close-btn/close-btn.component";
import { UserPostsComponent } from "../../../posts/components/user-posts/user-posts.component";

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [ModalComponent, MatIconModule, CloseBtnComponent, UserPostsComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  userId = input<number>();
  userName = input<string>('');
  private router = inject(Router);
  private usersService = inject(UsersService);

  // currentUser: Signal<User> = this.usersService.currentUserData;

  public onClose(): void {
    this.router.navigate([''], {
      replaceUrl: true
    })
  }

}
