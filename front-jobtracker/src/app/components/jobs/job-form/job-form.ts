import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { futureDateValidator } from '../../../validators/date.validators';

@Component({
  selector: 'app-job-form',
  imports: [ReactiveFormsModule],
  templateUrl: './job-form.html',
  styleUrl: './job-form.css',
})
export class JobForm {
  private readonly fb = inject(FormBuilder);

  // Initialisation d'un groupe vide pour satisfaire le compilateur
  readonly jobForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    company: ['', [Validators.required]],
    offerUrl: ['', [Validators.required, Validators.pattern('^https?://.+')]],
    applicationDate: ['', [Validators.required, futureDateValidator()]]
  });




}

