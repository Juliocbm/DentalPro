import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Panel de Control</h1>
        <p class="text-muted">Bienvenido al sistema de gestión dental</p>
      </div>
      
      <div class="dashboard-cards">
        <div class="card" (click)="navigateToSection('clinica')">
          <div class="card-icon">🏥</div>
          <h3>Clínica Dental</h3>
          <p>Sistema de gestión integral para tu clínica</p>
          <div class="card-stats">
            <span class="stat-item">✅ Sistema activo</span>
          </div>
        </div>
        
        <div class="card" *ngIf="isAdmin" (click)="navigateToSection('admin')">
          <div class="card-icon">⚙️</div>
          <h3>Administración</h3>
          <p>Acceso completo al sistema como administrador</p>
          <div class="card-actions">
            <span class="card-link">
              👥 Gestionar Sistema
            </span>
          </div>
        </div>
        
        <div class="card" (click)="navigateToSection('profile')">
          <div class="card-icon">👤</div>
          <h3>Mi Perfil</h3>
          <p>Gestiona tu información personal</p>
          <div class="card-actions">
            <span class="card-link">
              ✏️ Editar Perfil
            </span>
          </div>
        </div>

        <div class="card" (click)="navigateToSection('pacientes')">
          <div class="card-icon">🦷</div>
          <h3>Pacientes</h3>
          <p>Gestión de pacientes y expedientes</p>
          <div class="card-actions">
            <span class="card-link">
              📋 Ver Pacientes
            </span>
          </div>
        </div>

        <div class="card" (click)="navigateToSection('agenda')">
          <div class="card-icon">📅</div>
          <h3>Agenda</h3>
          <p>Programación de citas y horarios</p>
          <div class="card-actions">
            <span class="card-link">
              🕒 Ver Agenda
            </span>
          </div>
        </div>

        <div class="card" (click)="navigateToSection('expediente')">
          <div class="card-icon">📄</div>
          <h3>Expedientes</h3>
          <p>Historiales médicos y tratamientos</p>
          <div class="card-actions">
            <span class="card-link">
              📋 Ver Expedientes
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      min-height: 100vh;
    }
    .dashboard-header {
      text-align: center;
      margin-bottom: 3rem;
    }
    .dashboard-header h1 {
      color: #1976d2;
      margin: 0 0 0.5rem 0;
      font-size: 2.5rem;
    }
    .text-muted {
      color: #666;
      font-size: 1.1rem;
    }
    .dashboard-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }
    .card {
      cursor: pointer;
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      transition: all 0.3s;
      border: 1px solid #f0f0f0;
    }
    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    }
    .card-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    .card h3 {
      color: #1976d2;
      margin: 0 0 1rem 0;
      font-size: 1.5rem;
    }
    .card p {
      color: #666;
      margin: 0 0 1.5rem 0;
      line-height: 1.5;
    }
    .card-stats {
      margin-top: 1rem;
    }
    .stat-item {
      color: #2e7d32;
      font-size: 0.9rem;
      font-weight: 500;
    }
    .card-actions {
      margin-top: 1rem;
    }
    .card-link {
      display: inline-flex;
      align-items: center;
      color: #1976d2;
      text-decoration: none;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      background: #f3f9ff;
      transition: all 0.2s;
    }
    .card-link:hover {
      background: #e3f2fd;
      text-decoration: none;
    }
    @media (max-width: 768px) {
      .dashboard-container {
        padding: 1rem;
      }
      .dashboard-cards {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  user: any = null;
  isAdmin = false;

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.isAdmin = (user as any)?.user_metadata?.user_type === 'administrador';
      console.log('Dashboard - User loaded:', user);
      console.log('Dashboard - Is admin:', this.isAdmin);
    });
  }
  
  navigateToSection(section: string) {
    switch(section) {
      case 'clinica':
        // For now, stay on dashboard - could navigate to a clinic overview
        console.log('Navigating to clinic section');
        break;
      case 'admin':
        this.router.navigate(['/admin']);
        break;
      case 'profile':
        this.router.navigate(['/profile']);
        break;
      case 'pacientes':
        this.router.navigate(['/pacientes']);
        break;
      case 'agenda':
        this.router.navigate(['/agenda']);
        break;
      case 'expediente':
        this.router.navigate(['/expediente']);
        break;
      default:
        console.log('Unknown section:', section);
    }
  }

  async logout() {
    console.log('🚪 [Dashboard] Iniciando logout...');
    try {
      await this.authService.logout();
      console.log('✅ [Dashboard] Logout exitoso, redirigiendo a login...');
      this.router.navigate(['/auth/login']);
    } catch (error) {
      console.error('❌ [Dashboard] Error durante logout:', error);
      // Redirigir a login incluso si hay error
      this.router.navigate(['/auth/login']);
    }
  }
}
