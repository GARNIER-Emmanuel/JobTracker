import { Component, inject, OnInit } from '@angular/core';
import { JobCard } from './job-card/job-card';
import { Job } from '../../services/job';

@Component({
  selector: 'app-jobs',
  imports: [JobCard],
  templateUrl: './jobs.html',
  styleUrl: './jobs.css',
})
export class Jobs implements OnInit {

  protected readonly jobService = inject(Job);
  // Délégué pour que le test component.statistiques soit satisfait
  readonly statistiques = this.jobService.statistiques;
  readonly searchQuery = this.jobService.searchQuery;
  readonly filteredJobs = this.jobService.filteredJobs;

  ngOnInit(): void {
    this.jobService.loadAll();
  }
}
