import { inject, Injectable, signal } from '@angular/core';

import { PlacesViewModel, PlaceComment } from '../models/place.model';
import { HttpClient, HttpContext } from '@angular/common/http';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { ErrorService } from '../../../shared/error.service';
import { UsersService } from '../../users/services/users.service';
import { environment } from '../../../../environments/environment.development';
import { getErrorMessages } from '../../../shared/utils/get-error-messages';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private errorService = inject(ErrorService);
  private httpClient = inject(HttpClient);
  private usersService = inject(UsersService);
  private url = environment.urlApi + 'places/';
  private places = signal<PlacesViewModel[]>([]);
  private userPlaces = signal<PlacesViewModel[]>([]);
  private placesComments = signal<PlaceComment[]>([]);
  currentUser = this.usersService.currentUserData;

  loadedAvailablePlaces = this.places.asReadonly();
  loadedUserPlaces = this.userPlaces.asReadonly();
  loadedPlacesComments = this.placesComments.asReadonly();

  public loadAvailablePlaces(): Observable<PlacesViewModel[]> {
    let availablePlacesUrl: string;
    if (this.currentUser != null) {
      availablePlacesUrl = this.url + 'GetAvailablePlaces?userId=' + this.currentUser().userId
    } else {
      availablePlacesUrl = this.url + 'GetAvailablePlaces'
    }
    return this.fetchPlaces(
      availablePlacesUrl,
      'Some thing went wrong fetching the available places. Please try again later.'
    )
      .pipe(
        tap({
          next: (places) => this.places.set(places)
        })
      );
  }

  public loadUserPlaces(): Observable<PlacesViewModel[]> {
    return this.fetchPlaces(
      this.url + 'GetUserPlaces?userId=' + this.currentUser().userId,
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

  loadPlacesComments() {
    return this.httpClient.get<{ comments: PlaceComment[] }>(this.url + 'places-comments')
      .pipe(
        map((resData) => {
          this.placesComments.set(resData.comments);
        }),
        catchError((error) =>
          throwError(() => new Error('Some thing went wrong fetching the comments. Please try again later.')))
      )
    // return this.httpClient.get<{ comments: PlaceComment[] }>(this.url + 'places-comments')
    // .pipe(
    //   map((resData) => this.placesComments.set(resData.comments)),
    //   catchError((error) =>
    //     throwError(() => new Error('Some thing went wrong fetching the comments. Please try again later.')))
    // )
  }

  addPlaceToUserPlaces(place: PlacesViewModel) {
    const prevPlaces = this.userPlaces();
    // this.userPlaces.update(prevPlaces => [...prevPlaces, place]);

    if (this.currentUser().userId === 0) {
      this.errorService.showError('Please login to save your favorite places.');
      return throwError(() => new Error('Please login to save your favorite places.'))
    }

    if (!prevPlaces.some((p) => p.placeId === place.placeId)) {
      this.userPlaces.set([...prevPlaces, place]);
    }

    return this.httpClient.post(this.url + 'user-places/post', {
      userId: this.currentUser().userId,
      placeId: place.placeId
    }).pipe(
      catchError(error => {
        this.userPlaces.set(prevPlaces);
        this.errorService.showError('Failed to store selected place.');
        return throwError(() => new Error('Failed to store selected place.'))
      })
    )
  }

  removeUserPlace(place: PlacesViewModel) {
    const prevPlaces = this.userPlaces();

    if (prevPlaces.some((p) => p.placeId === place.placeId)) {
      this.userPlaces.set(prevPlaces.filter(p => p.placeId !== place.placeId));
    }

    return this.httpClient.delete(this.url + 'user-places/delete?userId=' + this.currentUser().userId + '&placeId=' + place.placeId)
      .pipe(
        catchError(error => {
          this.userPlaces.set(prevPlaces);
          this.errorService.showError('Failed to remove the selected place.');
          return throwError(() => new Error('Failed to remove the selected place.'))
        })
      )
  }

  approveUserPlaces(placeId: number) {
    return this.httpClient.post(this.url + 'user-places/approve-place', placeId)
      .pipe(
        catchError(error => {
          let errorMessages = getErrorMessages(error)
          this.errorService.showError(errorMessages);
          return throwError(() => new Error(errorMessages))
        })
      )
  }

  addNewPlaces(data: FormData) {
    return this.httpClient.post(this.url + 'new-place', data)
      .pipe(
        catchError(error => {
          let errorMessages = getErrorMessages(error)
          this.errorService.showError(errorMessages);
          return throwError(() => new Error(errorMessages))
        })
      )
  }

  deletePlace(placeId: number) {
    return this.httpClient.post(this.url + 'delete-place', placeId)
      .pipe(
        catchError(error => {
          let errorMessages = getErrorMessages(error)
          this.errorService.showError(errorMessages);
          return throwError(() => new Error(errorMessages))
        })
      )
  }

  private fetchPlaces(url: string, errorMessage: string) {
    return this.httpClient
      .get<{ places: PlacesViewModel[] }>(url)
      .pipe(
        map((resData) => resData.places),
        catchError((error) =>
          throwError(() => new Error(errorMessage)))
      )
  }
}
