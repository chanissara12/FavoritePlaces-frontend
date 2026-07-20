import { Component, inject, input } from '@angular/core';
import { ModalComponent } from "../../../../shared/modal/modal.component";
import { PlacesService } from '../../services/places.service';
import { Place } from '../../models/place.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-place-detail',
  standalone: true,
  imports: [ModalComponent],
  templateUrl: './place-detail.component.html',
  styleUrl: './place-detail.component.css'
})
export class PlaceDetailComponent {
  placeId = input.required<number>();
  private placesService = inject(PlacesService);
  private router = inject(Router);
  place: Place | undefined;

  ngOnInit() {
    this.place = this.placesService.loadedAvailablePlaces().find(place => place.placeId == this.placeId());
    this.placesService.loadPlacesComments().subscribe({
      next: (comments) => {
        console.log(comments);
      }
    })
  }

  onClose() {
    this.router.navigate([''], {
      replaceUrl: true
    })
  }


}
