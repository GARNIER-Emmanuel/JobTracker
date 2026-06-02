import { Component, inject, effect } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { futureDateValidator } from '../../../validators/date.validators';
import { Job } from '../../../services/job';
import { JobStatus } from '../../../models/jobOffer.model';

@Component({
  selector: 'app-job-form',
  imports: [ReactiveFormsModule],
  templateUrl: './job-form.html',
  styleUrl: './job-form.css',
})
export class JobForm {
  private readonly fb = inject(FormBuilder);
  protected readonly jobService = inject(Job);
  readonly selectedJob = this.jobService.selectedJobForEdit;

  // Initialisation d'un groupe vide pour satisfaire le compilateur
  readonly jobForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    company: ['', [Validators.required]],
    offerUrl: ['', [Validators.required, Validators.pattern('^https?://.+')]],
    applicationDate: ['', [Validators.required, futureDateValidator()]],
    location: [''],
    salary: [null],
    notes: [''],
    contacted: [false],
    response: ['PENDING'],
    remoteWork: ['NONE']
  });

  constructor() {
    // Effet réactif : Remplit le formulaire dès qu'une offre est sélectionnée pour modification
    effect(() => {
      const job = this.selectedJob();
      if (job) {
        this.jobForm.patchValue(job);
      } else {
        this.jobForm.reset({
          title: '',
          company: '',
          offerUrl: '',
          applicationDate: '',
          location: '',
          salary: null,
          notes: '',
          contacted: false,
          response: 'PENDING',
          remoteWork: 'NONE'
        });
      }
    });
  }

  onSubmit(): void {
    if (this.jobForm.valid) {
      const selected = this.selectedJob();
      if (selected && selected.id) {
        // Mode modification : on fusionne l'offre actuelle avec les nouvelles valeurs
        const updatedJob = {
          ...selected,
          ...this.jobForm.value
        };
        this.jobService.update(selected.id, updatedJob);
        this.jobService.selectedJobForEdit.set(null); // On quitte le mode édition
      } else {
        // Mode création
        const newOffer = {
          ...this.jobForm.value,
          status: JobStatus.WISHLIST
        };
        this.jobService.create(newOffer);
      }

      this.jobForm.reset({
        title: '',
        company: '',
        offerUrl: '',
        applicationDate: '',
        location: '',
        salary: null,
        notes: '',
        contacted: false,
        response: 'PENDING',
        remoteWork: 'NONE'
      });
    }
  }

  cancelEdit(): void {
    this.jobService.selectedJobForEdit.set(null);
  }
}

