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

  // TODO: Déclarer les signaux _loading et loading en haut de la classe
  private readonly _loading = signal(false);
  readonly loading = this._loading.asReadonly()
  readonly isFormOpen = signal(false);

  loadAll(): void {
    this._loading.set(true); // Début du chargement
    this.http.get<JobOffer[]>('/api/jobs')
      .subscribe({
        next: (data) => {
          this._jobs.set(data);
        },
        error: () => {
          this._loading.set(false); // Fin du chargement en cas d'erreur
        },
        complete: () => {
          this._loading.set(false); // Fin du chargement en cas de succès
        }
      });
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
  readonly selectedJobForEdit = signal<JobOffer | null>(null);

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

  // @param offer Les données de l'offre d'emploi à créer (sans son identifiant)
  create(offer: Omit<JobOffer, 'id'>): void {
    this.http.post<JobOffer>('/api/jobs', offer)
      .subscribe((newJob) => {
        // Ajoute la nouvelle offre retournée par la BDD à la fin du tableau réactif
        this._jobs.update((jobs) => [...jobs, newJob]);
      });
  }

  // @param id L'identifiant unique (UUID) de l'offre à modifier
  // @param updatedFields Les champs de l'offre à mettre à jour
  update(id: string, updatedFields: Partial<JobOffer>): void {
    this.http.put<JobOffer>(`/api/jobs/${id}`, updatedFields)
      .subscribe((updatedJob) => {
        // Remplace l'offre existante par la version mise à jour retournée par le serveur
        this._jobs.update((jobs) =>
          jobs.map((job) => (job.id === id ? updatedJob : job))
        );
      });
  }

  // @param id L'identifiant unique (UUID) de l'offre à supprimer
  delete(id: string): void {
    this.http.delete<void>(`/api/jobs/${id}`)
      .subscribe(() => {
        // Filtre le tableau réactif local pour en exclure l'offre supprimée
        this._jobs.update((jobs) => jobs.filter((job) => job.id !== id));
      });
  }


}
