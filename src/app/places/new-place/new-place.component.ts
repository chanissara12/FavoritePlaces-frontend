import { Component } from '@angular/core';
import { ModalComponent } from "../../shared/modal/modal.component";

@Component({
  selector: 'app-new-place',
  standalone: true,
  imports: [ModalComponent],
  templateUrl: './new-place.component.html',
  styleUrl: './new-place.component.css'
})
export class NewPlaceComponent {

}
