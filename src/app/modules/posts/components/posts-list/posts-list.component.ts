import { Component, inject, input, Signal, viewChild } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from '@angular/router';
import { PostsService } from '../../services/posts.service';
import { PostViewModel } from '../../models/posts.model';
import { ConfirmPromotePostModalComponent } from "../../../../shared/modal/confirm-promote-post-modal/confirm-promote-post-modal.component";

@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [MatIconModule, RouterLink, ConfirmPromotePostModalComponent],
  templateUrl: './posts-list.component.html',
  styleUrl: './posts-list.component.css'
})
export class PostsListComponent {
  posts = input<PostViewModel[]>([]);
  dialogPromote = viewChild<ConfirmPromotePostModalComponent>('dialogPromote');

  private postsService = inject(PostsService);

  // posts: Signal<PostViewModel[] | undefined> = this.postsService.loadedPosts;

  public onPromotePost(postId: number): void {
      this.dialogPromote()?.showDialog(postId)
    }
}
