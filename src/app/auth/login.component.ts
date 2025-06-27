import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-login',
  template: `
    <div class="login-wrapper">
      <div class="login-card">
        <h2 class="login-title">Iniciar Sesión</h2>
        <form [formGroup]="loginForm" (ngSubmit)="login()" class="login-form">
          <div class="form-group">
            <label for="username">Usuario</label>
            <input id="username" type="text" formControlName="username" placeholder="Usuario" [class.invalid]="loginForm.get('username')?.invalid && loginForm.get('username')?.touched" class="form-control" />
            <small *ngIf="loginForm.get('username')?.invalid && loginForm.get('username')?.touched" class="error-message">El usuario es requerido</small>
          </div>
          <div class="form-group">
            <label for="password">Contraseña</label>
            <input id="password" type="password" formControlName="password" placeholder="Contraseña" [class.invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" class="form-control" />
            <small *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" class="error-message">La contraseña es requerida</small>
          </div>
          <button type="submit" class="login-btn" [disabled]="loginForm.invalid || loading">
            <span *ngIf="!loading">Entrar</span>
            <span *ngIf="loading"><span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Entrando...</span>
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 90vh;
      background: #f4f8fb;
    }
    .login-card {
      width: 100%;
      max-width: 400px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      border-radius: 16px;
      padding: 2rem 1.5rem;
      background: #fff;
    }
    .login-title {
      text-align: center;
      margin-bottom: 1.5rem;
      font-weight: 600;
      color: #222;
    }
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .form-control {
      padding: 0.75rem 1rem;
      border: 1px solid #cfd8dc;
      border-radius: 6px;
      font-size: 1rem;
      transition: border 0.2s;
    }
    .form-control.invalid {
      border-color: #f44336;
    }
    .error-message {
      color: #f44336;
      font-size: 0.85rem;
      margin-top: 0.25rem;
    }
    .login-btn {
      width: 100%;
      font-size: 1.1rem;
      padding: 0.75rem;
      border-radius: 8px;
      background: #1976d2;
      color: #fff;
      border: none;
      cursor: pointer;
      transition: background 0.2s;
    }
    .login-btn:disabled {
      background: #90caf9;
      cursor: not-allowed;
    }
    .spinner-border {
      display: inline-block;
      width: 1rem;
      height: 1rem;
      vertical-align: text-bottom;
      border: 0.15em solid currentColor;
      border-right-color: transparent;
      border-radius: 50%;
      animation: spinner-border .75s linear infinite;
    }
    @keyframes spinner-border {
      100% { transform: rotate(360deg); }
    }
  `],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class LoginComponent {
  loading = false;
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.invalid) return;
    this.loading = true;
    const { username, password } = this.loginForm.value;
    this.auth.login({
      username: username ?? '',
      password: password ?? ''
    }).subscribe({
      // En el futuro, 'user' incluirá el token proveniente del backend
      next: (user) => {
        if (user && user.token) {
          // El token ya se guarda en AuthService, aquí podrías hacer lógica adicional si lo necesitas
          this.toastr.success('¡Bienvenido!');
          this.router.navigate(['/dashboard']);
        } else {
          this.toastr.error('Credenciales incorrectas');
          this.loading = false;
        }
      },
      error: () => {
        this.toastr.error('Error en el login');
        this.loading = false;
      }
    });
  }
}
