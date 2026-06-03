import { Component, inject, OnInit } from '@angular/core';
import { JobCard } from './job-card/job-card';
import { Job } from '../../services/job';
import { JobOffer } from '../../models/jobOffer.model';
import { Skeleton } from 'primeng/skeleton';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-jobs',
  imports: [JobCard, Skeleton, Button],
  templateUrl: './jobs.html',
  styleUrl: './jobs.css',
  // Déclaration des animations Angular pour ce composant
  animations: [
    // Le trigger 'listAnimation' est branché sur le conteneur parent (.jobs-list) dans le HTML
    trigger('listAnimation', [
      // Dès que l'état ou la longueur de la liste change (* <=> *), on déclenche la transition
      transition('* <=> *', [
        // query(':enter') intercepte chaque nouvel élément injecté dans le DOM (ex: lors du filtrage ou chargement)
        query(':enter', [
          // 1. État initial invisible et légèrement décalé vers le bas (de 15px)
          style({ opacity: 0, transform: 'translateY(15px)' }),
          // 2. Stagger introduit un délai de cascade de 80ms entre l'entrée de chaque élément
          // 3. Animate anime l'élément vers son état final (visible et centré) en 300ms
          stagger('80ms', animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })))
        ], { optional: true }) // optional: true évite de planter si la liste est vide au démarrage
      ])
    ])
  ]
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

  deleteJob(job: JobOffer): void {
    if (job.id) {
      this.jobService.delete(job.id);
    }
  }


  openAddForm(): void {
    this.jobService.selectedJobForEdit.set(null); // S'assurer qu'on n'est pas en train d'éditer
    this.jobService.isFormOpen.set(true); // Signaler au tiroir de s'ouvrir
  }

}
