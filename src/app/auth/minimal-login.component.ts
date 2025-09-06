import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-minimal-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-800">🦷 DentalPro</h1>
          <p class="text-gray-600 mt-2">Iniciar Sesión (Sin Supabase)</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Correo Electrónico
            </label>
            <input 
              type="email" 
              formControlName="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="tu@email.com"
            >
            <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" 
                 class="text-red-500 text-sm mt-1">
              Email es requerido
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input 
              type="password" 
              formControlName="password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            >
            <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" 
                 class="text-red-500 text-sm mt-1">
              Contraseña es requerida
            </div>
          </div>

          <button 
            type="submit" 
            [disabled]="loginForm.invalid || loading"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            ¿No tienes cuenta? 
            <a href="#" class="text-blue-600 hover:underline">Regístrate</a>
          </p>
        </div>

        <div *ngIf="message" class="mt-4 p-3 rounded-md" 
             [class]="messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
          {{ message }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100vh;
    }
  `]
})
export class MinimalLoginComponent {
  loginForm: FormGroup;
  loading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    console.log('🚀 MinimalLoginComponent loaded without Supabase!');
  }

  async onLogin() {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    this.message = '';

    try {
      // Simular login sin Supabase
      await this.simulateLogin();
      
      this.messageType = 'success';
      this.message = '¡Login simulado exitoso! Redirigiendo...';
      
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1500);

    } catch (error: any) {
      this.messageType = 'error';
      this.message = 'Error en login simulado: ' + error.message;
    } finally {
      this.loading = false;
    }
  }

  private async simulateLogin(): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const email = this.loginForm.get('email')?.value;
        if (email === 'test@test.com') {
          resolve();
        } else {
          reject(new Error('Usa test@test.com para probar'));
        }
      }, 1000);
    });
  }

  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }
}
