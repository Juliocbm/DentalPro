import { Routes } from '@angular/router';
import { LandingComponent } from './landing.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: '',
    loadComponent: () => import('./layout.component').then(m => m.LayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'admin',
        loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
      },
      {
        path: 'agenda',
        loadChildren: () => import('./agenda/agenda.routes').then(m => m.AGENDA_ROUTES)
      },
      {
        path: 'finanzas',
        loadChildren: () => import('./finanzas/finanzas.routes').then(m => m.FINANZAS_ROUTES)
      },
      {
        path: 'expediente',
        loadChildren: () => import('./expediente/expediente.routes').then(m => m.EXPEDIENTE_ROUTES)
      },
      {
        path: 'personal',
        loadChildren: () => import('./personal/personal.routes').then(m => m.PERSONAL_ROUTES)
      },
      {
        path: 'pacientes',
        loadChildren: () => import('./pacientes/pacientes.routes').then(m => m.PACIENTES_ROUTES)
      },
      {
        path: 'profile',
        loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'admin',
        loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent)
      }
    ]
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/login' }
];
