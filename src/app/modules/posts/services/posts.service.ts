import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Signal, signal } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { UsersService } from '../../users/services/users.service';
import { PostCommentViewModel, PostViewModel } from '../models/posts.model';
import { User } from '../../users/models/users.model';
import { ErrorService } from '../../../shared/services/error.service';
import { getErrorMessages } from '../../../shared/utils/get-error-messages';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private httpClient = inject(HttpClient);
  private usersService = inject(UsersService);
  private errorService = inject(ErrorService);

  private posts = signal<PostViewModel[]>([]);

  url: string = environment.urlApi + 'posts/';
  loadedPosts: Signal<PostViewModel[]> = this.posts.asReadonly();
  currentUser: Signal<User> = this.usersService.currentUserData;

  public getPosts(): Observable<PostViewModel[]> {
    let getPostsUrl: string;
    if (this.currentUser != null) {
      getPostsUrl = this.url + 'GetPosts?userId=' + this.currentUser().userId
    } else {
      getPostsUrl = this.url + 'GetPosts'
    }

    return this.httpClient.get<{ posts: PostViewModel[] }>(getPostsUrl)
      .pipe(
        map((resData) => resData.posts),
        catchError((error) =>
          throwError(() => new Error('Some thing went wrong fetching the posts. Please try again later.'))),
        tap({
          next: (posts) => this.posts.set(posts)
        })
      );
  }

  public getUserPosts(userId: number): Observable<PostViewModel[]> {
    return this.httpClient.get<{ posts: PostViewModel[] }>(this.url + 'GetUserPosts?userId=' + userId)
      .pipe(
        map((resData) => resData.posts),
        catchError((error) =>
          throwError(() => new Error('Some thing went wrong fetching the posts. Please try again later.'))),
        tap({
          next: (posts) => this.posts.set(posts)
        })
      );
  }

  public postNewPost(data: FormData): Observable<Object> {
    return this.httpClient.post(this.url + 'PostNewPost', data)
      .pipe(
        catchError(error => {
          let errorMessages: string = getErrorMessages(error)
          this.errorService.showError(errorMessages);
          return throwError(() => new Error(errorMessages))
        })
      )
  }

  public editPost(postId: number, title: string, alt: string): Observable<Object> {
    return this.httpClient.post(this.url + 'EditPost', {
      postId: postId,
      title: title,
      alt: alt
    })
      .pipe(
        catchError(error => {
          let errorMessages: string = getErrorMessages(error)
          this.errorService.showError(errorMessages);
          return throwError(() => new Error(errorMessages))
        })
      )
  }

  public deletePost(postId: number): Observable<Object> {
    return this.httpClient.post(this.url + 'DeletePost', postId)
      .pipe(
        catchError(error => {
          let errorMessages: string = getErrorMessages(error)
          this.errorService.showError(errorMessages);
          return throwError(() => new Error(errorMessages))
        })
      )
  }

  public favoritePost(postId: number, userId: number): Observable<Object> {
    // const prevPosts: PostViewModel[] = this.userPosts();

    if (this.currentUser().userId === 0) {
      this.errorService.showError('Please login to save your favorite Posts.');
      return throwError(() => new Error('Please login to save your favorite Posts.'))
    }

    return this.httpClient.post(this.url + 'FavoritePost', {
      userId: userId,
      postId: postId
    }).pipe(
      catchError(error => {
        // this.userPosts.set(prevPosts);
        this.errorService.showError('Failed to store selected place.');
        return throwError(() => new Error('Failed to store selected place.'))
      })
    )
  }

  public unfavoritePost(postId: number, userId: number): Observable<Object> {
    // const prevPlaces: PlacesViewModel[] = this.userPlaces();

    // if (prevPlaces.some((p) => p.postId === postId)) {
    //   this.userPlaces.set(prevPlaces.filter(p => p.postId !== postId));
    // }

    return this.httpClient.delete(this.url + 'UnFavoritePost?userId=' + userId + '&postId=' + postId)
      .pipe(
        catchError(error => {
          // this.userPlaces.set(prevPlaces);
          this.errorService.showError('Failed to remove the selected place.');
          return throwError(() => new Error('Failed to remove the selected place.'))
        })
      )
  }

  public getPostComments(postId: number): Observable<PostCommentViewModel[]> {
    return this.httpClient.get<{ comments: PostCommentViewModel[] }>(this.url + 'getPostComments?postId=' + postId)
      .pipe(
        map((resData) => resData.comments),
        catchError((error) =>
          throwError(() => new Error('Some thing went wrong fetching the comments. Please try again later.'))),
        // tap({
        //     next: (comments) => this.comments.set(comments)
        //   })
      );
  }

  public postComment(postId: number, userId: number, comment: string): Observable<Object> {
    return this.httpClient.post(this.url + 'PostComment', {
      postId: postId,
      userId: userId,
      comment: comment
    })
      .pipe(
        catchError(error => {
          let errorMessages: string = getErrorMessages(error)
          this.errorService.showError(errorMessages);
          return throwError(() => new Error(errorMessages))
        })
      )
  }

  public editComment(commentId: number, postId: number, userId: number, comment: string) {
    return this.httpClient.post(this.url + 'EditComment', {
      commentId: commentId,
      postId: postId,
      userId: userId,
      comment: comment
    })
      .pipe(
        catchError(error => {
          let errorMessages: string = getErrorMessages(error)
          this.errorService.showError(errorMessages);
          return throwError(() => new Error(errorMessages))
        })
      )
  }

  public deleteComment(commentId: number, postId: number, userId: number) {
    return this.httpClient.post(this.url + 'DeleteComment', {
      commentId: commentId,
      postId: postId,
      userId: userId
    })
      .pipe(
        catchError(error => {
          let errorMessages: string = getErrorMessages(error)
          this.errorService.showError(errorMessages);
          return throwError(() => new Error(errorMessages))
        })
      )
  }
}
