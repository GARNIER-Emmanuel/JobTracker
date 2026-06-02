import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { errorInterceptorInterceptor } from './error.interceptor-interceptor';
import { Error } from '../services/error';

describe('errorInterceptorInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let errorService: Error;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        // Enregistre le client HTTP de test avec notre intercepteur fonctionnel
        provideHttpClient(withInterceptors([errorInterceptorInterceptor])),
        provideHttpClientTesting()
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    errorService = TestBed.inject(Error);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should not update error service on successful HTTP request', () => {
    // TODO : Lancer une requête factice avec httpClient.get('/api/test').subscribe()
    // Intercepter la requête avec httpMock et faire un .flush('ok')
    // Vérifier que errorService.errorMessage() est toujours égal à null
    httpClient.get('/api/test').subscribe();

    // 1. On intercepte la requête attendue
    const req = httpMock.expectOne('/api/test');

    // 2. On simule la réponse du serveur (flush) sur cette requête spécifique
    req.flush('ok');

    // 3. On vérifie que le service d'erreur n'a pas reçu de message
    expect(errorService.errorMessage()).toBeNull();
  });

  it('should intercept 500 error and update ErrorService', () => {
    // TODO : Lancer une requête factice avec httpClient.get('/api/test').subscribe()
    // Intercepter la requête et faire un .flush('error', { status: 500, statusText: 'Server Error' })
    // Vérifier que errorService.errorMessage() contient bien le message d'erreur approprié
    httpClient.get('/api/test').subscribe({
      error: () => { } // Capture l'erreur relancée par l'intercepteur pour éviter l'exception non gérée
    });

    const req = httpMock.expectOne('/api/test');

    req.flush('error', { status: 500, statusText: 'Server Error' });

    expect(errorService.errorMessage()).toBe('error');
  });
});
