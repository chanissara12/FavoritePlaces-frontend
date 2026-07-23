import { Component, inject, input } from '@angular/core';
import { ModalComponent } from "../modal.component";
import { PlacesService } from '../../../modules/places/services/places.service';

@Component({
  selector: 'app-confirm-unfavorite-modal',
  standalone: true,
  imports: [ModalComponent],
  templateUrl: './confirm-unfavorite-modal.component.html',
  styleUrl: './confirm-unfavorite-modal.component.css'
})
export class ConfirmUnfavoriteModalComponent {
  title = input<string>();
  message = input<string>();
  
  private _isOpen: boolean = false;
  private placesService = inject(PlacesService);
  private _placeId: number | null = null;
  private _userId: number | null = null;

  public get opening(): boolean {
    return this._isOpen;
  }

  public onCancel(): void {
    this.hideDialog();
  }

  public async onComfirm(): Promise<void> {
    console.log(this._placeId, this._userId);
    if (this._placeId && this._userId) {
      await this.placesService.removeUserPlace(this._placeId, this._userId).subscribe({
          next: () => this.placesService.loadAvailablePlaces()
            .subscribe()
        })
    }
    this.hideDialog();
  }

  public showDialog(placeId: number, userId: number): void {
    this._placeId = placeId;
    this._userId = userId;
    this._isOpen = true;
  }

  public hideDialog(): void {
    this._isOpen = false;
  }
}
