import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../../models/place.model';
import { PlacesComponent } from '../../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { PlacesService } from '../../services/places.service';
import { RouterLink } from "@angular/router";
import { UsersService } from '../../../users/services/users.service';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent, RouterLink],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false);
  error = signal('');
  private placesService = inject(PlacesService);
  private usersService = inject(UsersService);
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  userPlaces = this.placesService.loadedUserPlaces;
  currentUser = this.usersService.currentUserData;
  // currentUserRole = this.usersService.currentUserRoleData;

  // constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    this.isFetching.set(true);

    const subscription =
      this.placesService.loadAvailablePlaces()
        .subscribe({
          next: (places) => this.places.set(places),
          complete: () => {
            this.isFetching.set(false);
          },
          error: (error) => {
            // console.log(error);
            // this.error.set('Some thing went wrong fetching the available places. Please try again later.');
            this.error.set(error.message);
          }
        });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    })
  }

  onSelectPlace(selectedPlace: Place) {
    if (!this.userPlaces()?.find((p) => p.placeId === selectedPlace.placeId)) {
      const subscription = this.placesService.addPlaceToUserPlaces(selectedPlace)
        .subscribe({
          next: (resData) => console.log(resData)
        })

      this.destroyRef.onDestroy(() => {
        subscription.unsubscribe();
      })
    }
  }
}
