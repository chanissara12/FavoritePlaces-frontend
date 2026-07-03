import { Component, inject } from '@angular/core';
import { UsersService } from '../users/users.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private usersService = inject(UsersService);
  
  isLoggedIn = this.usersService.isLoggedIn;
}
