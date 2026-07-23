import { Component, inject, Signal, signal } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { ErrorModalComponent } from "./shared/modal/error-modal/error-modal.component";
import { ErrorService } from './shared/services/error.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, ErrorModalComponent],
})
export class AppComponent {
  private errorService = inject(ErrorService);
  
  error: Signal<string> = this.errorService.error;
}
