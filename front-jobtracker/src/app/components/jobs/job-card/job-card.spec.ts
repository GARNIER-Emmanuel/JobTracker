import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobCard } from './job-card';
import { JobOffer, JobStatus, Response } from '../../../models/jobOffer.model';

describe('JobCard', () => {
  let component: JobCard;
  let fixture: ComponentFixture<JobCard>;

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
    await TestBed.configureTestingModule({
      imports: [JobCard],
    }).compileComponents();
    fixture = TestBed.createComponent(JobCard);
    component = fixture.componentInstance;

    // Affectation de l'Input requis pour le test
    component.job = mockJob;

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render job title and company', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h3')?.textContent).toContain('Développeur Angular');
    expect(compiled.querySelector('.company')?.textContent).toContain('Entreprise A');
  });

  it('should emit delete event when onDelete is called', () => {
    let emitted: JobOffer | undefined;
    component.delete.subscribe((job) => emitted = job);

    component.onDelete();

    expect(emitted).toEqual(mockJob);
  });
});