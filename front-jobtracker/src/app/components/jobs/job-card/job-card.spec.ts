import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobCard } from './job-card';
import { JobOffer, JobStatus, Response } from '../../../models/jobOffer.model';
import { Job } from '../../../services/job';
import { vi } from 'vitest';

describe('JobCard', () => {
  let component: JobCard;
  let fixture: ComponentFixture<JobCard>;
  let jobServiceSpy: any;

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
    const spy = {
      update: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [JobCard],
      providers: [
        { provide: Job, useValue: spy }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(JobCard);
    component = fixture.componentInstance;
    jobServiceSpy = TestBed.inject(Job);

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

  it('should call jobService.update when onStatusChange is called', () => {
    const mockEvent = {
      target: {
        value: JobStatus.APPLIED
      }
    } as unknown as Event;

    component.onStatusChange(mockEvent);

    const expectedJob: JobOffer = {
      ...mockJob,
      status: JobStatus.APPLIED
    };

    expect(jobServiceSpy.update).toHaveBeenCalledWith('123', expectedJob);
  });
});