import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { PlacesViewModel } from '../../models/place.model';
import { PlacesComponent } from '../../pages/places/places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { PlacesService } from '../../services/places.service';
import { Router, RouterLink } from "@angular/router";
import { UsersService } from '../../../users/services/users.service';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent, RouterLink],
})
export class AvailablePlacesComponent implements OnInit {
  // places = signal<PlacesViewModel[] | undefined>(undefined);
  isFetching = signal(false);
  error = signal('');
  private placesService = inject(PlacesService);
  private usersService = inject(UsersService);
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  places = this.placesService.loadedAvailablePlaces;
  userPlaces = this.placesService.loadedUserPlaces;
  currentUser = this.usersService.currentUserData;
  // currentUserRole = this.usersService.currentUserRoleData;

  // constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    this.isFetching.set(true);

    const subscription =
      this.placesService.loadAvailablePlaces()
        .subscribe({
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

  onAddFavPlace(selectedPlace: PlacesViewModel) {
    if (!this.userPlaces()?.find((p) => p.placeId === selectedPlace.placeId)) {
      const subscription = this.placesService.addPlaceToUserPlaces(selectedPlace)
        .subscribe({
          next: () => this.placesService.loadAvailablePlaces()
            .subscribe()
        })
      this.destroyRef.onDestroy(() => {
        subscription.unsubscribe();
      })
    }
  }

  onRemoveFavPlace(selectedPlace: PlacesViewModel) {
    const subscription = this.placesService.removeUserPlace(selectedPlace).subscribe()

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    })
  }

  onDeletePlace(placeId: number) {
    const subscription = this.placesService.deletePlace(placeId).subscribe({
      next: () => {
        this.placesService.loadAvailablePlaces().subscribe();
      }
    })
  }
}
