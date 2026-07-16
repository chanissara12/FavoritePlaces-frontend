import { inject, Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient, HttpContext } from '@angular/common/http';
import { catchError, map, tap, throwError } from 'rxjs';
import { ErrorService } from '../shared/error.service';
import { UsersService } from '../users/users.service';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private errorService = inject(ErrorService);
  private httpClient = inject(HttpClient);
  // private places = signal<Place[]>([]);
  private userPlaces = signal<Place[]>([]);
  private usersService = inject(UsersService);
  private url = environment.urlApi + 'places/';
  currentUser = this.usersService.currentUserData;

  // loadedAvailablePlaces = this.places.asReadonly();
  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchPlaces(
      this.url + 'available-places',
      'Some thing went wrong fetching the available places. Please try again later.'
    );
    // .pipe(
    //   tap({
    //     next: (places) => this.places.set(places)
    //   })
    // );
  }

  loadUserPlaces() {
    return this.fetchPlaces(
      this.url + 'user-places?user_id=' + this.currentUser().user_id,
      'Please Login to see your favorite places.'
    ).pipe(
      tap({
        next: (userPlaces) => this.userPlaces.set(userPlaces)
      })
    );
  }

  loadUnapprovePlaces() {
    return this.fetchPlaces(
      this.url + 'unapprove-places',
      'Some thing went wrong fetching the available places. Please try again later.'
    );
  }

  addPlaceToUserPlaces(place: Place) {
    const prevPlaces = this.userPlaces();
    // this.userPlaces.update(prevPlaces => [...prevPlaces, place]);

    if (this.currentUser().user_id === 0) {
      this.errorService.showError('Please login to save your favorite places.');
      return throwError(() => new Error('Please login to save your favorite places.'))
    }

    if (!prevPlaces.some((p) => p.place_id === place.place_id)) {
      this.userPlaces.set([...prevPlaces, place]);
    }

    return this.httpClient.post(this.url + 'user-places/post', {
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

    return this.httpClient.delete(this.url + 'user-places/delete?user_id=' + this.currentUser().user_id + '&place_id=' + place.place_id).pipe(
      catchError(error => {
        this.userPlaces.set(prevPlaces);
        this.errorService.showError('Failed to remove the selected place.');
        return throwError(() => new Error('Failed to remove the selected place.'))
      })
    ) 
  }

  addNewPlaces(data: FormData) {
    return this.httpClient.post(this.url, data)
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
