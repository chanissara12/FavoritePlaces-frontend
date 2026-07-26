import { Component, inject, input, OnInit, Signal, signal } from '@angular/core';
import { ModalComponent } from "../../../../shared/modal/modal.component";
import { PlacesService } from '../../services/places.service';
import { PlacesViewModel, PlaceComment } from '../../models/place.model';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { UsersService } from '../../../users/services/users.service';
import { FormsModule } from '@angular/forms';
import { CloseBtnComponent } from "../../../../shared/buttons/close-btn/close-btn.component";

@Component({
    selector: 'app-place-detail',
    standalone: true,
    imports: [ModalComponent, MatIconModule, FormsModule, CloseBtnComponent],
    templateUrl: './place-detail.component.html',
    styleUrl: './place-detail.component.css'
})
export class PlaceDetailComponent implements OnInit {
    placeId = input.required<number>();
    enteredComment = signal<string>('');

    private placesService = inject(PlacesService);
    private usersService = inject(UsersService);
    private router = inject(Router);

    private _showAddComment: boolean = false;
    place: PlacesViewModel | undefined = undefined;
    placeComments = signal<PlaceComment[]>([]);
    isLoggedIn: Signal<boolean> = this.usersService.isLoggedIn;
    currentUserId: number = this.usersService.currentUserData().userId; 

    public get opening(): boolean {
        return this._showAddComment;
    }

    public showAddComment(): void {
        this._showAddComment = true
    }

    public hideAddComment(): void {
        this._showAddComment = false
    }

    public onClose(): void {
        this.router.navigate([''], {
            replaceUrl: true
        })
    }

    async ngOnInit(): Promise<void> {
        this.place = await this.placesService.loadedAvailablePlaces().find(place => place.placeId == this.placeId());
        await this.placesService.loadPlacesComments(this.placeId())
            .subscribe({ next: (resData) => this.placeComments.set(resData) })
    }

    public async submitComment(): Promise<void> {
        console.log(this.usersService.currentUserData());
        console.log(this.currentUserId);
        
        await this.placesService.addNewComment(this.placeId(), this.currentUserId, 5, this.enteredComment())
            .subscribe()
    }
}
