import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, SystemUser } from '../core/user.service';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="users-container">
      <div class="users-header">
        <h2>Gestión de Usuarios</h2>
        <button class="refresh-btn" (click)="loadUsers()" [disabled]="loading">
          <span *ngIf="!loading">🔄 Actualizar</span>
          <span *ngIf="loading">⏳ Cargando...</span>
        </button>
      </div>

      <div *ngIf="errorMessage" class="error-message">
        <span>❌ {{ errorMessage }}</span>
      </div>

      <div *ngIf="loading && users.length === 0" class="loading-message">
        <span>⏳ Cargando usuarios...</span>
      </div>

      <div *ngIf="!loading && users.length === 0 && !errorMessage" class="no-users-message">
        <span>👥 No se encontraron usuarios</span>
      </div>

      <div *ngIf="users.length > 0" class="users-table-container">
        <table class="users-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Último acceso</th>
              <th>Fecha registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users" class="user-row">
              <td class="user-name">
                <div class="name-container">
                  <span class="full-name">{{ user.full_name || 'Sin nombre' }}</span>
                  <small class="user-id">ID: {{ user.id.substring(0, 8) }}...</small>
                </div>
              </td>
              <td class="user-email">{{ user.email }}</td>
              <td class="user-role">
                <span class="role-badge" [class]="'role-' + user.role">
                  {{ user.role === 'administrador' ? '👑 Admin' : '👤 Usuario' }}
                </span>
              </td>
              <td class="user-status">
                <span class="status-badge" [class]="user.email_confirmed_at ? 'status-confirmed' : 'status-pending'">
                  {{ user.email_confirmed_at ? '✅ Confirmado' : '⏳ Pendiente' }}
                </span>
              </td>
              <td class="last-signin">
                {{ user.last_sign_in_at ? formatDate(user.last_sign_in_at) : 'Nunca' }}
              </td>
              <td class="created-at">
                {{ formatDate(user.created_at) }}
              </td>
              <td class="user-actions">
                <button class="action-btn edit-btn" (click)="editUser(user)" title="Editar usuario">
                  ✏️
                </button>
                <button 
                  class="action-btn delete-btn" 
                  (click)="deleteUser(user)" 
                  [disabled]="user.id === currentUserId"
                  title="Eliminar usuario">
                  🗑️
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="users-summary" *ngIf="users.length > 0">
        <p>Total de usuarios: <strong>{{ users.length }}</strong></p>
        <p>Administradores: <strong>{{ getAdminCount() }}</strong></p>
        <p>Usuarios confirmados: <strong>{{ getConfirmedCount() }}</strong></p>
      </div>
    </div>
  `,
  styles: [`
    .users-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .users-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .users-header h2 {
      color: #1976d2;
      margin: 0;
    }

    .refresh-btn {
      background: #1976d2;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: background 0.2s;
    }

    .refresh-btn:hover:not(:disabled) {
      background: #1565c0;
    }

    .refresh-btn:disabled {
      background: #90caf9;
      cursor: not-allowed;
    }

    .error-message, .loading-message, .no-users-message {
      text-align: center;
      padding: 2rem;
      background: #f5f5f5;
      border-radius: 8px;
      margin: 1rem 0;
    }

    .error-message {
      background: #ffebee;
      color: #c62828;
    }

    .users-table-container {
      overflow-x: auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .users-table {
      width: 100%;
      border-collapse: collapse;
      min-width: 800px;
    }

    .users-table th {
      background: #f5f5f5;
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: #333;
      border-bottom: 2px solid #e0e0e0;
    }

    .users-table td {
      padding: 1rem;
      border-bottom: 1px solid #e0e0e0;
      vertical-align: middle;
    }

    .user-row:hover {
      background: #f9f9f9;
    }

    .name-container {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .full-name {
      font-weight: 500;
      color: #333;
    }

    .user-id {
      color: #666;
      font-size: 0.75rem;
    }

    .role-badge, .status-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .role-administrador {
      background: #e3f2fd;
      color: #1976d2;
    }

    .role-usuario {
      background: #f3e5f5;
      color: #7b1fa2;
    }

    .status-confirmed {
      background: #e8f5e8;
      color: #2e7d32;
    }

    .status-pending {
      background: #fff3e0;
      color: #f57c00;
    }

    .user-actions {
      display: flex;
      gap: 0.5rem;
    }

    .action-btn {
      background: none;
      border: 1px solid #ddd;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s;
    }

    .edit-btn:hover {
      background: #e3f2fd;
      border-color: #1976d2;
    }

    .delete-btn:hover:not(:disabled) {
      background: #ffebee;
      border-color: #f44336;
    }

    .delete-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .users-summary {
      margin-top: 2rem;
      padding: 1rem;
      background: #f5f5f5;
      border-radius: 8px;
      display: flex;
      gap: 2rem;
      flex-wrap: wrap;
    }

    .users-summary p {
      margin: 0;
      color: #666;
    }

    .users-summary strong {
      color: #1976d2;
    }

    @media (max-width: 768px) {
      .users-container {
        padding: 1rem;
      }
      
      .users-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }
      
      .users-summary {
        flex-direction: column;
        gap: 0.5rem;
      }
    }
  `]
})
export class UsersListComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);

  users: SystemUser[] = [];
  loading = false;
  errorMessage = '';
  currentUserId = '';

  ngOnInit() {
    console.log('👥 [UsersListComponent] Inicializando...');
    
    // Obtener el ID del usuario actual
    this.authService.user$.subscribe(user => {
      if (user) {
        this.currentUserId = user.id;
      }
    });

    this.loadUsers();
  }

  async loadUsers() {
    this.loading = true;
    this.errorMessage = '';
    
    try {
      console.log('📋 [UsersListComponent] Cargando usuarios...');
      this.users = await this.userService.getAllUsers();
      console.log('✅ [UsersListComponent] Usuarios cargados:', this.users.length);
    } catch (error: any) {
      console.error('❌ [UsersListComponent] Error cargando usuarios:', error);
      this.errorMessage = 'Error cargando la lista de usuarios. Verifica tus permisos de administrador.';
    } finally {
      this.loading = false;
    }
  }

  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Fecha inválida';
    }
  }

  getAdminCount(): number {
    return this.users.filter(user => user.role === 'administrador').length;
  }

  getConfirmedCount(): number {
    return this.users.filter(user => user.email_confirmed_at).length;
  }

  editUser(user: SystemUser) {
    console.log('✏️ [UsersListComponent] Editando usuario:', user.id);
    // TODO: Implementar modal de edición
    alert(`Función de edición para ${user.full_name} - Próximamente disponible`);
  }

  async deleteUser(user: SystemUser) {
    if (user.id === this.currentUserId) {
      alert('No puedes eliminar tu propia cuenta');
      return;
    }

    const confirmed = confirm(`¿Estás seguro de que quieres eliminar al usuario ${user.full_name}? Esta acción no se puede deshacer.`);
    
    if (confirmed) {
      try {
        console.log('🗑️ [UsersListComponent] Eliminando usuario:', user.id);
        await this.userService.deleteUser(user.id);
        console.log('✅ [UsersListComponent] Usuario eliminado exitosamente');
      } catch (error: any) {
        console.error('❌ [UsersListComponent] Error eliminando usuario:', error);
        alert('Error eliminando el usuario. Verifica tus permisos de administrador.');
      }
    }
  }
}
