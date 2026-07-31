import { Component, inject, OnInit, Signal } from '@angular/core';
import { ModalComponent } from "../../../../shared/modal/modal.component";
import { CloseBtnComponent } from "../../../../shared/buttons/close-btn/close-btn.component";
import { PostsComponent } from "../../pages/posts/posts.component";
import { PostsService } from '../../services/posts.service';
import { PostViewModel } from '../../models/posts.model';
import { PostsListComponent } from "../posts-list/posts-list.component";

@Component({
  selector: 'app-promote',
  standalone: true,
  imports: [ModalComponent, CloseBtnComponent, PostsComponent, PostsListComponent],
  templateUrl: './promote.component.html',
  styleUrl: './promote.component.css'
})
export class PromoteComponent implements OnInit {
    private postsService = inject(PostsService);
  
    posts: Signal<PostViewModel[] | undefined> = this.postsService.loadedPosts;

    ngOnInit(): void {
      this.postsService.getMostFavPosts().subscribe();
    }
}
