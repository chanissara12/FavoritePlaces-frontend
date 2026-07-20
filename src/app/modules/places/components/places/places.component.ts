import { Component, computed, inject, input, output, signal } from '@angular/core';

import { Place } from '../../models/place.model';
import { RouterLink } from '@angular/router';
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
  private usersService = inject(UsersService);
  private placesService = inject(PlacesService);
  currentUser = this.usersService.currentUserData();
  isAdmin = this.currentUser.roles.includes('admin');
  userFavoritePlaces = signal<Place[] | undefined>([]);

  ngOnInit() {
    // console.log('userPlaces', this.userPlaces);
    // console.log('userPlaces', this.userPlaces());
    if (this.usersService.isLoggedIn()) {
      this.placesService.loadUserPlaces().subscribe({
        next: (userPlaces) => this.userFavoritePlaces.set(userPlaces),
      });
    }
    console.log('userPlaces', this.userFavoritePlaces);
  }

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
    this.placesService.deletePlace(placeId).subscribe({
      next: (resData) => {
        console.log(resData);
      }
    })
  }
}
