import { Routes } from '@angular/router';
import { RolesPermisosComponent } from './roles-permisos.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'roles-permisos',
    component: RolesPermisosComponent,
    canActivate: [() => import('../core/role.guard').then(m => m.RoleGuard)],
    data: { role: 'administrador' }
  },
  // Puedes agregar más rutas de administración aquí
];
