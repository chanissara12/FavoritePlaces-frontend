import { Component, DestroyRef, inject, input, output, viewChild } from '@angular/core';

import { PlacesViewModel } from '../../models/place.model';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { UsersService } from '../../../users/services/users.service';
import { ConfirmUnfavoriteModalComponent } from "../../../../shared/modal/confirm-unfavorite-modal/confirm-unfavorite-modal.component";
import { ConfirmDeletePlaceModalComponent } from "../../../../shared/modal/confirm-delete-place-modal/confirm-delete-place-modal.component";
import { User } from '../../../users/models/users.model';

@Component({
  selector: 'app-places',
  standalone: true,
  imports: [RouterLink, MatIconModule, ConfirmUnfavoriteModalComponent, ConfirmDeletePlaceModalComponent],
  templateUrl: './places.component.html',
  styleUrl: './places.component.css',
})
export class PlacesComponent {
  places = input.required<PlacesViewModel[]>();
  isAvailablePlaces = input<boolean>(false);
  addFavPlace = output<{placeId: number, userId: number}>();

  dialogUnfavorite = viewChild<ConfirmUnfavoriteModalComponent>('dialogUnfavorite');
  dialogDeletePlace = viewChild<ConfirmDeletePlaceModalComponent>('dialogDeletePlace');

  private usersService = inject(UsersService);

  currentUser: User = this.usersService.currentUserData();
  isAdmin: boolean = this.currentUser.roles.includes('admin');

  public onAddFavPlace(placeId: number, userId: number): void {
    this.addFavPlace.emit({placeId: placeId, userId: userId});
  }

  public onRemoveFavPlace(placeId: number, userId: number): void {
    this.dialogUnfavorite()?.showDialog(placeId, userId)
  }

  public onDeletePlace(placeId: number) {
    this.dialogDeletePlace()?.showDialog(placeId)
  }

}
