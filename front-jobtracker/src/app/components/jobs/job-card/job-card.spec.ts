import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobCard } from './job-card';
import { JobOffer, JobStatus, Response } from '../../../models/jobOffer.model';
import { Job } from '../../../services/job';
import { vi } from 'vitest';

/**
 * Suite de tests unitaires pour le composant JobCard.
 * Vitest est utilisé comme test runner en remplacement de Jest/Karma.
 */
describe('JobCard', () => {
  let component: JobCard;
  let fixture: ComponentFixture<JobCard>;
  let jobServiceSpy: any;

  // Offre fictive (mock) utilisée comme entrée pour les tests
  const mockJob: JobOffer = {
    id: '123',
    title: 'Développeur Angular',
    company: 'Entreprise A',
    offerUrl: 'https://candidature.com',
    status: JobStatus.WISHLIST,
    contacted: false,
    response: Response.PENDING,
    applicationDate: '2026-06-01'
  };

  beforeEach(async () => {
    // 1. Définition d'un mock léger pour le service Job. 
    // On stub la méthode 'update' avec une fonction espionne (vi.fn()) de Vitest.
    const spy = {
      update: vi.fn()
    };

    // 2. Configuration du module de test Angular
    await TestBed.configureTestingModule({
      // Comme JobCard est un composant Standalone, on l'importe directement
      imports: [JobCard],
      // On remplace le vrai service injecté par notre mock d'espionnage
      providers: [
        { provide: Job, useValue: spy }
      ]
    }).compileComponents();

    // 3. Instanciation du composant et récupération des instances utiles
    fixture = TestBed.createComponent(JobCard);
    component = fixture.componentInstance;
    jobServiceSpy = TestBed.inject(Job);

    // 4. Affectation de l'Input requis (@Input() job) avant de démarrer le rendu.
    // Sans cela, le composant lèverait une erreur à l'initialisation.
    component.job = mockJob;

    // Attend la stabilisation des liaisons de données asynchrones
    await fixture.whenStable();
  });

  // Test de base : Vérifie que le composant s'instancie correctement
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test de rendu HTML : Vérifie que le titre et l'entreprise s'affichent bien dans le DOM
  it('should render job title and company', () => {
    // Force la détection des changements pour mettre à jour le DOM avec mockJob
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    
    // Assertion sur les balises textuelles générées
    expect(compiled.querySelector('h3')?.textContent).toContain('Développeur Angular');
    expect(compiled.querySelector('.company-name')?.textContent).toContain('Entreprise A');
  });

  // Test des Outputs : Vérifie le déclenchement de l'événement de suppression
  it('should emit delete event when onDelete is called', () => {
    let emitted: JobOffer | undefined;
    
    // On s'abonne à l'EventEmitter du composant pour capturer la valeur émise
    component.delete.subscribe((job) => emitted = job);

    // Déclenchement de la méthode
    component.onDelete();

    // Assertion : l'événement émis doit contenir l'offre d'emploi
    expect(emitted).toEqual(mockJob);
  });

  // Test de l'interaction avec le dropdown de statut PrimeNG
  it('should call jobService.update when onStatusChange is called', () => {
    // IMPORTANT : p-select (PrimeNG) n'émet pas un Event natif de navigateur.
    // Il émet un objet personnalisé contenant la propriété 'value'.
    // Nous devons donc simuler exactement cette signature pour tester notre callback.
    const mockEvent = {
      value: JobStatus.APPLIED
    };

    // Appel de la méthode de changement de statut
    component.onStatusChange(mockEvent);

    // Reconstruction de l'offre attendue après modification
    const expectedJob: JobOffer = {
      ...mockJob,
      status: JobStatus.APPLIED
    };

    // Assertion : Vérifie que le service a été appelé avec les bons paramètres
    expect(jobServiceSpy.update).toHaveBeenCalledWith('123', expectedJob);
  });
});