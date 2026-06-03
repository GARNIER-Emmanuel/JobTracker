import { Component, inject, effect } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { futureDateValidator } from '../../../validators/date.validators';
import { Job } from '../../../services/job';
import { JobStatus } from '../../../models/jobOffer.model';
import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { Drawer } from 'primeng/drawer';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { InputNumber } from 'primeng/inputnumber';
import { DatePicker } from 'primeng/datepicker';
import { ToggleSwitch } from 'primeng/toggleswitch';



@Component({
  selector: 'app-job-form',
  imports: [ReactiveFormsModule, Drawer, Button, InputText, Textarea, InputNumber, DatePicker, Select, ToggleSwitch],
  templateUrl: './job-form.html',
  styleUrl: './job-form.css',
})
export class JobForm {
  private readonly fb = inject(FormBuilder);
  protected readonly jobService = inject(Job);
  readonly selectedJob = this.jobService.selectedJobForEdit;


  responseOptions = [
    { label: 'En attente', value: 'PENDING' },
    { label: 'Oui', value: 'YES' },
    { label: 'Non', value: 'NO' }
  ];

  remoteOptions = [
    { label: 'Aucun', value: 'NONE' },
    { label: 'Partiel', value: 'PARTIAL' },
    { label: 'Occasionnel', value: 'OCCASIONAL' }
  ];

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
        this.jobService.isFormOpen.set(true); // C'est ici qu'on l'ouvre !
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
      } else {
        // Mode création
        const newOffer = {
          ...this.jobForm.value,
          status: JobStatus.WISHLIST
        };
        this.jobService.create(newOffer);
      }

      // --- ACTIONS DE FERMETURE ET DE REMISE À ZÉRO ---
      this.jobService.selectedJobForEdit.set(null); // Quitte l'édition
      this.jobService.isFormOpen.set(false);        // Ferme le tiroir

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

  // 3. Callback lors de la fermeture du Drawer par l'utilisateur
  onDrawerClose(visible: boolean): void {
    this.jobService.isFormOpen.set(visible);
    if (!visible) {
      this.jobService.selectedJobForEdit.set(null);
    }
  }
  cancelEdit(): void {
    this.jobService.selectedJobForEdit.set(null);
    this.jobService.isFormOpen.set(false); // Ferme également en cas d'annulation
  }
}

