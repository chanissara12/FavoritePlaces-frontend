import { Component, inject } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { Router } from '@angular/router';

@Component({
  selector: 'app-close-btn',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './close-btn.component.html',
  styleUrl: './close-btn.component.css'
})
export class CloseBtnComponent {
  private router = inject(Router);
  
  public onClose(): void {
    this.router.navigate(['../'], {
      replaceUrl: true
    })
  }
}
