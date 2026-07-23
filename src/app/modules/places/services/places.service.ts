import { inject, Injectable, Signal, signal } from '@angular/core';

import { PlacesViewModel, PlaceComment } from '../models/place.model';
import { HttpClient, HttpContext } from '@angular/common/http';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { ErrorService } from '../../../shared/services/error.service';
import { UsersService } from '../../users/services/users.service';
import { environment } from '../../../../environments/environment.development';
import { getErrorMessages } from '../../../shared/utils/get-error-messages';
import { User } from '../../users/models/users.model';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private errorService = inject(ErrorService);
  private httpClient = inject(HttpClient);
  private usersService = inject(UsersService);
  private url: string = environment.urlApi + 'places/';
  private places = signal<PlacesViewModel[]>([]);
  private userPlaces = signal<PlacesViewModel[]>([]);

  currentUser: Signal<User> = this.usersService.currentUserData;

  loadedAvailablePlaces: Signal<PlacesViewModel[]> = this.places.asReadonly();
  loadedUserPlaces: Signal<PlacesViewModel[]> = this.userPlaces.asReadonly();

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

  public loadUnapprovePlaces(): Observable<PlacesViewModel[]> {
    return this.fetchPlaces(
      this.url + 'unapprove-places',
      'Some thing went wrong fetching the available places. Please try again later.'
    );
  }

  public loadPlacesComments(placeId: number): Observable<PlaceComment[]> {
    return this.httpClient.get<{ comments: PlaceComment[] }>(this.url + 'places-comments?placeId='+ placeId)
      .pipe(
        map((resData) => resData.comments),
        catchError((error) =>
          throwError(() => new Error('Some thing went wrong fetching the comments. Please try again later.')))
      )
  }

  public addPlaceToUserPlaces(placeId: number, userId: number): Observable<Object> {
    const prevPlaces: PlacesViewModel[] = this.userPlaces();

    if (this.currentUser().userId === 0) {
      this.errorService.showError('Please login to save your favorite places.');
      return throwError(() => new Error('Please login to save your favorite places.'))
    }

    return this.httpClient.post(this.url + 'user-places/post', {
      userId: userId,
      placeId: placeId
    }).pipe(
      catchError(error => {
        this.userPlaces.set(prevPlaces);
        this.errorService.showError('Failed to store selected place.');
        return throwError(() => new Error('Failed to store selected place.'))
      })
    )
  }

  public removeUserPlace(placeId: number, userId: number): Observable<Object> {
    const prevPlaces: PlacesViewModel[] = this.userPlaces();

    if (prevPlaces.some((p) => p.placeId === placeId)) {
      this.userPlaces.set(prevPlaces.filter(p => p.placeId !== placeId));
    }

    return this.httpClient.delete(this.url + 'user-places/delete?userId=' + userId + '&placeId=' + placeId)
      .pipe(
        catchError(error => {
          this.userPlaces.set(prevPlaces);
          this.errorService.showError('Failed to remove the selected place.');
          return throwError(() => new Error('Failed to remove the selected place.'))
        })
      )
  }

  public approveUserPlaces(placeId: number): Observable<Object> {
    return this.httpClient.post(this.url + 'user-places/approve-place', placeId)
      .pipe(
        catchError(error => {
          let errorMessages: string = getErrorMessages(error)
          this.errorService.showError(errorMessages);
          return throwError(() => new Error(errorMessages))
        })
      )
  }

  public addNewPlaces(data: FormData): Observable<Object> {
    return this.httpClient.post(this.url + 'new-place', data)
      .pipe(
        catchError(error => {
          let errorMessages: string = getErrorMessages(error)
          this.errorService.showError(errorMessages);
          return throwError(() => new Error(errorMessages))
        })
      )
  }

  public deletePlace(placeId: number): Observable<Object> {
    return this.httpClient.post(this.url + 'delete-place', placeId)
      .pipe(
        catchError(error => {
          let errorMessages: string = getErrorMessages(error)
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
