import { effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Theme {
  isDark = signal<boolean>(false)

  constructor() {
    // 1. Récupérer le thème éventuellement sauvegardé (retourne 'dark', 'light' ou null)
    const savedTheme = localStorage.getItem('theme');
    // 2. Vérifier si le système de l'utilisateur préfère le mode sombre
    const prefersDark = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)').matches : false;

    // 3. Déterminer la valeur initiale
    const initialValue = savedTheme ? (savedTheme === 'dark') : prefersDark;
    this.isDark.set(initialValue);
    // 4. L'effet réactif qui s'exécute à chaque changement de isDark
    effect(() => {
      if (this.isDark()) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');

      } else {
        // TODO: Retirer l'attribut data-theme de document.documentElement
        // Indice : document.documentElement.removeAttribute('data-theme');
        // TODO: Enregistrer la valeur 'light' dans localStorage sous la clé 'theme'
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
      }
    });
  }
  // 5. Inverser la valeur du signal
  toggle(): void {
    // TODO: Utilise la méthode update() pour inverser la valeur de isDark
    this.isDark.update(value => !value);
  }
}