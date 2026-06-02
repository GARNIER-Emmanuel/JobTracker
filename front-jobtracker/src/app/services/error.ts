import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Error {
  private readonly _errorMessage = signal<string | null>(null);

  readonly errorMessage = this._errorMessage.asReadonly();

  setError(message: string): void {
    this._errorMessage.set(message);
  }

  clearError(): void {
    this._errorMessage.set(null);
  }
}
