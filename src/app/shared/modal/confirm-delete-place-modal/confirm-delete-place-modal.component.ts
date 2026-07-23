import { Component, inject, input } from '@angular/core';
import { PlacesService } from '../../../modules/places/services/places.service';
import { ModalComponent } from "../modal.component";

@Component({
  selector: 'app-confirm-delete-place-modal',
  standalone: true,
  imports: [ModalComponent],
  templateUrl: './confirm-delete-place-modal.component.html',
  styleUrl: './confirm-delete-place-modal.component.css'
})
export class ConfirmDeletePlaceModalComponent {
  title = input<string>();
  message = input<string>();
  
  private _isOpen: boolean = false;
  private placesService = inject(PlacesService);
  private _placeId: number | null = null;

  public get opening(): boolean {
    return this._isOpen;
  }

  public onCancel(): void {
    this.hideDialog();
  }

  public async onComfirm(): Promise<void> {
    console.log(this._placeId);
    if (this._placeId) {
      await this.placesService.deletePlace(this._placeId).subscribe({
        next: () => {
          this.placesService.loadAvailablePlaces().subscribe();
        }
      })
    }
    this.hideDialog();
  }

  public showDialog(placeId: number): void {
    this._placeId = placeId;
    this._isOpen = true;
  }

  public hideDialog(): void {
    this._isOpen = false;
  }
}
