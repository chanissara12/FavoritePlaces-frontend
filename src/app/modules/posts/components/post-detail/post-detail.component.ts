import { Component, inject, input, signal } from '@angular/core';
import { ModalComponent } from "../../../../shared/modal/modal.component";
import { MatIcon } from "@angular/material/icon";
import { PostCommentViewModel, PostViewModel } from '../../models/posts.model';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CloseBtnComponent } from "../../../../shared/buttons/close-btn/close-btn.component";
import { PostsService } from '../../services/posts.service';
import { UsersService } from '../../../users/services/users.service';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [ModalComponent, MatIcon, FormsModule, CloseBtnComponent],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css'
})
export class PostDetailComponent {
      postId = input.required<number>();
      enteredComment = signal<string>('');
  
      private postsService = inject(PostsService);
      // private placesService = inject(PlacesService);
      private usersService = inject(UsersService);
      private router = inject(Router);
  
      private _showAddComment: boolean = false;
      post: PostViewModel | undefined = undefined;
      postComments = signal<PostCommentViewModel[]>([]);
      // isLoggedIn: Signal<boolean> = this.usersService.isLoggedIn;
      currentUserId: number = this.usersService.currentUserData().userId; 
  
      public get opening(): boolean {
          return this._showAddComment;
      }
  
      public showAddComment(): void {
          this._showAddComment = true
      }
  
      public hideAddComment(): void {
          this._showAddComment = false
      }
  
      public onClose(): void {
          this.router.navigate([''], {
              replaceUrl: true
          })
      }

      public onEditComment(): void {
        
      }

      public onDeleteComment(postId: number): void {
        
      }

      public submitComment(): void {
        
      }
  
      async ngOnInit(): Promise<void> {
          this.post = await this.postsService.loadedPosts().find(post => post.postId == this.postId());
          await this.postsService.getPostComments(this.postId())
              .subscribe({ next: (resData) => this.postComments.set(resData) })
      }
  
      // public async submitComment(): Promise<void> {
      //     console.log(this.usersService.currentUserData());
      //     console.log(this.currentUserId);
          
      //     await this.placesService.addNewComment(this.placeId(), this.currentUserId, 5, this.enteredComment())
      //         .subscribe()
      // }
}
