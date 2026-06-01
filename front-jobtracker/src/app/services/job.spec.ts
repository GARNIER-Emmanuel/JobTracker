import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Job } from './job';
import { JobOffer, JobStatus, Response } from '../models/jobOffer.model';


describe('Job', () => {
  let service: Job;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Job,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(Job);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // S'assure qu'aucune requête HTTP inattendue n'est restée ouverte
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load all jobs and update the jobs signal', () => {
    const mockOffers: JobOffer[] = [
      {
        id: '123',
        title: 'Développeur Angular',
        company: 'Entreprise A',
        offerUrl: 'https://candidature.com',
        status: JobStatus.WISHLIST,
        contacted: false,
        response: Response.PENDING,
        applicationDate: '2026-06-01'
      }
    ];
    // 1. Vérifier que le signal est vide au départ
    expect(service.jobs()).toEqual([]);
    // 2. Déclencher le chargement
    service.loadAll();
    // 3. Attendre la requête HTTP sur '/api/jobs'
    const req = httpMock.expectOne('/api/jobs');
    expect(req.request.method).toBe('GET');
    // 4. Simuler le retour du serveur
    req.flush(mockOffers);
    // 5. Vérifier que le signal contient bien les offres reçues
    expect(service.jobs()).toEqual(mockOffers);
  });
});

