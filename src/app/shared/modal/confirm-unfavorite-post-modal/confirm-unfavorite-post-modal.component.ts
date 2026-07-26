import { Component, inject, input } from '@angular/core';
import { PostsService } from '../../../modules/posts/services/posts.service';
import { ModalComponent } from "../modal.component";

@Component({
  selector: 'app-confirm-unfavorite-post-modal',
  standalone: true,
  imports: [ModalComponent],
  templateUrl: './confirm-unfavorite-post-modal.component.html',
  styleUrl: './confirm-unfavorite-post-modal.component.css'
})
export class ConfirmUnfavoritePostModalComponent {
  title = input<string>();
  message = input<string>();

  private _isOpen: boolean = false;
  private postsService = inject(PostsService);
  private _postId: number | null = null;
  private _userId: number | null = null;

  public get opening(): boolean {
    return this._isOpen;
  }

  public onCancel(): void {
    this.hideDialog();
  }

  public async onComfirm(): Promise<void> {
    console.log(this._postId, this._userId);
    if (this._postId && this._userId) {
      await this.postsService.unfavoritePost(this._postId, this._userId).subscribe({
        next: () => this.postsService.getPosts()
          .subscribe()
      })
    }
    this.hideDialog();
  }

  public showDialog(placeId: number, userId: number): void {
    this._postId = placeId;
    this._userId = userId;
    this._isOpen = true;
  }

  public hideDialog(): void {
    this._isOpen = false;
  }
}
