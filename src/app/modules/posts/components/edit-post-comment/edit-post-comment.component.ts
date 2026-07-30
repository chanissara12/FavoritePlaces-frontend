import { Component, signal } from '@angular/core';
import { ModalComponent } from "../../../../shared/modal/modal.component";
import { CloseBtnComponent } from "../../../../shared/buttons/close-btn/close-btn.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-post-comment',
  standalone: true,
  imports: [ModalComponent, CloseBtnComponent, FormsModule],
  templateUrl: './edit-post-comment.component.html',
  styleUrl: './edit-post-comment.component.css'
})
export class EditPostCommentComponent {
  enteredComment = signal('');
  onSubmit() {
    throw new Error('Method not implemented.');
  }

}
