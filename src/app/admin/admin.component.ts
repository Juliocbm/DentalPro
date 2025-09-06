import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { Router } from '@angular/router';
import { UsersListComponent } from '../users/users-list.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, UsersListComponent],
  template: `
    <div class="admin-container">
      <div class="admin-header">
        <button class="back-btn" (click)="goBack()">
          ← Volver al Dashboard
        </button>
        <h1>Administración del Sistema</h1>
        <p class="text-muted">Panel de administración para gestión de usuarios y configuración</p>
      </div>
      
      <div class="admin-content">
        <app-users-list></app-users-list>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
      min-height: 100vh;
    }
    .admin-header {
      margin-bottom: 2rem;
    }
    .back-btn {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      color: #666;
      margin-bottom: 1rem;
      transition: all 0.2s;
    }
    .back-btn:hover {
      background: #e0e0e0;
      color: #333;
    }
    .admin-header h1 {
      color: #1976d2;
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
    }
    .text-muted {
      color: #666;
      font-size: 1rem;
      margin: 0;
    }
    .admin-content {
      background: white;
      border-radius: 8px;
      padding: 1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    @media (max-width: 768px) {
      .admin-container {
        padding: 1rem;
      }
    }
  `]
})
export class AdminComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  user: any = null;
  isAdmin = false;

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.isAdmin = (user as any)?.user_metadata?.user_type === 'administrador';
      
      // Redirect if not admin
      if (!this.isAdmin) {
        console.log('Access denied - not admin');
        this.router.navigate(['/dashboard']);
      }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
