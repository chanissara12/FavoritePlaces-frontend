import { Component, inject, input, Signal, signal } from '@angular/core';
import { ModalComponent } from "../../../../shared/modal/modal.component";
import { CloseBtnComponent } from "../../../../shared/buttons/close-btn/close-btn.component";
import { PostsService } from '../../services/posts.service';
import { Router } from '@angular/router';
import { PostCommentViewModel, PostViewModel } from '../../models/posts.model';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [ModalComponent, CloseBtnComponent, FormsModule, MatIconModule],
  templateUrl: './edit-post.component.html',
  styleUrl: './edit-post.component.css'
})
export class EditPostComponent {
  postId = input.required<number>();
  enteredComment = signal<string>('');

  private postsService = inject(PostsService);
  // private placesService = inject(PlacesService);
  // private usersService = inject(UsersService);
  private router = inject(Router);

  private _showAddComment: boolean = false;
  post: PostViewModel | undefined = undefined;
  postComments = signal<PostCommentViewModel[]>([]);
  enteredTitle = this.post?.title;
  // isLoggedIn: Signal<boolean> = this.usersService.isLoggedIn;
  // currentUserId: number = this.usersService.currentUserData().userId; 

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

  submitComment() {

  }

  async ngOnInit(): Promise<void> {
    this.post = await this.postsService.loadedPosts().find(post => post.postId == this.postId());
    //   await this.placesService.loadPlacesComments(this.placeId())
    //       .subscribe({ next: (resData) => this.placeComments.set(resData) })
  }

  // public async submitComment(): Promise<void> {
  //     console.log(this.usersService.currentUserData());
  //     console.log(this.currentUserId);

  //     await this.placesService.addNewComment(this.placeId(), this.currentUserId, 5, this.enteredComment())
  //         .subscribe()
  // }
}
