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

  it('should create a new job and append it to the jobs signal', () => {
    // 1. Vérifier que le service ne contient aucune offre au départ
    const initialJobs: JobOffer[] = [];
    expect(service.jobs()).toEqual(initialJobs);

    const newOffer: Omit<JobOffer, 'id'> = {
      title: 'Dev Frontend',
      company: 'Entreprise B',
      offerUrl: 'https://candidature.com/2',
      status: JobStatus.APPLIED,
      contacted: true,
      response: Response.PENDING,
      applicationDate: '2026-06-02'
    };

    const createdOffer: JobOffer = {
      id: '999', // Simule l'ID unique généré par la BDD
      ...newOffer
    };

    // 2. Déclencher l'appel de création
    service.create(newOffer);

    // 3. Attendre et intercepter la requête HTTP correspondante
    const req = httpMock.expectOne('/api/jobs');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newOffer);

    // 4. Injecter la réponse simulée du serveur
    req.flush(createdOffer);

    // 5. Valider que le signal réactif a bien été mis à jour avec l'offre créée
    expect(service.jobs()).toEqual([createdOffer]);
  });

  it('should update a job and replace it in the jobs signal', () => {
    const mockOffer: JobOffer = {
      id: '123',
      title: 'Développeur Angular',
      company: 'Entreprise A',
      offerUrl: 'https://candidature.com',
      status: JobStatus.WISHLIST,
      contacted: false,
      response: Response.PENDING,
      applicationDate: '2026-06-01'
    };

    // 1. Charger initialement une offre existante dans l'état local
    service.loadAll();
    const loadReq = httpMock.expectOne('/api/jobs');
    loadReq.flush([mockOffer]);
    expect(service.jobs()).toEqual([mockOffer]);

    const updatedJob: JobOffer = {
      ...mockOffer,
      status: JobStatus.APPLIED // Champ modifié à tester
    };

    // 2. Déclencher l'appel de modification
    service.update('123', { status: JobStatus.APPLIED });

    // 3. Valider la requête HTTP PUT envoyée au bon endpoint
    const req = httpMock.expectOne('/api/jobs/123');
    expect(req.request.method).toBe('PUT');
    req.flush(updatedJob);

    // 4. Valider que le signal réactif local reflète instantanément le changement
    expect(service.jobs()[0].status).toBe(JobStatus.APPLIED);
  });

  it('should delete a job and remove it from the jobs signal', () => {
    const mockOffer: JobOffer = {
      id: '123',
      title: 'Développeur Angular',
      company: 'Entreprise A',
      offerUrl: 'https://candidature.com',
      status: JobStatus.WISHLIST,
      contacted: false,
      response: Response.PENDING,
      applicationDate: '2026-06-01'
    };

    // 1. Charger initialement une offre existante
    service.loadAll();
    const loadReq = httpMock.expectOne('/api/jobs');
    loadReq.flush([mockOffer]);
    expect(service.jobs()).toEqual([mockOffer]);

    // 2. Déclencher l'appel de suppression
    service.delete('123');

    // 3. Valider la requête HTTP DELETE vers l'identifiant concerné
    const req = httpMock.expectOne('/api/jobs/123');
    expect(req.request.method).toBe('DELETE');
    req.flush(null); // Simule une réponse vide de succès

    // 4. Valider que l'offre a bien été éjectée du signal réactif local
    expect(service.jobs()).toEqual([]);
  });
});

