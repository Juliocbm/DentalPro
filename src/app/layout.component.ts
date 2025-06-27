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
    this.auth.getUser$().subscribe(user => {
      this.usuario = user;
      if (!user) {
        this.router.navigate(['/auth/login']);
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
