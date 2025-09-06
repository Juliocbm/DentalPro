import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, UserProfile } from '../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="profile-container">
      <div class="profile-header">
        <h2>Mi Perfil</h2>
        <p class="text-muted">Gestiona tu información personal</p>
      </div>

      <div class="profile-content">
        <div class="profile-card">
          <div class="profile-avatar">
            <div class="avatar-circle">
              <i class="ti ti-user"></i>
            </div>
            <h3>{{ currentUser?.full_name || 'Usuario' }}</h3>
            <span class="role-badge" [class]="'role-' + currentUser?.role">
              {{ currentUser?.role === 'administrador' ? '👑 Administrador' : '👤 Usuario' }}
            </span>
          </div>

          <form [formGroup]="profileForm" (ngSubmit)="updateProfile()" class="profile-form">
            <div class="form-row">
              <div class="form-group">
                <label for="first_name">Nombre</label>
                <input 
                  id="first_name" 
                  type="text" 
                  formControlName="first_name" 
                  class="form-control"
                  placeholder="Ingresa tu nombre">
                <small *ngIf="profileForm.get('first_name')?.invalid && profileForm.get('first_name')?.touched" 
                       class="error-message">El nombre es requerido</small>
              </div>
              
              <div class="form-group">
                <label for="last_name">Apellido</label>
                <input 
                  id="last_name" 
                  type="text" 
                  formControlName="last_name" 
                  class="form-control"
                  placeholder="Ingresa tu apellido">
              </div>
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input 
                id="email" 
                type="email" 
                formControlName="email" 
                class="form-control"
                readonly
                title="El email no se puede modificar">
              <small class="text-muted">El email no se puede modificar</small>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="user_type">Tipo de Usuario</label>
                <input 
                  id="user_type" 
                  type="text" 
                  [value]="currentUser?.user_type || 'usuario_basico'"
                  class="form-control"
                  readonly
                  title="El tipo de usuario no se puede modificar">
              </div>
              
              <div class="form-group">
                <label for="tenant_id">Organización</label>
                <input 
                  id="tenant_id" 
                  type="text" 
                  [value]="currentUser?.tenant_id || 'default'"
                  class="form-control"
                  readonly
                  title="La organización no se puede modificar">
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-secondary" (click)="goBack()">
                <i class="ti ti-arrow-left me-2"></i>
                Volver
              </button>
              <button type="submit" class="btn btn-primary" [disabled]="profileForm.invalid || loading">
                <span *ngIf="!loading">
                  <i class="ti ti-device-floppy me-2"></i>
                  Guardar Cambios
                </span>
                <span *ngIf="loading">
                  <i class="ti ti-loader me-2"></i>
                  Guardando...
                </span>
              </button>
            </div>
          </form>
        </div>

        <div class="profile-info">
          <h4>Información de la Cuenta</h4>
          <div class="info-item">
            <strong>ID de Usuario:</strong>
            <span class="user-id">{{ currentUser?.id }}</span>
          </div>
          <div class="info-item">
            <strong>Rol:</strong>
            <span>{{ currentUser?.role === 'administrador' ? 'Administrador' : 'Usuario' }}</span>
          </div>
          <div class="info-item">
            <strong>Estado:</strong>
            <span class="status-active">✅ Activo</span>
          </div>
        </div>
      </div>

      <div *ngIf="message" class="alert" [class]="messageType === 'success' ? 'alert-success' : 'alert-error'">
        {{ message }}
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }

    .profile-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .profile-header h2 {
      color: #1976d2;
      margin-bottom: 0.5rem;
    }

    .profile-content {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 2rem;
    }

    .profile-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .profile-avatar {
      text-align: center;
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid #e0e0e0;
    }

    .avatar-circle {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: #1976d2;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      margin: 0 auto 1rem;
    }

    .profile-avatar h3 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .role-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.85rem;
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

    .profile-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-weight: 600;
      color: #333;
    }

    .form-control {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    .form-control:focus {
      outline: none;
      border-color: #1976d2;
      box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
    }

    .form-control[readonly] {
      background: #f5f5f5;
      color: #666;
    }

    .error-message {
      color: #f44336;
      font-size: 0.85rem;
    }

    .text-muted {
      color: #666;
      font-size: 0.85rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 1rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      transition: all 0.2s;
    }

    .btn-primary {
      background: #1976d2;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #1565c0;
    }

    .btn-primary:disabled {
      background: #90caf9;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #f5f5f5;
      color: #666;
    }

    .btn-secondary:hover {
      background: #e0e0e0;
    }

    .profile-info {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      height: fit-content;
    }

    .profile-info h4 {
      color: #1976d2;
      margin-bottom: 1rem;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      margin-bottom: 1rem;
    }

    .info-item strong {
      color: #333;
      font-size: 0.9rem;
    }

    .user-id {
      font-family: monospace;
      font-size: 0.8rem;
      color: #666;
      word-break: break-all;
    }

    .status-active {
      color: #2e7d32;
    }

    .alert {
      margin-top: 1rem;
      padding: 1rem;
      border-radius: 6px;
      text-align: center;
    }

    .alert-success {
      background: #e8f5e8;
      color: #2e7d32;
      border: 1px solid #c8e6c9;
    }

    .alert-error {
      background: #ffebee;
      color: #c62828;
      border: 1px solid #ffcdd2;
    }

    @media (max-width: 768px) {
      .profile-container {
        padding: 1rem;
      }
      
      .profile-content {
        grid-template-columns: 1fr;
      }
      
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  profileForm: FormGroup;
  currentUser: UserProfile | null = null;
  loading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  constructor() {
    this.profileForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: [''],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    console.log('👤 [ProfileComponent] Inicializando...');
    
    this.authService.user$.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.profileForm.patchValue({
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email
        });
        console.log('✅ [ProfileComponent] Usuario cargado:', user);
      }
    });
  }

  async updateProfile() {
    if (this.profileForm.invalid) {
      console.error('❌ [ProfileComponent] Formulario inválido');
      return;
    }

    this.loading = true;
    this.message = '';

    try {
      console.log('💾 [ProfileComponent] Actualizando perfil...');
      
      const formData = this.profileForm.value;
      
      // TODO: Implementar actualización de perfil en AuthService
      // await this.authService.updateProfile(formData);
      
      // Simulación temporal
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.message = 'Perfil actualizado exitosamente';
      this.messageType = 'success';
      
      console.log('✅ [ProfileComponent] Perfil actualizado exitosamente');
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => {
        this.message = '';
      }, 3000);
      
    } catch (error: any) {
      console.error('❌ [ProfileComponent] Error actualizando perfil:', error);
      this.message = 'Error actualizando el perfil. Intenta de nuevo.';
      this.messageType = 'error';
    } finally {
      this.loading = false;
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
