import { Component, inject, signal } from '@angular/core';
import { ModalComponent } from "../../shared/modal/modal.component";
import { RouterLink } from '@angular/router';
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
  places = signal<Place[] | undefined>(undefined);
  // waitForApprovePlaces = this.places().filter(x => x.isApprove === 'N')
  
  ngOnInit() {
    this.placesService.loadUnapprovePlaces().subscribe({
      next: (resData) => this.places.set(resData)
    })

    console.log(this.places);
    
  }
  
  onSubmit() {

  }
}
