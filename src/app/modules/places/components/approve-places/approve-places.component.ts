import { Component, inject, OnInit, signal } from '@angular/core';
import { ModalComponent } from "../../../../shared/modal/modal.component";
import { Router, RouterLink } from '@angular/router';
import { PlacesService } from '../../services/places.service';
import { PlacesViewModel } from '../../models/place.model';

@Component({
    selector: 'app-approve-places',
    standalone: true,
    imports: [ModalComponent, RouterLink],
    templateUrl: './approve-places.component.html',
    styleUrl: './approve-places.component.css'
})
export class ApprovePlacesComponent implements OnInit {
    private placesService = inject(PlacesService);
    private router = inject(Router);

    places = signal<PlacesViewModel[] | undefined>(undefined);

    async ngOnInit(): Promise<void> {
        await this.placesService.loadUnapprovePlaces().subscribe({
            next: (resData) => this.places.set(resData)
        })
        console.log(this.places);
    }

    public async approvePlace(placeId: number): Promise<void> {
        await this.placesService.approveUserPlaces(placeId).subscribe({
            next: (place) => {
                console.log(place);

                this.router.navigate([''], {
                    replaceUrl: true
                })
            }
        })
    }
}
