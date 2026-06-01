import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobForm } from './job-form';

describe('JobForm', () => {
  let component: JobForm;
  let fixture: ComponentFixture<JobForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobForm],
    }).compileComponents();

    fixture = TestBed.createComponent(JobForm);
    component = fixture.componentInstance;
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
});
