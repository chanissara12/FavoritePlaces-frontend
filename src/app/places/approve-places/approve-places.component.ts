import { Component, inject, signal } from '@angular/core';
import { ModalComponent } from "../../shared/modal/modal.component";
import { Router, RouterLink } from '@angular/router';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';

@Component({
  selector: 'app-approve-places',
  standalone: true,
  imports: [ModalComponent, RouterLink],
  templateUrl: './approve-places.component.html',
  styleUrl: './approve-places.component.css'
})
export class ApprovePlacesComponent {
  private placesService = inject(PlacesService);
  private router = inject(Router);
  places = signal<Place[] | undefined>(undefined);
  
  ngOnInit() {
    this.placesService.loadUnapprovePlaces().subscribe({
      next: (resData) => this.places.set(resData)
    })

    console.log(this.places);
    
  }
  
  approvePlace(placeId: number) {
    this.placesService.approveUserPlaces(placeId).subscribe({
      next: (place) => {
        console.log(place);

        this.router.navigate([''], {
          replaceUrl: true
        })
      }
    })
  }
}
