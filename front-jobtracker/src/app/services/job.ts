import { inject, Injectable, signal } from '@angular/core';
import { JobOffer } from '../models/jobOffer.model';
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


}
