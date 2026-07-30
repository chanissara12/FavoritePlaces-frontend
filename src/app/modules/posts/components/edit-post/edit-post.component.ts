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

  private postsService = inject(PostsService);
  // private usersService = inject(UsersService);
  private router = inject(Router);

  private _showAddComment: boolean = false;
  post: PostViewModel | undefined = undefined;
  postComments = signal<PostCommentViewModel[]>([]);
  enteredTitle = signal<string>('');
  enteredAlt = signal<string>('');
  // isLoggedIn: Signal<boolean> = this.usersService.isLoggedIn;
  // currentUserId: number = this.usersService.currentUserData().userId; 

  public onClose(): void {
    this.router.navigate([''], {
      replaceUrl: true
    })
  }

  onClick() {
    console.log(this.enteredTitle());

  }

  public onSubmit() {
    console.log(this.enteredTitle());
    console.log(this.enteredAlt());
    this.postsService.editPost(this.postId(), this.enteredTitle(), this.enteredAlt()).subscribe({
      next: () => this.postsService.getPosts().subscribe()
    }
    );

    this.router.navigate([''], {
      replaceUrl: true
    })
  }

  async ngOnInit(): Promise<void> {
    this.post = await this.postsService.loadedPosts().find(post => post.postId == this.postId());
    if (this.post) {
      this.enteredTitle.set(this.post.title);
      this.enteredAlt.set(this.post.imgAlt);
    }
  }
}
