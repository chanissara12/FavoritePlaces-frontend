import { Component, inject, OnInit, Signal, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../../pages/places/places.component';
import { PlacesService } from '../../services/places.service';
import { PlacesViewModel } from '../../models/place.model';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {
  isFetching = signal<boolean>(false);
  error = signal<string>('');

  private placesService = inject(PlacesService);
  
  places: Signal<PlacesViewModel[]> = this.placesService.loadedUserPlaces

  async ngOnInit(): Promise<void> {
    this.isFetching.set(true);
    await this.placesService.loadUserPlaces()
      .subscribe({
        complete: () => {
          this.isFetching.set(false);
        },
        error: (error) => {
          this.error.set(error.message);
        }
      });
  }
}
