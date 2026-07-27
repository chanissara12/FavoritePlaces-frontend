import { Component, inject, OnInit, Signal, signal } from '@angular/core';
import { PlacesContainerComponent } from "../../../places/components/places-container/places-container.component";
import { UsersService } from '../../../users/services/users.service';
import { PlacesViewModel } from '../../../places/models/place.model';
import { User } from '../../../users/models/users.model';
import { PostsComponent } from "../../pages/posts/posts.component";
import { PostsService } from '../../services/posts.service';
import { PostViewModel } from '../../models/posts.model';
import { RouterLink } from '@angular/router';
import { NewPostComponent } from "../new-post/new-post.component";

@Component({
    selector: 'app-feed',
    standalone: true,
    imports: [PlacesContainerComponent, PostsComponent, RouterLink, NewPostComponent],
    templateUrl: './feed.component.html',
    styleUrl: './feed.component.css'
})
export class FeedComponent implements OnInit {
    isFetching = signal<boolean>(false);
    error = signal<string>('');

    private postsService = inject(PostsService);
    private usersService = inject(UsersService);

    // places: Signal<PlacesViewModel[]> = this.postsService.loadedAvailablePlaces;
    posts: Signal<PostViewModel[]> = this.postsService.loadedPosts;
    // userPlaces: Signal<PlacesViewModel[]> = this.postsService.loadedUserPlaces;
    currentUser: Signal<User> = this.usersService.currentUserData;
    isLoggedIn: Signal<boolean> = this.usersService.isLoggedIn;

    async ngOnInit(): Promise<void> {
        this.isFetching.set(true);

        await this.postsService.getPosts()
            .subscribe({
                complete: () => {
                    this.isFetching.set(false);
                },
                error: (error) => {
                    this.error.set(error.message);
                }
            });
    }

    async onAddFavPost(postId: number, userId: number): Promise<void> {
        await this.postsService.favoritePost(postId, userId)
            .subscribe({
                next: () => this.postsService.getPosts()
                    .subscribe()
            })
    }
}
