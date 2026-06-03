import { Component, inject } from '@angular/core';
import { Theme } from '../../services/theme';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {
  protected readonly themeService = inject(Theme);
}
