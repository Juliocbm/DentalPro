import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';

@Component({
  standalone: true,
  selector: 'app-login',
  template: `
    <div class="login-wrapper">
      <p-card header="Iniciar Sesión" class="login-card">
        <form [formGroup]="loginForm" (ngSubmit)="login()" class="login-form">
          <div class="p-field">
            <label for="username">Usuario</label>
            <span class="p-input-icon-left">
              <i class="pi pi-user"></i>
              <input id="username" pInputText formControlName="username" placeholder="Usuario" [ngClass]="{'ng-invalid': loginForm.get('username')?.invalid && loginForm.get('username')?.touched}" />
            </span>
            <small *ngIf="loginForm.get('username')?.invalid && loginForm.get('username')?.touched" class="p-error">El usuario es requerido</small>
          </div>
          <div class="p-field">
            <label for="password">Contraseña</label>
            <span class="p-input-icon-left">
              <i class="pi pi-lock"></i>
              <input id="password" pPassword formControlName="password" placeholder="Contraseña" [feedback]="false" [ngClass]="{'ng-invalid': loginForm.get('password')?.invalid && loginForm.get('password')?.touched}" />
            </span>
            <small *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" class="p-error">La contraseña es requerida</small>
          </div>
          <button pButton type="submit" label="Entrar" class="login-btn" [disabled]="loginForm.invalid || loading">
            <span *ngIf="!loading">Entrar</span>
            <span *ngIf="loading"><i class="pi pi-spin pi-spinner"></i> Entrando...</span>
          </button>
        </form>
      </p-card>
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
    }
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .p-field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .p-input-icon-left {
      width: 100%;
    }
    input[ngClass].ng-invalid {
      border-color: #f44336;
    }
    .p-error {
      color: #f44336;
      font-size: 0.85rem;
      margin-top: 0.25rem;
    }
    .login-btn {
      width: 100%;
      font-size: 1.1rem;
      padding: 0.75rem;
      border-radius: 8px;
    }
  `],
  imports: [
    CommonModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule
  ,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule
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
          this.router.navigate(['/agenda']);
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
