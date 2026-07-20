import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { ModalComponent } from "../../../../shared/modal/modal.component";
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, ModalComponent, MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  enteredUserName = signal('');
  enteredPassword = signal('');
  private usersService = inject(UsersService);
  private router = inject(Router);

  onClose() {
    this.router.navigate([''], {
      replaceUrl: true
    })
  }

  onSubmit(formData: NgForm) {
    if (formData.form.invalid) {
      return;
    }
    this.usersService.UserLogin(this.enteredUserName(), this.enteredPassword()).subscribe({
      next: (user) => {
        this.usersService.isLoggedIn.set(true);

        this.router.navigate([''], {
          replaceUrl: true
        })
      }
    })
  }
}
