import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { JobOffer, JobStatus } from '../../../models/jobOffer.model';
import { Job } from '../../../services/job';

// Imports PrimeNG pour la refonte visuelle premium de la carte
import { Card } from 'primeng/card';
import { Tag } from 'primeng/tag';
import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';

// CRITIQUE : Import de PrimeTemplate. Sans lui, Angular ignore silencieusement
// les directives pTemplate="title", pTemplate="subtitle", etc. sur les balises <ng-template>.
import { PrimeTemplate } from 'primeng/api';

@Component({
  selector: 'app-job-card',
  // On déclare tous nos composants et modules importés pour notre composant standalone
  imports: [Card, Tag, Button, Select, FormsModule, PrimeTemplate],
  templateUrl: './job-card.html',
  styleUrl: './job-card.css',
})
export class JobCard {
  @Input({ required: true }) job!: JobOffer;
  @Output() delete = new EventEmitter<JobOffer>();

  // Injection du service pour gérer la modification en temps réel
  private readonly jobService = inject(Job)

  onDelete(): void {
    this.delete.emit(this.job)
  }

  onEdit(): void {
    this.jobService.selectedJobForEdit.set(this.job);
  }

  // NOTE : Contrairement au sélecteur HTML classique qui renvoie un Event natif,
  // le composant p-select de PrimeNG émet un événement personnalisé.
  // La valeur sélectionnée est accessible directement via 'event.value'.
  onStatusChange(event: { value: JobStatus }): void {
    const newStatus = event.value;

    if (this.job.id) {
      const updatedJob: JobOffer = {
        ...this.job,
        status: newStatus
      };
      this.jobService.update(this.job.id, updatedJob);
    }
  }


  // Options utilisées pour alimenter la liste de sélection de p-select
  statusOptions = [
    { label: 'À postuler', value: JobStatus.WISHLIST },
    { label: 'Postulé', value: JobStatus.APPLIED },
    { label: 'Entretien', value: JobStatus.INTERVIEW },
    { label: 'Offre reçue', value: JobStatus.OFFER },
    { label: 'Refusé', value: JobStatus.REJECTED }
  ];

  // Helper pour mapper sémantiquement les statuts métier à des couleurs de badges PrimeNG (severities)
  getStatusSeverity(status: JobStatus): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    switch (status) {
      case JobStatus.WISHLIST: return 'info'; // Bleu
      case JobStatus.APPLIED: return 'warn'; // Ambre
      case JobStatus.INTERVIEW: return 'secondary'; // Violet
      case JobStatus.OFFER: return 'success'; // Vert
      case JobStatus.REJECTED: return 'danger'; // Rouge
      default: return 'info';
    }
  }

  // Helper pour obtenir la traduction lisible d'un statut dans l'interface
  getStatusLabel(status: JobStatus): string {
    const option = this.statusOptions.find(o => o.value === status);
    return option ? option.label : '';
  }


}
