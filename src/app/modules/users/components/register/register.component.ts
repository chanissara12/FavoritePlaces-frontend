import { Component, inject, signal } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from "../../../../shared/modal/modal.component";
import { ErrorService } from '../../../../shared/error.service';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ModalComponent, RouterLink, MatIconModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  enteredUserName = signal('');
  enteredPassword = signal('');
  enteredConfirmPassword = signal('');
  private usersService = inject(UsersService);
  private errorService = inject(ErrorService);
  private router = inject(Router);

  onClose() {
    this.router.navigate([''], {
      replaceUrl: true
    })
  }

  onSubmit() {
    if (this.enteredPassword() === this.enteredConfirmPassword()) {
      this.usersService.UserRegister(this.enteredUserName(), this.enteredPassword()).subscribe({
        next: (user) => {
          this.usersService.isLoggedIn.set(true);

          this.router.navigate([''], {
            replaceUrl: true
          })
        }
      })
    } else {
      this.errorService.showError('Incorrect Username or Password')
    }
  }
}
