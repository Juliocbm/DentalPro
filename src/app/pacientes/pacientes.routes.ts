import { Routes } from '@angular/router';

export const PACIENTES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pacientes-home.component').then(m => m.PacientesHomeComponent)
  }
];
