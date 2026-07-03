import { Component } from '@angular/core';
import { AvailablePlacesComponent } from "../places/available-places/available-places.component";
import { UserPlacesComponent } from "../places/user-places/user-places.component";
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AvailablePlacesComponent, UserPlacesComponent, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
