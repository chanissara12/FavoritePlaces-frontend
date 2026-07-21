import { Component, computed, inject, input, output, signal } from '@angular/core';

import { Place, PlaceComment } from '../../models/place.model';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { UsersService } from '../../../users/services/users.service';
import { PlacesService } from '../../services/places.service';

@Component({
  selector: 'app-places',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  templateUrl: './places.component.html',
  styleUrl: './places.component.css',
})
export class PlacesComponent {
  places = input.required<Place[]>();
  // userPlaces = input.required<Place[] | undefined>();
  selectPlace = output<Place>();
  deletePlace = output<number>();
  private usersService = inject(UsersService);
  private placesService = inject(PlacesService);
  private router = inject(Router);
  currentUser = this.usersService.currentUserData();
  isAdmin = this.currentUser.roles.includes('admin');
  userFavoritePlaces = signal<Place[] | undefined>([]);
  comments = this.placesService.loadedPlacesComments;

  ngOnInit() {
    if (this.usersService.isLoggedIn()) {
      this.placesService.loadUserPlaces().subscribe({
        next: (userPlaces) => this.userFavoritePlaces.set(userPlaces),
      });
    }
    this.placesService.loadPlacesComments().subscribe();
  }

  commentCount = computed(() => {
    const counts = new Map<number, number>(); //สร้าง map เก็บ placeId และจำนวน comment

    //ใช้ forEach เพื่อวนลูป comment และนับจำนวนเก็บไว้ใน map
    this.comments().forEach((comment) => {
      counts.set(comment.placeId, (counts.get(comment.placeId) || 0) + 1);
    });

    return counts
  })

  // isFavorite(placeId: number) {
  //   return this.userFavoritePlaces().some(x => x.placeId === placeId);
  // }

  // favoritePlaceIds = computed(() =>
  //   new Set(this.userFavoritePlaces().map(x => x.placeId))
  // );

  onSelectPlace(place: Place) {
    // this.selectPlace.emit(place);
  }

  onAddPlace(place: Place) {
    this.selectPlace.emit(place);
  }

  onDeletePlace(placeId: number) {
    this.deletePlace.emit(placeId);
  }
}
