import { Component, inject } from '@angular/core';
import { ModalComponent } from "../../../../shared/modal/modal.component";
import { MatIconModule } from "@angular/material/icon";
import { UserPlacesComponent } from "../../../places/components/user-places/user-places.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [ModalComponent, MatIconModule, UserPlacesComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  private router = inject(Router);

  onClose() {
    this.router.navigate([''], {
      replaceUrl: true
    })
  }

}
