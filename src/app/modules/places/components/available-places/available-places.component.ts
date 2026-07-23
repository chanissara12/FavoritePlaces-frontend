import { Component, inject, OnInit, Signal, signal } from '@angular/core';

import { PlacesComponent } from '../../pages/places/places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesService } from '../../services/places.service';
import { RouterLink } from "@angular/router";
import { UsersService } from '../../../users/services/users.service';
import { PlacesViewModel } from '../../models/place.model';
import { User } from '../../../users/models/users.model';

@Component({
    selector: 'app-available-places',
    standalone: true,
    templateUrl: './available-places.component.html',
    styleUrl: './available-places.component.css',
    imports: [PlacesComponent, PlacesContainerComponent, RouterLink],
})
export class AvailablePlacesComponent implements OnInit {
    isFetching = signal<boolean>(false);
    error = signal<string>('');

    private placesService = inject(PlacesService);
    private usersService = inject(UsersService);
    
    places: Signal<PlacesViewModel[]> = this.placesService.loadedAvailablePlaces;
    userPlaces: Signal<PlacesViewModel[]> = this.placesService.loadedUserPlaces;
    currentUser: Signal<User> = this.usersService.currentUserData;

    async ngOnInit(): Promise<void> {
        this.isFetching.set(true);

        await this.placesService.loadAvailablePlaces()
            .subscribe({
                complete: () => {
                    this.isFetching.set(false);
                },
                error: (error) => {
                    this.error.set(error.message);
                }
            });
    }

    async onAddFavPlace(placeId: number, userId: number): Promise<void> {
        await this.placesService.addPlaceToUserPlaces(placeId, userId)
            .subscribe({
                next: () => this.placesService.loadAvailablePlaces()
                    .subscribe()
            })
    }
}
