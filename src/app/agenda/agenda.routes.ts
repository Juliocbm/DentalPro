import { Routes } from '@angular/router';

export const AGENDA_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./agenda-home.component').then(m => m.AgendaHomeComponent)
  }
];
