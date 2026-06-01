import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JobForm } from './components/jobs/job-form/job-form';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, JobForm],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  protected readonly title = signal('front-jobtracker');
}
