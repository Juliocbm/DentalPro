import { Routes } from '@angular/router';
import { RolesPermisosComponent } from './roles-permisos.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'roles-permisos',
        component: RolesPermisosComponent,
        canActivate: [() => import('../core/guards/role.guard').then(m => m.RoleGuard)],
        data: { role: 'administrador' }
      },
      // Aquí puedes agregar más rutas hijas de administración
    ]
  }
];
