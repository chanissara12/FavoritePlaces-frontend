import { Component, inject, Signal, signal } from '@angular/core';
import { ModalComponent } from "../../../../shared/modal/modal.component";
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CloseBtnComponent } from "../../../../shared/buttons/close-btn/close-btn.component";
import { MatIconModule } from "@angular/material/icon";
import { User } from '../../../users/models/users.model';
import { UsersService } from '../../../users/services/users.service';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [ModalComponent, FormsModule, RouterLink, CloseBtnComponent, MatIconModule],
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.css'
})
export class NewPostComponent {
      enteredTitle = signal<string>('');
      enteredAlt = signal<string>('');
      
      private postsService = inject(PostsService);
      private usersService = inject(UsersService);
      private router = inject(Router);
      currentUser: Signal<User> = this.usersService.currentUserData;
      imagePreview: string | null = null;
      selectedFile: File | null = null;
  
      public onSelectImage(event: Event): void {
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
  
      public async onSubmit(): Promise<void> {
          if (!this.selectedFile) {
              return;
          }
  
          const filename = this.enteredTitle().toLowerCase().replace(/\s+/g, '-')
  
          const formData = new FormData();
  
          formData.append('title', this.enteredTitle());
          formData.append('alt', this.enteredAlt());
          formData.append('file', this.selectedFile, filename);
        //   if (this.currentUser().roles.includes('admin')) {
        //       formData.append('add_by', 'admin');
        //       formData.append('isApproved', 'Y');
        //   } else {
        //       formData.append('add_by', 'user');
        //       formData.append('isApproved', 'N');
        //   }
          formData.append('userId', this.currentUser().userId.toString());
  
          console.log(formData.get('title'));
          console.log(formData.get('alt'));
          console.log(formData.get('file'));
          console.log(formData.get('userId'));
  
          await this.postsService.postNewPost(formData).subscribe({
              next: (post) => {
                  console.log(post);
  
                  this.router.navigate([''], {
                      replaceUrl: true
                  })
              }
          })
      }
}
