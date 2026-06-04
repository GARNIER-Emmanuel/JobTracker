import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Jobs } from './jobs';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Job } from '../../services/job';
import { JobOffer, JobStatus, Response } from '../../models/jobOffer.model';
import { vi } from 'vitest';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';

/**
 * Suite de tests unitaires pour le composant principal Jobs.
 * Ce composant orchestre la liste globale et effectue des appels API.
 */
describe('Jobs', () => {
  let component: Jobs;
  let fixture: ComponentFixture<Jobs>;
  let httpMock: HttpTestingController;
  let jobService: Job;

  // Jeu d'offres d'emploi fictif pour nos tests de filtrage et de statistiques
  const mockOffers: JobOffer[] = [
    {
      id: '1',
      title: 'Développeur Angular',
      company: 'Tech Corp',
      status: JobStatus.WISHLIST,
      contacted: false,
      response: Response.PENDING,
      applicationDate: '2026-06-01',
      offerUrl: 'https://techcorp.com'
    },
    {
      id: '2',
      title: 'Développeur Java',
      company: 'Soft Inc',
      status: JobStatus.APPLIED,
      contacted: true,
      response: Response.PENDING,
      applicationDate: '2026-06-01',
      offerUrl: 'https://softinc.com'
    },
    {
      id: '3',
      title: 'Architecte Cloud',
      company: 'Tech Corp',
      status: JobStatus.INTERVIEW,
      contacted: true,
      response: Response.PENDING,
      applicationDate: '2026-06-01',
      offerUrl: 'https://techcorp.com/cloud'
    }
  ];

  beforeEach(async () => {
    // Configuration du module de test avec les mocks nécessaires
    await TestBed.configureTestingModule({
      imports: [Jobs],
      providers: [
        // Active le support HTTP pour le service injecté
        provideHttpClient(),
        // Fournit le contrôleur de mock HTTP pour intercepter les requêtes
        provideHttpClientTesting(),
        // IMPORTANT : provideNoopAnimations() désactive les animations réelles dans les tests.
        // C'est indispensable sous JSDOM qui ne prend pas en charge les APIs d'animation CSS/Web
        // et lèverait une exception : "Unexpected synthetic property @listAnimation found".
        provideNoopAnimations(),
        { provide: MessageService, useValue: { add: vi.fn() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Jobs);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    jobService = TestBed.inject(Job);

    // 1. Déclenche le cycle de détection initial (appelle ngOnInit() -> loadAll())
    fixture.detectChanges();

    // 2. Intercepte l'appel HTTP attendu vers '/api/jobs' généré par loadAll()
    const req = httpMock.expectOne('/api/jobs');

    // 3. Flush (simule la réponse du serveur) avec nos offres fictives
    req.flush(mockOffers);

    // 4. Met à jour le cycle de vie du composant avec les données reçues
    fixture.detectChanges();
  });

  // Après chaque test, on vérifie qu'aucune requête HTTP inattendue n'est restée en suspens
  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Vérification des statistiques calculées à partir des signaux
  it('should initialize statistics with loaded jobs', () => {
    // Les statistiques sont exposées via un signal calculé (computed).
    // On l'appelle comme une fonction : statistiques()
    expect(component.statistiques().total).toBe(3);

    // Vérification de la ventilation par statut
    expect(component.statistiques().wishlist).toBe(1);
    expect(component.statistiques().applied).toBe(1);
    expect(component.statistiques().interview).toBe(1);
    expect(component.statistiques().offer).toBe(0);
  });

  // Test du filtrage vide (doit retourner tout le monde)
  it('should return all jobs when search query is empty', () => {
    // On met à jour la valeur du signal writable 'searchQuery'
    component.searchQuery.set('');

    // L'assertion vérifie le signal calculé filteredJobs() dépendant de searchQuery
    expect(component.filteredJobs().length).toBe(3);
  });

  // Test du filtrage par titre (insensible à la casse)
  it('should filter jobs by title (case-insensitive)', () => {
    // Recherche de 'angular'
    component.searchQuery.set('angular');

    // On s'attend à ne recevoir qu'un seul élément correspondant
    expect(component.filteredJobs().length).toBe(1);
    expect(component.filteredJobs()[0].title).toBe('Développeur Angular');
  });

  // Test du filtrage par nom d'entreprise
  it('should filter jobs by company name', () => {
    // Recherche de 'Tech Corp' (présent sur l'offre 1 et 3)
    component.searchQuery.set('Tech Corp');

    const results = component.filteredJobs();
    expect(results.length).toBe(2);
    expect(results.some(j => j.id === '1')).toBe(true);
    expect(results.some(j => j.id === '3')).toBe(true);
  });

  // Test de la suppression
  it('should call jobService.delete when deleteJob is called with a valid job ID', () => {
    // On crée un espion (spy) sur la méthode 'delete' du service pour valider son appel
    const spy = vi.spyOn(jobService, 'delete').mockImplementation(() => { });
    const jobToDelete = mockOffers[0];

    component.deleteJob(jobToDelete);

    // On s'assure que la suppression a bien été relayée avec le bon ID
    expect(spy).toHaveBeenCalledWith('1');
  });
});
