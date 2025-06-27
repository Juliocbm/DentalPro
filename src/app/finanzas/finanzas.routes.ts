import { Routes } from '@angular/router';

export const FINANZAS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./finanzas-home.component').then(m => m.FinanzasHomeComponent)
  }
];
