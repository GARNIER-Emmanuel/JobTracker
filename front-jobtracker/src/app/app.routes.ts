import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'jobs',
        pathMatch: 'full'
    },
    {
        path: 'jobs',
        loadComponent: () => import('./components/jobs/jobs').then(m => m.Jobs)
    }
];
