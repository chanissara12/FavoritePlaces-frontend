import { Component, inject, signal } from '@angular/core';
import { ModalComponent } from "../../../../shared/modal/modal.component";
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PlacesService } from '../../services/places.service';
import { UsersService } from '../../../users/services/users.service';

@Component({
  selector: 'app-new-place',
  standalone: true,
  imports: [ModalComponent, FormsModule, RouterLink],
  templateUrl: './new-place.component.html',
  styleUrl: './new-place.component.css'
})
export class NewPlaceComponent {
  enteredTitle = signal('');
  enteredAlt = signal('');
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  private placesService = inject(PlacesService);
  private usersService = inject(UsersService);
  private router = inject(Router);
  currentUser = this.usersService.currentUserData;

  onSelectImage(event: Event) {
    console.log(event);
    console.log(event.target);
    const input = event.target as HTMLInputElement
    console.log(input.files?.item);
    console.log(input.files?.item.name);
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      console.log(this.selectedFile);

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit() {
    if (!this.selectedFile) {
      return;
    }

    const filename = this.enteredTitle().toLowerCase().replace(/\s+/g, '-')

    const formData = new FormData();

    formData.append('title', this.enteredTitle());
    formData.append('alt', this.enteredAlt());
    formData.append('formFile', this.selectedFile, filename);
    if (this.currentUser().roles.includes('admin')) {
      formData.append('add_by', 'admin');
      formData.append('isApproved', 'Y');
    } else {
      formData.append('add_by', 'user');
      formData.append('isApproved', 'N');
    }

    console.log(formData);
    
    this.placesService.addNewPlaces(formData).subscribe({
      next: (place) => {
        // this.usersService.isLoggedIn.set(true);
        console.log(place);

        this.router.navigate([''], {
          replaceUrl: true
        })
      }
    })
  }
}
