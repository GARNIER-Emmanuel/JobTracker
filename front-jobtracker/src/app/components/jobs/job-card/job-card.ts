import { Component, Input, Output, EventEmitter } from '@angular/core';
import { JobOffer } from '../../../models/jobOffer.model';

@Component({
  selector: 'app-job-card',
  imports: [],
  templateUrl: './job-card.html',
  styleUrl: './job-card.css',
})
export class JobCard {
  @Input({ required: true }) job!: JobOffer;
  @Output() delete = new EventEmitter<JobOffer>();

  onDelete(): void {
    this.delete.emit(this.job)

  }
}
