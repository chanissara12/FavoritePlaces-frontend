import { Component, inject, input, signal } from '@angular/core';
import { ModalComponent } from "../modal.component";
import { PostsService } from '../../../modules/posts/services/posts.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-confirm-promote-post-modal',
  standalone: true,
  imports: [ModalComponent, FormsModule],
  templateUrl: './confirm-promote-post-modal.component.html',
  styleUrl: './confirm-promote-post-modal.component.css'
})
export class ConfirmPromotePostModalComponent {
  title = input<string>();
  message = input<string>();

  private _isOpen: boolean = false;
  private postsService = inject(PostsService);
  private _postId: number | null = null;
  placeName = signal<string>('');

  public get opening(): boolean {
    return this._isOpen;
  }

  public onCancel(): void {
    this.hideDialog();
  }

  public async onComfirm(): Promise<void> {
    // console.log(this._postId, this._userId);
    if (this._postId && this.placeName) {
      await this.postsService.promotePostToPlace(this._postId, this.placeName()).subscribe({
        next: () => this.postsService.getMostFavPosts()
          .subscribe()
      })
    }
    this.hideDialog();
  }

  public showDialog(postId: number, title: string): void {
    this._postId = postId;
    this.placeName.set(title);
    this._isOpen = true;
  }

  public hideDialog(): void {
    this._isOpen = false;
  }
}
