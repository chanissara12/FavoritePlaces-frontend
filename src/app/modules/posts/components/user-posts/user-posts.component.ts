import { Component, inject, input, Signal, signal } from '@angular/core';
import { PlacesContainerComponent } from "../../../places/components/places-container/places-container.component";
import { PostsComponent } from "../../pages/posts/posts.component";
import { PostViewModel } from '../../models/posts.model';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-user-posts',
  standalone: true,
  imports: [PlacesContainerComponent, PostsComponent],
  templateUrl: './user-posts.component.html',
  styleUrl: './user-posts.component.css'
})
export class UserPostsComponent {
  userId = input<number>();
  isFetching = signal<boolean>(false);
  error = signal<string>('');

  private postsService = inject(PostsService);

  posts: Signal<PostViewModel[] | undefined> = this.postsService.loadedPosts;

  // private placesService = inject(PlacesService);

  // places: Signal<PlacesViewModel[]> = this.placesService.loadedUserPlaces

  async ngOnInit(): Promise<void> {
    this.isFetching.set(true);
    await this.postsService.getUserPosts(this.userId()!)
      .subscribe({
        complete: () => {
          this.isFetching.set(false);
        },
        error: (error) => {
          this.error.set(error.message);
        }
      });
  }
}
