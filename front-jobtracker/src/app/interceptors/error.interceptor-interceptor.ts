import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Error } from '../services/error';

export const errorInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(Error);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Extrait le message d'erreur envoyé par le serveur (si c'est du texte brut) ou met un message par défaut
      const message = typeof error.error === 'string' ? error.error : 'Une erreur inattendue est survenue.';

      // Stocke l'erreur dans le signal réactif
      errorService.setError(message);

      // Relance l'erreur pour la propager dans le flux RxJS
      return throwError(() => error);
    })
  );
};
