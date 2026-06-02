import { computed, inject, Injectable, signal } from '@angular/core';
import { JobOffer, JobStatus } from '../models/jobOffer.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Job {
  private readonly _jobs = signal<JobOffer[]>([]);
  private readonly http = inject(HttpClient);
  readonly jobs = this._jobs.asReadonly();

  loadAll(): void {
    this.http.get<JobOffer[]>('/api/jobs')
      .subscribe((data) => { this._jobs.set(data) });
  }

  readonly statistiques = computed(() => {
    const jobs = this._jobs();
    return {
      total: jobs.length,
      wishlist: jobs.filter(j => j.status === JobStatus.WISHLIST).length,
      applied: jobs.filter(j => j.status === JobStatus.APPLIED).length,
      interview: jobs.filter(j => j.status === JobStatus.INTERVIEW).length,
      offer: jobs.filter(j => j.status === JobStatus.OFFER).length,
      rejected: jobs.filter(j => j.status === JobStatus.REJECTED).length,
    };
  });

  readonly searchQuery = signal<string>('');

  readonly filteredJobs = computed(() => {
    const jobs = this._jobs();
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) {
      return jobs;
    }
    return jobs.filter(job =>
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query)
    );
  });


}
