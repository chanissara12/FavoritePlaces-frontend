import { Component, inject, input, Signal, signal } from '@angular/core';
import { ModalComponent } from "../../../../shared/modal/modal.component";
import { MatIcon } from "@angular/material/icon";
import { PostCommentViewModel, PostViewModel } from '../../models/posts.model';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CloseBtnComponent } from "../../../../shared/buttons/close-btn/close-btn.component";
import { PostsService } from '../../services/posts.service';
import { UsersService } from '../../../users/services/users.service';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-post-detail',
    standalone: true,
    imports: [ModalComponent, MatIcon, FormsModule, CloseBtnComponent, DatePipe, RouterLink],
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
    private _showEditComment: boolean = false;
    post: PostViewModel | undefined = undefined;
    postComments = signal<PostCommentViewModel[]>([]);
    isLoggedIn: Signal<boolean> = this.usersService.isLoggedIn;
    currentUserId: number = this.usersService.currentUserData().userId;

    public get opening(): boolean {
        return this._showAddComment;
    }

    public get editing(): boolean {
        return this._showEditComment;
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

    public onEditComment(commentId: number): void {
        this._showEditComment = !this._showEditComment;
        // this.enteredComment.set(comment);
        // this.enteredComment.set(this.postComments().find(comment => comment.commentId == commentId).comment)
        // this.enteredComment = this.postComments().find(comment => comment.commentId == commentId)?.comment;
        // , postId: number, userId: number, comment: string
        // this.postsService.editComment(commentId, this.postId(), this.currentUserId, this.enteredComment())
        //     .subscribe({
        //         next: () => this.router.navigate(['./'], {
        //             replaceUrl: true
        //         })
        //     })
    }

    public onDeleteComment(commentId: number): void {
        this.postsService.deleteComment(commentId, this.postId(), this.currentUserId)
            .subscribe({
                next: () => this.router.navigate(['./'], {
                    replaceUrl: true
                })
            })
    }

    public async submitComment(): Promise<void> {
        await this.postsService.postComment(this.postId(), this.currentUserId, this.enteredComment()).subscribe({
            next: () => this.router.navigate(['./'], {
                replaceUrl: true
            })
        })
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
