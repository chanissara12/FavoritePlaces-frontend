import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Signal, signal } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { UsersService } from '../../users/services/users.service';
import { PostViewModel } from '../models/posts.model';
import { User } from '../../users/models/users.model';
import { ErrorService } from '../../../shared/services/error.service';

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
    if (this.currentUser() != null) {
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
}
