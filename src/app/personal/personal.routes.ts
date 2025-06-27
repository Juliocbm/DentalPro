import { Routes } from '@angular/router';

export const PERSONAL_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./personal-home.component').then(m => m.PersonalHomeComponent)
  }
];
