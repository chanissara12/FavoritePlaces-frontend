import { Component, inject, input, OnInit, Signal, signal } from '@angular/core';
import { ModalComponent } from "../../../../shared/modal/modal.component";
import { PlacesService } from '../../services/places.service';
import { PlacesViewModel, PlaceComment } from '../../models/place.model';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { UsersService } from '../../../users/services/users.service';

@Component({
    selector: 'app-place-detail',
    standalone: true,
    imports: [ModalComponent, MatIconModule, RouterLink],
    templateUrl: './place-detail.component.html',
    styleUrl: './place-detail.component.css'
})
export class PlaceDetailComponent implements OnInit {
    placeId = input.required<number>();
    private placesService = inject(PlacesService);
    private usersService = inject(UsersService);
    private router = inject(Router);
    place: PlacesViewModel | undefined = undefined;
    placeComments = signal<PlaceComment[]>([]);
    isLoggedIn: Signal<boolean> = this.usersService.isLoggedIn;

    async ngOnInit(): Promise<void> {
        this.place = await this.placesService.loadedAvailablePlaces().find(place => place.placeId == this.placeId());
        await this.placesService.loadPlacesComments(this.placeId())
            .subscribe({ next: (resData) => this.placeComments.set(resData) })
    }

    public onClose(): void {
        this.router.navigate([''], {
            replaceUrl: true
        })
    }
}
