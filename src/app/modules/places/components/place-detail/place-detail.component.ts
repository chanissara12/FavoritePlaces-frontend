import { Component, inject, input, signal } from '@angular/core';
import { ModalComponent } from "../../../../shared/modal/modal.component";
import { PlacesService } from '../../services/places.service';
import { Place, PlaceComment } from '../../models/place.model';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-place-detail',
  standalone: true,
  imports: [ModalComponent, MatIconModule],
  templateUrl: './place-detail.component.html',
  styleUrl: './place-detail.component.css'
})
export class PlaceDetailComponent {
  placeId = input.required<number>();
  private placesService = inject(PlacesService);
  private router = inject(Router);
  place: Place | undefined;
  comments = this.placesService.loadedPlacesComments;
  thisPlaceComments: PlaceComment[] = [];

  ngOnInit() {
    this.place = this.placesService.loadedAvailablePlaces().find(place => place.placeId == this.placeId());
    this.thisPlaceComments = this.comments().filter(c => c.placeId == this.placeId());
    console.log(this.comments());
    console.log(this.placeId());
    console.log(this.thisPlaceComments);
    
  }

  onClose() {
    this.router.navigate([''], {
      replaceUrl: true
    })
  }


}
