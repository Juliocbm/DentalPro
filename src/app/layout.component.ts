import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router'; // Importar RouterLink
import { AuthService } from './core/auth.service';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink], // Añadir RouterLink a imports
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  alert(msg: string) { window.alert(msg); }

  usuario: any;

  constructor(private auth: AuthService, private router: Router) {
    console.log('🏗️ LayoutComponent constructor ejecutado');
    this.auth.getUser$().subscribe(user => {
      console.log('👤 LayoutComponent - Usuario recibido:', user);
      this.usuario = user;
      if (!user) {
        console.log('❌ LayoutComponent - No hay usuario, redirigiendo a login');
        this.router.navigate(['/auth/login']);
      } else {
        console.log('✅ LayoutComponent - Usuario autenticado, permaneciendo en layout');
      }
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }

  logMenuClick() {
    console.log('[LayoutComponent] Clic en menú Roles y Permisos detectado.');
  }
}
