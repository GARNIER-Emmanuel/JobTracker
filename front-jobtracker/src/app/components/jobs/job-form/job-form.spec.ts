import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobForm } from './job-form';
import { Job } from '../../../services/job';
import { JobStatus } from '../../../models/jobOffer.model';
import { vi } from 'vitest';
import { signal } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('JobForm', () => {
  let component: JobForm;
  let fixture: ComponentFixture<JobForm>;
  let jobServiceSpy: any;
  beforeEach(async () => {
    const spy = {
      create: vi.fn(),
      update: vi.fn(),
      selectedJobForEdit: signal<any>(null),
      isFormOpen: signal<boolean>(false) // <-- Ajoute ce signal mocké
    };
    await TestBed.configureTestingModule({
      imports: [JobForm],
      providers: [
        { provide: Job, useValue: spy },
        provideNoopAnimations() // <-- Évite les bugs d'animation JSDOM sur le p-drawer
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(JobForm);
    component = fixture.componentInstance;
    jobServiceSpy = TestBed.inject(Job);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with all controls', () => {
    expect(component.jobForm).toBeDefined();
    expect(component.jobForm.get('title')).toBeDefined();
    expect(component.jobForm.get('company')).toBeDefined();
    expect(component.jobForm.get('offerUrl')).toBeDefined();
    expect(component.jobForm.get('applicationDate')).toBeDefined();
  });

  it('should validate required fields', () => {
    const form = component.jobForm;
    form.patchValue({
      title: '',
      company: '',
      offerUrl: '',
      applicationDate: ''
    });

    expect(form.invalid).toBe(true);
    expect(form.get('title')?.hasError('required')).toBe(true);
    expect(form.get('company')?.hasError('required')).toBe(true);
    expect(form.get('offerUrl')?.hasError('required')).toBe(true);
    expect(form.get('applicationDate')?.hasError('required')).toBe(true);
  });

  it('should validate offerUrl format', () => {
    const offerUrlCtrl = component.jobForm.get('offerUrl');

    // Invalide
    offerUrlCtrl?.setValue('invalid-url');
    expect(offerUrlCtrl?.invalid).toBe(true);
    expect(offerUrlCtrl?.hasError('pattern')).toBe(true);

    // Valide
    offerUrlCtrl?.setValue('https://example.com');
    expect(offerUrlCtrl?.valid).toBe(true);
  });

  it('should validate applicationDate is not in the future', () => {
    const dateCtrl = component.jobForm.get('applicationDate');

    // Date dans le futur (demain)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    dateCtrl?.setValue(tomorrowStr);
    expect(dateCtrl?.invalid).toBe(true);
    expect(dateCtrl?.hasError('futureDate')).toBe(true);

    // Date passée ou présente (aujourd'hui)
    const todayStr = new Date().toISOString().split('T')[0];
    dateCtrl?.setValue(todayStr);
    expect(dateCtrl?.valid).toBe(true);
  });

  it('should call jobService.create and reset form when onSubmit is called and form is valid', () => {
    const mockOffer = {
      title: 'Dev Front',
      company: 'Tech A',
      offerUrl: 'https://example.com',
      applicationDate: '2026-06-01',
      location: '',
      salary: null,
      notes: '',
      contacted: false,
      response: 'PENDING',
      remoteWork: 'NONE'
    };

    // Remplir le formulaire avec des données valides
    component.jobForm.setValue(mockOffer);
    expect(component.jobForm.valid).toBe(true);

    // Déclencher la soumission
    component.onSubmit();

    // Valider que le service est appelé avec les bonnes valeurs (incluant le statut par défaut)
    const expectedOffer = {
      ...mockOffer,
      status: JobStatus.WISHLIST
    };
    expect(jobServiceSpy.create).toHaveBeenCalledWith(expectedOffer);

    // Valider que le formulaire est réinitialisé avec des valeurs vides
    expect(component.jobForm.get('title')?.value).toBe('');
    expect(component.jobForm.get('company')?.value).toBe('');
  });
});
