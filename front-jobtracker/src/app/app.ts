import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JobForm } from './components/jobs/job-form/job-form';
import { Error } from './services/error';
import { HeaderComponent } from './components/header/header';
import { Toast } from 'primeng/toast'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, JobForm, HeaderComponent, Toast],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly errorService = inject(Error);

  protected readonly title = signal('front-jobtracker');
}
