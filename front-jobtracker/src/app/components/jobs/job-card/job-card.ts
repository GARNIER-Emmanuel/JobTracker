import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { JobOffer, JobStatus } from '../../../models/jobOffer.model';
import { Job } from '../../../services/job';

@Component({
  selector: 'app-job-card',
  imports: [],
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

  // Méthode appelée lorsque le statut change dans la liste déroulante
  onStatusChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newStatus = select.value as JobStatus;

    if (this.job.id) {
      // 1. On crée une copie complète de l'offre avec le statut mis à jour
      const updatedJob: JobOffer = {
        ...this.job,
        status: newStatus
      };

      // 2. On envoie l'objet complet au service pour que la validation backend passe
      this.jobService.update(this.job.id, updatedJob);
    }
  }


}
