import { inject, Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient, HttpContext } from '@angular/common/http';
import { catchError, map, tap, throwError } from 'rxjs';
import { ErrorService } from '../shared/error.service';
import { UsersService } from '../users/users.service';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private errorService = inject(ErrorService);
  private httpClient = inject(HttpClient);
  private userPlaces = signal<Place[]>([]);
  private usersService = inject(UsersService);
  currentUser = this.usersService.currentUserData;

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchPlaces(
      'https://localhost:44304/api/places',
      'Some thing went wrong fetching the available places. Please try again later.'
    );
  }

  loadUserPlaces() {
    console.log(this.currentUser().user_id);
    
    return this.fetchPlaces(
      'https://localhost:44304/api/users/user-places?user_id=' + this.currentUser().user_id,
      'Some thing went wrong fetching your favorite places. Please try again later.'
    ).pipe(
      tap({
        next: (userPlaces) => this.userPlaces.set(userPlaces)
      })
    );
  }

  addPlaceToUserPlaces(place: Place) {
    const prevPlaces = this.userPlaces();
    // this.userPlaces.update(prevPlaces => [...prevPlaces, place]);

    if (!prevPlaces.some((p) => p.place_id === place.place_id)) {
      this.userPlaces.set([...prevPlaces, place]);
    }

    return this.httpClient.post('https://localhost:44304/api/users/user-places/post', {
      user_id: this.currentUser().user_id,
      place_id: place.place_id
    }).pipe(
      catchError(error => {
        this.userPlaces.set(prevPlaces);
        this.errorService.showError('Failed to store selected place.');
        return throwError(() => new Error('Failed to store selected place.'))
      })
    )
  }

  removeUserPlace(place: Place) {
    const prevPlaces = this.userPlaces();

    if (prevPlaces.some((p) => p.place_id === place.place_id)) {
      this.userPlaces.set(prevPlaces.filter(p => p.place_id !== place.place_id));
    }

    return this.httpClient.delete('https://localhost:44304/api/users/user-places/delete?user_id=' + this.currentUser().user_id + '&place_id=' + place.place_id).pipe(
      catchError(error => {
        this.userPlaces.set(prevPlaces);
        this.errorService.showError('Failed to remove the selected place.');
        return throwError(() => new Error('Failed to remove the selected place.'))
      })
    )
  }

  private fetchPlaces(url: string, errorMessage: string) {
    return this.httpClient
      .get<{ places: Place[] }>(url)
      .pipe(
        map((resData) => resData.places),
        catchError((error) =>
          throwError(() => new Error(errorMessage)))
      )
  }
}
