import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-job-form',
  imports: [ReactiveFormsModule],
  templateUrl: './job-form.html',
  styleUrl: './job-form.css',
})
export class JobForm {
  private readonly fb = inject(FormBuilder);

  // Initialisation d'un groupe vide pour satisfaire le compilateur
  readonly jobForm: FormGroup = this.fb.group({});
}
