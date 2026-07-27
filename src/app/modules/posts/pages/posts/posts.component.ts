import { Component, inject, input, output, viewChild } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from '@angular/router';
import { PlacesViewModel } from '../../../places/models/place.model';
import { User } from '../../../users/models/users.model';
import { UsersService } from '../../../users/services/users.service';
import { PostViewModel } from '../../models/posts.model';
import { ConfirmUnfavoritePostModalComponent } from "../../../../shared/modal/confirm-unfavorite-post-modal/confirm-unfavorite-post-modal.component";
import { DatePipe } from '@angular/common';
import { ConfirmDeletePostModalComponent } from "../../../../shared/modal/confirm-delete-post-modal/confirm-delete-post-modal.component";

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [MatIconModule, RouterLink, ConfirmUnfavoritePostModalComponent, DatePipe, ConfirmDeletePostModalComponent],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css'
})
export class PostsComponent {
    posts = input.required<PostViewModel[]>();
    addFavPost = output<{postId: number, userId: number}>();
  
    dialogUnfavorite = viewChild<ConfirmUnfavoritePostModalComponent>('dialogUnfavorite');
    dialogDeletePost = viewChild<ConfirmDeletePostModalComponent>('dialogDeletePost');
  
    private usersService = inject(UsersService);
  
    currentUser: User = this.usersService.currentUserData();
    isAdmin: boolean = this.currentUser.roles.includes('admin');

    public handleFavPost(isFav: boolean, postId: number, userId: number): void {
      if (isFav) {
        this.onRemoveFavPost(postId, userId);
      } else {
        this.onAddFavPost(postId, userId);
      }
    }
  
    public onAddFavPost(postId: number, userId: number): void {
      this.addFavPost.emit({postId: postId, userId: userId});
    }
  
    public onRemoveFavPost(postId: number, userId: number): void {
      this.dialogUnfavorite()?.showDialog(postId, userId)
    }

    public onDeletePost(postId: number): void {
      this.dialogDeletePost()?.showDialog(postId)
    }
}
