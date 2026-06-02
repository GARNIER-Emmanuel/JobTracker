import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Jobs } from './jobs';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Job } from '../../services/job';
import { JobOffer, JobStatus, Response } from '../../models/jobOffer.model';

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
    await TestBed.configureTestingModule({
      imports: [Jobs],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Jobs);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    jobService = TestBed.inject(Job);

    // Déclenche l'initialisation du composant (qui appelle loadAll())
    fixture.detectChanges();

    // Intercepte et flush les offres fictives pour initialiser l'état
    const req = httpMock.expectOne('/api/jobs');
    req.flush(mockOffers);

    // Met à jour le cycle de vie du composant
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize statistics with loaded jobs', () => {
    // TODO : Écris les assertions pour vérifier que les signaux de statistiques
    // retournent les bonnes valeurs basées sur 'mockOffers'.
    // Par exemple :
    // - Total d'offres attendu : 3
    expect(component.statistiques().total).toBe(3)
    // - Offres en WISHLIST attendu : 1
    expect(component.statistiques().wishlist).toBe(1)
    // - Offres en APPLIED attendu : 1
    expect(component.statistiques().applied).toBe(1)
    // - Offres en INTERVIEW attendu : 1
    expect(component.statistiques().interview).toBe(1)
    // - Offres en OFFER attendu : 0
    expect(component.statistiques().offer).toBe(0)
  });

  it('should return all jobs when search query is empty', () => {
    // TODO : Mettre searchQuery à une chaîne vide
    // Vérifier que le signal calculé filteredJobs() contient l'intégralité des 3 offres.
    component.searchQuery.set('');
    expect(component.filteredJobs().length).toBe(3)
  });

  it('should filter jobs by title (case-insensitive)', () => {
    // TODO : Modifier la valeur de la recherche pour cibler 'angular'
    // Vérifier que le signal filteredJobs() ne retourne que l'offre "Développeur Angular".
    component.searchQuery.set('angular');
    expect(component.filteredJobs().length).toBe(1);
    expect(component.filteredJobs()[0].title).toBe('Développeur Angular');

  });

  it('should filter jobs by company name', () => {
    // TODO : Modifier la valeur de la recherche pour cibler 'Tech Corp'
    // Vérifier que le signal filteredJobs() retourne uniquement les offres 1 et 3.
    component.searchQuery.set('Tech Corp');
    const results = component.filteredJobs();
    expect(results.length).toBe(2);
    expect(results.some(j => j.id === '1')).toBe(true);
    expect(results.some(j => j.id === '3')).toBe(true);
  });
});
