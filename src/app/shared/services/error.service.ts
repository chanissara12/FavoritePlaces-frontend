import { Injectable, Signal, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private _error = signal<string>('');

  error: Signal<string> = this._error.asReadonly();

  public showError(message: string): void {
    console.log(message);
    this._error.set(message);
  }

  public clearError(): void {
    this._error.set('');
  }
}
