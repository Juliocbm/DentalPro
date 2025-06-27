import { Routes } from '@angular/router';

export const ROLES_PERMISOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./roles-permisos.component').then(m => m.RolesPermisosComponent),
    canActivate: [() => import('./core/role.guard').then(m => m.RoleGuard)],
    data: { role: 'administrador' }
  }
];
