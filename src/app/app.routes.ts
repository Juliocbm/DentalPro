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
    canActivate: [() => import('./core/auth.guard').then(m => m.AuthGuard)],
    children: [
      {
        path: 'admin',
        loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [() => import('./core/auth.guard').then(m => m.AuthGuard)]
      },
      {
        path: 'agenda',
        loadChildren: () => import('./agenda/agenda.routes').then(m => m.AGENDA_ROUTES),
        canActivate: [() => import('./core/auth.guard').then(m => m.AuthGuard)]
      },
      {
        path: 'finanzas',
        loadChildren: () => import('./finanzas/finanzas.routes').then(m => m.FINANZAS_ROUTES),
        canActivate: [() => import('./core/auth.guard').then(m => m.AuthGuard)]
      },
      {
        path: 'expediente',
        loadChildren: () => import('./expediente/expediente.routes').then(m => m.EXPEDIENTE_ROUTES),
        canActivate: [() => import('./core/auth.guard').then(m => m.AuthGuard)]
      },
      {
        path: 'personal',
        loadChildren: () => import('./personal/personal.routes').then(m => m.PERSONAL_ROUTES),
        canActivate: [() => import('./core/auth.guard').then(m => m.AuthGuard)]
      },
      {
        path: 'pacientes',
        loadChildren: () => import('./pacientes/pacientes.routes').then(m => m.PACIENTES_ROUTES),
        canActivate: [() => import('./core/auth.guard').then(m => m.AuthGuard)]
      }
    ]
  },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/login' }
];
