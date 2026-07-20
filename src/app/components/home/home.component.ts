import { Component } from '@angular/core';
import { AvailablePlacesComponent } from "../../modules/places/components/available-places/available-places.component";
import { UserPlacesComponent } from "../../modules/places/components/user-places/user-places.component";
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
